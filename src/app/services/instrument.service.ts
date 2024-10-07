import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Instrument } from '../models/instrument.model';

@Injectable({
  providedIn: 'root'
})
export class InstrumentService {
  private apiUrl = 'https://api.reaperaccessible.fr/instrument';

  constructor(private http: HttpClient) {}

  getAllInstruments(): Observable<Instrument[]> {
    return this.http.get<Instrument[]>(this.apiUrl);
  }

  getInstrumentById(id: number): Observable<Instrument> {
    return this.http.get<Instrument>(`${this.apiUrl}/${id}`);
  }
}
