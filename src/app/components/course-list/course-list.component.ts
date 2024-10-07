import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CourseWithInstructor, CourseLanguage, Course, InitialCourse, CoverCourse } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { Instrument } from '../../models/instrument.model';
import { InstrumentService } from '../../services/instrument.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  allCourses$!: Observable<CourseWithInstructor[]>;
  filteredCourses$!: Observable<CourseWithInstructor[]>;
  pagedCourses$!: Observable<CourseWithInstructor[]>;
  instruments$!: Observable<Instrument[]>;
  pageSize$ = new BehaviorSubject<number | 'all'>(5);
  currentPage$ = new BehaviorSubject<number>(1);
  totalPages$!: Observable<number>;
  instrumentFilter$ = new BehaviorSubject<number | null>(null);
  languageFilter$ = new BehaviorSubject<CourseLanguage | ''>('');
  pageSizeOptions: (number | 'all')[] = [5, 10, 20, 50, 'all'];
  languages: CourseLanguage[] = ['fr', 'en'];

  constructor(
    private courseService: CourseService,
    private instrumentService: InstrumentService,
    private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.instruments$ = this.instrumentService.getAllInstruments();

    this.allCourses$ = this.route.data.pipe(
      switchMap(data => {
        if (data['category'] === 'initial') {
          return this.courseService.getInitialCourses();
        } else if (data['category'] === 'cover') {
          return this.courseService.getCoverCourses();
        } else {
          return this.courseService.getAllCourses();
        }
      })
    );

    this.filteredCourses$ = combineLatest([this.allCourses$, this.instrumentFilter$, this.languageFilter$]).pipe(
      map(([courses, instrumentFilter, languageFilter]) => {
        return courses.filter(courseWithInstructor =>
          this.courseMatchesFilter(courseWithInstructor.course, instrumentFilter) &&
          (languageFilter === '' || courseWithInstructor.course.language === languageFilter)
        );
      })
    );

    this.totalPages$ = combineLatest([this.filteredCourses$, this.pageSize$]).pipe(
      map(([courses, pageSize]) => pageSize === 'all' ? 1 : Math.ceil(courses.length / (pageSize as number)))
    );

    this.pagedCourses$ = combineLatest([
      this.filteredCourses$,
      this.pageSize$,
      this.currentPage$
    ]).pipe(
      map(([courses, pageSize, currentPage]) => {
        if (pageSize === 'all') return courses;
        const startIndex = (currentPage - 1) * (pageSize as number);
        return courses.slice(startIndex, startIndex + (pageSize as number));
      })
    );
  }

  getInstrumentKey(instrumentId: number, instruments: Instrument[]): string {
    const instrument = instruments.find(i => i.id === instrumentId);
    return instrument ? instrument.nameKey.split('.')[1] : 'unknown';
  }

  onPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newSize = selectElement.value === 'all' ? 'all' : Number(selectElement.value);
    this.pageSize$.next(newSize);
    this.currentPage$.next(1);
  }

  onPreviousPage(): void {
    this.currentPage$.next(this.currentPage$.value - 1);
  }

  onNextPage(): void {
    this.currentPage$.next(this.currentPage$.value + 1);
  }

  onInstrumentFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.instrumentFilter$.next(selectElement.value ? Number(selectElement.value) : null);
    this.currentPage$.next(1);
  }

  onLanguageFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.languageFilter$.next(selectElement.value as CourseLanguage | '');
    this.currentPage$.next(1);
  }

  private courseMatchesFilter(course: Course, filter: number | null): boolean {
    if (filter === null) return true;
    return course.instrument_id === filter;
  }

  trackByCourseId(index: number, courseWithInstructor: CourseWithInstructor): number {
    return courseWithInstructor.course.id;
  }
}
