import { Component, Input, OnChanges, SimpleChanges, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as d3 from 'd3';
import { axisBottom, axisLeft, scaleBand, scaleLinear, select } from 'd3';

interface BarChartData {
  value: number;
  label: string;
}

@Component({
  selector: 'app-bar-chart',
  template: '<div class="chart" #chart></div>',
  standalone: true,
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() data: number[] = [];
  @Input() labels: string[] = [];
  @ViewChild('chart') private chartContainer!: ElementRef;
  
  private _svg: any;
  private margin = { top: 20, right: 30, bottom: 40, left: 40 };
  private width: number = 500 - this.margin.left - this.margin.right;
  private height: number = 300 - this.margin.top - this.margin.bottom;
  private chartInitialized: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.createChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (isPlatformBrowser(this.platformId) && this.chartInitialized && (changes['data'] || changes['labels'])) {
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

    const svg = select(element)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    this._svg = svg.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // Configurar ejes iniciales
    const x = scaleBand<string>()
      .domain(this.labels)
      .range([0, this.width])
      .padding(0.1);

    const y = scaleLinear()
      .domain([0, d3.max(this.data, d => d) || 0])
      .nice()
      .range([this.height, 0]);

    this._svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${this.height})`)
      .call(axisBottom(x));

    this._svg.append('g')
      .attr('class', 'y-axis')
      .call(axisLeft(y));

    this.chartInitialized = true;
    this.updateChart(); // Dibujar barras iniciales
  }

  private updateChart() {
    const x = scaleBand<string>()
      .domain(this.labels)
      .range([0, this.width])
      .padding(0.1);

    const y = scaleLinear()
      .domain([0, d3.max(this.data, d => d) || 0])
      .nice()
      .range([this.height, 0]);

    // Actualizar ejes
    this._svg.select('.x-axis').call(axisBottom(x));
    this._svg.select('.y-axis').call(axisLeft(y));

    // Actualizar barras
    const bars = this._svg.selectAll('.bar')
      .data(this.data.map((value, index) => ({ value, label: this.labels[index] })));

    bars.exit().remove();

    bars.enter()
      .append('rect')
      .attr('class', 'bar')
      .merge(bars)
      .attr('x', (d: { label: string; }) => x(d.label) || 0)
      .attr('y', (d: { value: d3.NumberValue; }) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d: { value: d3.NumberValue; }) => this.height - y(d.value))
      .attr('fill', 'steelblue');
  }
}