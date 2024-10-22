import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { SchoolData } from '@interfaces/school-data.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  coordenadasDistritos = [
    {
      name: "ciutat vella",
      lat: 41.382318,
      long: 2.183208
    },
    {
      name: "sant marti",
      lat: 41.405992,
      long: 2.206992
    },
    {
      name: "eixample",
      lat: 41.394545,
      long: 2.168696
    },
    {
      name: "sants-montjuich",
      lat: 41.337789,
      long: 2.136850
    },
    {
      name: "les corts",
      lat: 41.385752,
      long: 2.111197
    },
    {
      name: "sarria-sant gervasi",
      lat: 41.408457,
      long: 2.118184
    },
    {
      name: "gracia",
      lat: 41.405267,
      long: 2.159091
    },
    {
      name: "horta-guinardo",
      lat: 41.431491,
      long: 2.153635
    },
    {
      name: "nou barris",
      lat: 41.443778,
      long: 2.174197
    },
    {
      name: "sant andreu",
      lat: 41.438148,
      long: 2.195814
    }
  ]

  constructor() { }

  getSchoolData(): Observable<SchoolData>{
    // return this.http.get<SchoolData>(`${this.baseUrl}/districts/infantil`)
    return this.http.get<SchoolData>("https://hackatonitacademy-4eb658690555.herokuapp.com/api/districts/infantil");
  }



}
