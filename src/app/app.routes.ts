import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { SongListComponent } from './components/song-list/song-list.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { SongDetailComponent } from './components/song-detail/song-detail.component';
import { CourseContentComponent } from './components/course-content/course-content.component';

export const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'courses', component: CourseListComponent
  },
  {
    path: 'initial-courses', component: CourseListComponent,
    data: 
    {
      category: 'initial'
    }
  },
  {
    path: 'courses/:id', component: CourseDetailComponent
  },
  {
    path: 'courses/:id/content',
    component: CourseContentComponent
  },
  {
    path: 'songs', component: SongListComponent
  },
  {
    path: 'songs/:id', component: SongDetailComponent
  },
  {
    path: '**', redirectTo: ''
  }
];