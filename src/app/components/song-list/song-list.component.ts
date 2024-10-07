import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CourseWithInstructor, CoverCourse } from '../../models/course.model';
import { Song } from '../../models/song.model';
import { CourseService } from '../../services/course.service';
import { SongService } from '../../services/song.service';
import { InstrumentService } from '../../services/instrument.service';
import { Instrument } from '../../models/instrument.model';

interface SongWithInstruments extends Song {
  availableInstrumentIds: number[];
  availableInstrumentNames: string[];
}

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, RouterLink, TranslateModule],
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {
  allSongs$!: Observable<SongWithInstruments[]>;
  filteredSongs$!: Observable<SongWithInstruments[]>;
  pagedSongs$!: Observable<SongWithInstruments[]>;
  pageSize$ = new BehaviorSubject<number | 'all'>(5);
  currentPage$ = new BehaviorSubject<number>(1);
  totalPages$!: Observable<number>;
  instrumentFilter$ = new BehaviorSubject<number | null>(null);
  pageSizeOptions: (number | 'all')[] = [5, 10, 20, 50, 'all'];
  instruments$: Observable<Instrument[]>;

  constructor(
    private courseService: CourseService,
    private songService: SongService,
    private instrumentService: InstrumentService,
    private translateService: TranslateService
  ) {
    this.instruments$ = this.instrumentService.getAllInstruments();
  }

  ngOnInit(): void {
    this.allSongs$ = combineLatest([
      this.songService.getAllSongs(),
      this.courseService.getCoverCourses(),
      this.instruments$
    ]).pipe(
      map(([songs, coverCourses, instruments]) => 
        songs.map(song => {
          const relatedCourses = coverCourses.filter(courseWithInstructor => 
            (courseWithInstructor.course as CoverCourse).song_id === song.id
          );
          const instrumentIds = [...new Set(relatedCourses.map(cwi => cwi.course.instrument_id))];
          const instrumentNames = instrumentIds.map(id => {
            const instrument = instruments.find(inst => inst.id === id);
            return instrument ? this.translateService.instant(instrument.nameKey) : 'Unknown Instrument';
          });
          return {
            ...song,
            availableInstrumentIds: instrumentIds,
            availableInstrumentNames: instrumentNames
          };
        })
      ),
      map(songs => songs.filter(song => song.availableInstrumentIds.length > 0)),
      catchError(error => {
        console.error('Error in allSongs$:', error);
        return [];
      })
    );

    this.filteredSongs$ = combineLatest([this.allSongs$, this.instrumentFilter$]).pipe(
      map(([songs, filter]) => {
        if (filter === null) return songs;
        return songs.filter(song => song.availableInstrumentIds.includes(filter));
      })
    );

    this.totalPages$ = combineLatest([this.filteredSongs$, this.pageSize$]).pipe(
      map(([songs, pageSize]) => pageSize === 'all' ? 1 : Math.ceil(songs.length / (pageSize as number)))
    );

    this.pagedSongs$ = combineLatest([
      this.filteredSongs$,
      this.pageSize$,
      this.currentPage$
    ]).pipe(
      map(([songs, pageSize, currentPage]) => {
        if (pageSize === 'all') return songs;
        const startIndex = (currentPage - 1) * (pageSize as number);
        return songs.slice(startIndex, startIndex + (pageSize as number));
      })
    );
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

  trackBySongId(index: number, song: SongWithInstruments): number {
    return song.id;
  }
}
