import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CourseService } from '../../services/course.service';
import { ChapterService } from '../../services/chapter.service';
import { CourseWithInstructor } from '../../models/course.model';
import { Chapter } from '../../models/chapter.model';
import { switchMap, tap } from 'rxjs/operators';
import videojs from 'video.js';

@Component({
  selector: 'app-course-content',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './course-content.component.html',
  styleUrls: ['./course-content.component.scss']
})
export class CourseContentComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef;

  courseWithInstructor: CourseWithInstructor | null = null;
  chapters: Chapter[] = [];
  currentChapter: Chapter | null = null;
  player: any;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private chapterService: ChapterService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const courseId = Number(params.get('id'));
        return this.courseService.getCourseById(courseId);
      }),
      tap(course => {
        this.courseWithInstructor = course;
      }),
      switchMap(course => {
        return this.chapterService.getChaptersByCourseId(course.course.id);
      })
    ).subscribe(
      chapters => {
        this.chapters = chapters;
        if (chapters.length > 0) {
          this.selectChapter(chapters[0]);
        }
      },
      error => {
        console.error('Error fetching chapters:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    this.initializeVideoPlayer();
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }

  selectChapter(chapter: Chapter): void {
    this.currentChapter = chapter;
    if (this.player && chapter.video_url) {
      this.player.src({ type: 'video/mp4', src: chapter.video_url });
    }
  }

  private initializeVideoPlayer(): void {
    if (this.currentChapter && this.currentChapter.video_url) {
      this.player = videojs(this.videoPlayer.nativeElement, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true,
        sources: [{ type: 'video/mp4', src: this.currentChapter.video_url }],
        controlBar: {
          children: [
            'playToggle',
            'volumePanel',
            'currentTimeDisplay',
            'timeDivider',
            'durationDisplay',
            'progressControl',
            'liveDisplay',
            'remainingTimeDisplay',
            'customControlSpacer',
            'playbackRateMenuButton',
            'chaptersButton',
            'descriptionsButton',
            'subsCapsButton',
            'audioTrackButton',
            'fullscreenToggle'
          ]
        }
      });
    }
  }
}
