import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { MarvelHeroe } from "../model/mavelHeroe.model";

@Injectable({
  providedIn: 'root'
})
export class MarvelHeroesService {

  constructor(private http: HttpClient) { }

  loadMockData(): Observable<any[]> {
    return this.http.get<any[]>('assets/wikipedia_marvel_data.json').pipe(
      map((data: { id: any; }[]) => data.map((hero, index: number) => ({
        ...hero,
        id: index + 1,
      })))
    );
  }
}