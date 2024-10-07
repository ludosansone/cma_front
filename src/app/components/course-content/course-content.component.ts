import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CourseService } from '../../services/course.service';
import { ChapterService } from '../../services/chapter.service';
import { CourseWithInstructor } from '../../models/course.model';
import { Chapter } from '../../models/chapter.model';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-course-content',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './course-content.component.html',
  styleUrls: ['./course-content.component.scss']
})
export class CourseContentComponent implements OnInit, AfterViewInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('progressBar') progressBar!: ElementRef<HTMLDivElement>;
  @ViewChild('seekBar') seekBar!: ElementRef<HTMLInputElement>;

  courseWithInstructor: CourseWithInstructor | null = null;
  chapters: Chapter[] = [];
  currentChapter: Chapter | null = null;
  isPlaying: boolean = false;
  currentTime: string = '0:00';
  duration: string = '0:00';

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
    if (this.videoPlayer) {
      const video = this.videoPlayer.nativeElement;
      
      video.addEventListener('durationchange', () => {
        if (!isNaN(video.duration) && isFinite(video.duration)) {
          this.duration = this.formatTime(video.duration);
          if (this.seekBar) {
            this.seekBar.nativeElement.max = `${video.duration}`;
          }
        }
      });

      video.addEventListener('timeupdate', () => {
        if (!isNaN(video.currentTime) && isFinite(video.currentTime)) {
          this.currentTime = this.formatTime(video.currentTime);
          if (this.progressBar && !isNaN(video.duration) && video.duration > 0) {
            const progress = (video.currentTime / video.duration) * 100;
            this.progressBar.nativeElement.style.width = `${progress}%`;
          }
          if (this.seekBar) {
            this.seekBar.nativeElement.value = `${video.currentTime}`;
          }
        }
      });
    }
  }

  selectChapter(chapter: Chapter): void {
    this.currentChapter = chapter;
    if (this.videoPlayer && chapter.video_url) {
      this.videoPlayer.nativeElement.src = chapter.video_url;
      this.videoPlayer.nativeElement.load();
      this.isPlaying = false;
      this.currentTime = '0:00';
      this.duration = '0:00';
    }
  }

  togglePlay(): void {
    if (this.videoPlayer) {
      if (this.isPlaying) {
        this.videoPlayer.nativeElement.pause();
      } else {
        this.videoPlayer.nativeElement.play();
      }
      this.isPlaying = !this.isPlaying;
    }
  }

  seekVideo(seconds: number): void {
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.currentTime += seconds;
    }
  }

  onSeekBarChange(): void {
    if (this.videoPlayer && this.seekBar) {
      this.videoPlayer.nativeElement.currentTime = Number(this.seekBar.nativeElement.value);
    }
  }

  onProgressBarClick(event: MouseEvent): void {
    if (this.videoPlayer && this.progressBar) {
      const rect = this.progressBar.nativeElement.getBoundingClientRect();
      const clickPosition = (event.clientX - rect.left) / rect.width;
      this.videoPlayer.nativeElement.currentTime = clickPosition * this.videoPlayer.nativeElement.duration;
    }
  }

  formatTime(timeInSeconds: number): string {
    if (isNaN(timeInSeconds) || !isFinite(timeInSeconds)) {
      return '0:00';
    }
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
