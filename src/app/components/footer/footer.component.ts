import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <footer>
      {{ 'footer.numberOfCourse' | translate }}: {{ totalCourses$ | async }}
      <p>© {{ currentYear }} Cover Academy, {{ 'footer.allRightReserved' | translate }}</p>
    </footer>
  `,
  styleUrls: ['footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();
  totalCourses$: Observable<number>;

  constructor(private courseService: CourseService) {
    this.totalCourses$ = this.courseService.getAllCourses().pipe(
      map(courses => courses.length)
    );
  }

  ngOnInit(): void {}
}