import { Instructor } from './instructor.model';

export type CourseCategory = 'initial' | 'cover';
export type StarRating = 1 | 2 | 3 | 4 | 5;
export type CourseLanguage = 'fr' | 'en';

export interface BaseCourse {
  id: number;
  title: string;
  description: string;
  instructor_id: number;
  duration: number;
  price: number;
  category: CourseCategory;
  video_url: string;
  star_rating: StarRating;
  language: CourseLanguage;
  instrument_id: number;
}

export interface InitialCourse extends BaseCourse {
  category: 'initial';
  concept: string;
}

export interface CoverCourse extends BaseCourse {
  category: 'cover';
  song_id: number;
}

export type Course = InitialCourse | CoverCourse;

export interface CourseWithInstructor {
  course: Course;
  instructor: Instructor;
}
