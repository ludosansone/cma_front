import { Component } from '@angular/core';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { SongService } from '../../services/song.service';
import { Song } from '../../models/song.model';
import { CourseWithInstructor } from '../../models/course.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-song-detail',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, RouterLink, TranslateModule],
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss']
})
export class SongDetailComponent {
  song$: Observable<Song>;
  courses$: Observable<CourseWithInstructor[]>;

  constructor(
    private route: ActivatedRoute,
    private songService: SongService
  ) {
    this.song$ = this.route.paramMap.pipe(
      switchMap(params => {
        const songId = Number(params.get('id'));
        return this.songService.getSongById(songId);
      })
    );

    this.courses$ = this.route.paramMap.pipe(
      switchMap(params => {
        const songId = Number(params.get('id'));
        return this.songService.getCoursesBySongId(songId);
      })
    );
  }
}
