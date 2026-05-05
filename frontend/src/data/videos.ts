export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  year: number;
}

export const videos: Video[] = [
  {
    id: '8E907C3F-0D05-40B0-A192-459A1D704F76_3.mp4',
    title: 'Video 1',
    description: 'Video from assets',
    videoUrl: '/video-files/8E907C3F-0D05-40B0-A192-459A1D704F76_3.mp4',
    year: 2025,
  },
];