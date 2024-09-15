export interface Song {
    id: number;
    title: string;
    artist: string;
    originalReleaseYear: number;
    tempo: number;
    genre: string;
    language: string;
    version: 'live' | 'studio';
    key: string;
}
