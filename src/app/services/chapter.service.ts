import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chapter } from '../models/chapter.model';

@Injectable({
  providedIn: 'root'
})
export class ChapterService {
  private apiUrl = 'https://api.reaperaccessible.fr/course';  // Notez le changement ici

  constructor(private http: HttpClient) {}

  getChaptersByCourseId(courseId: number): Observable<Chapter[]> {
    return this.http.get<Chapter[]>(`${this.apiUrl}/${courseId}/chapters`);
  }

  getChapterById(chapterId: number): Observable<Chapter> {
    return this.http.get<Chapter>(`${this.apiUrl}/chapter/${chapterId}`);
  }
}