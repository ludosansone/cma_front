import { Component } from '@angular/core';
import { AsyncPipe, NgIf, NgSwitch, NgSwitchCase, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Observable, switchMap, map } from 'rxjs';
import { CourseWithInstructor, InitialCourse, CoverCourse, Course } from '../../models/course.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgSwitch, NgSwitchCase, TranslateModule, CurrencyPipe],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent {
  courseWithInstructor$: Observable<CourseWithInstructor>;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {
    this.courseWithInstructor$ = this.route.paramMap.pipe(
      switchMap(params => {
        const courseId = Number(params.get('id'));
        return this.courseService.getCourseById(courseId);
      }),
      map(result => {
        if (result && 'course' in result && 'instructor' in result) {
          return result as CourseWithInstructor;
        }
        throw new Error('Invalid data structure received from API');
      })
    );
  }

  isInitialCourse(course: Course): course is InitialCourse {
    return course.category === 'initial';
  }

  isCoverCourse(course: Course): course is CoverCourse {
    return course.category === 'cover';
  }

  getConcept(course: Course): string {
    return this.isInitialCourse(course) ? course.concept : '';
  }

  getSongId(course: Course): number | undefined {
    return this.isCoverCourse(course) ? course.song_id : undefined;
  }
}
