import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, InitialCourse, CoverCourse, CourseWithInstructor, CourseLanguage } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'https://api.reaperaccessible.fr/course';

  constructor(private http: HttpClient) {}

  getAllCourses(language?: CourseLanguage): Observable<CourseWithInstructor[]> {
    let url = this.apiUrl;
    if (language) {
      url += `?language=${language}`;
    }
    return this.http.get<CourseWithInstructor[]>(url);
  }

  getInitialCourses(): Observable<CourseWithInstructor[]> {
    return this.http.get<CourseWithInstructor[]>(`${this.apiUrl}/initial`);
  }

  getCoverCourses(): Observable<CourseWithInstructor[]> {
    return this.http.get<CourseWithInstructor[]>(`${this.apiUrl}/cover`);
  }

  getCourseById(id: number): Observable<CourseWithInstructor> {
    return this.http.get<CourseWithInstructor>(`${this.apiUrl}/${id}`);
  }
}
