import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from '../models/song.model';
import { CourseWithInstructor } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private apiUrl = 'https://api.reaperaccessible.fr/song';

  constructor(private http: HttpClient) {}

  getAllSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(this.apiUrl);
  }

  getSongById(id: number): Observable<Song> {
    return this.http.get<Song>(`${this.apiUrl}/${id}`);
  }

  getCoursesBySongId(songId: number): Observable<CourseWithInstructor[]> {
    return this.http.get<CourseWithInstructor[]>(`${this.apiUrl}/${songId}/courses`);
  }
}
