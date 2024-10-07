import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Instructor } from '../models/instructor.model';
import { Instrument } from '../models/instrument.model';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private apiUrl = 'https://api.reaperaccessible.fr/instructor';

  constructor(private http: HttpClient) {}

  getAllInstructors(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(this.apiUrl).pipe(
      map(instructors => this.populateInstruments(instructors))
    );
  }

  getInstructorById(id: number): Observable<Instructor> {
    return this.http.get<Instructor>(`${this.apiUrl}/${id}`).pipe(
      map(instructor => this.populateInstruments([instructor])[0])
    );
  }

  private populateInstruments(instructors: Instructor[]): Instructor[] {
    return instructors.map(instructor => ({
      ...instructor,
      instruments: instructor.instruments.map(instrumentId => 
        this.getInstrumentById(instrumentId as unknown as number)
      )
    }));
  }

  private getInstrumentById(id: number): Instrument {
    // Cette méthode devrait idéalement faire un appel à l'API pour obtenir les détails de l'instrument
    // Pour l'instant, nous allons simuler cela avec des données statiques
    const instruments: { [key: number]: Instrument } = {
      1: { id: 1, nameKey: 'instrument.acoustic-guitar', category: 'string', icon: 'acoustic-guitar-icon' },
      2: { id: 2, nameKey: 'instrument.electric-guitar', category: 'string', icon: 'electric-guitar-icon' },
      // ... ajoutez d'autres instruments ici
    };
    return instruments[id] || { id, nameKey: 'unknown', category: 'unknown', icon: 'unknown' };
  }
}
