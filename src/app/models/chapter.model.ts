export interface Chapter {
    id: number;
    title: string;
    content: string;
    order: number;
    course_id: number;
    video_url: string;
    video_duration: number;
    created_at: string;
    updated_at: string;
    status: 'draft' | 'published' | 'archived';
    tags: string[];
    additional_resources: string[];
}
