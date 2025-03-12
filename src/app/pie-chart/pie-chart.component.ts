import { Component, Input, OnChanges, SimpleChanges, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { pie, arc, PieArcDatum, scaleOrdinal, schemeCategory10, select } from 'd3';

interface PieChartData {
  label: string;
  value: number;
}

@Component({
  selector: 'app-pie-chart',
  template: '<div class="chart" #chart></div>',
  standalone: true,
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() data: number[] = [];
  @Input() labels: string[] = [];
  
  @ViewChild('chart') private chartContainer!: ElementRef;
  
  private svg: any;
  private width: number = 300;
  private height: number = 300;
  private radius: number = Math.min(this.width, this.height) / 2;
  private color: any;
  private pie: any;
  private arc: any;
  private chartInitialized: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.createChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chartInitialized && (changes['data'] || changes['labels'])) {
      this.updateChart();
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      select(this.chartContainer.nativeElement).html('');
    }
  }

  private createChart() {
    const element = this.chartContainer.nativeElement;
    select(element).html(''); // Limpiar contenedor

    this.svg = select(element)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);

    this.color = scaleOrdinal(schemeCategory10);
    this.pie = pie<PieChartData>()
      .value(d => d.value);

    this.arc = arc<PieArcDatum<PieChartData>>()
      .outerRadius(this.radius - 10)
      .innerRadius(0);

    this.chartInitialized = true;
    this.updateChart(); // Dibujar datos iniciales
  }

  private updateChart() {
    if (!this.data || !this.labels || this.data.length !== this.labels.length) return;

    const pieData: PieChartData[] = this.labels.map((label, i) => ({
      label,
      value: this.data[i]
    }));

    const arcs = this.pie(pieData);

    // Actualizar porciones del pastel
    const paths = this.svg.selectAll('path')
      .data(arcs);

    paths.enter()
      .append('path')
      .merge(paths)
      .attr('d', this.arc)
      .attr('fill', (d: PieArcDatum<PieChartData>) => this.color(d.data.label))
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    paths.exit().remove();

    // Actualizar etiquetas
    const labels = this.svg.selectAll('text')
      .data(arcs);

    labels.enter()
      .append('text')
      .merge(labels)
      .attr('transform', (d: PieArcDatum<PieChartData>) => `translate(${this.arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .text((d: PieArcDatum<PieChartData>) => d.data.label);

    labels.exit().remove();
  }
}