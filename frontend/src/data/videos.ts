export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
}

export const videos: Video[] = [
  {
    id: 'video-1',
    title: 'Катя играет',
    description: 'Любопытная Катя исследует мир',
    thumbnail: '/images/D0AF5B22-724D-4440-846C-3F1BAF851FCC.jpeg',
    videoUrl: '/video-files/8E907C3F-0D05-40B0-A192-459A1D704F76_3.mp4',
  },
  {
    id: 'video-2',
    title: 'Гаврик отдыхает',
    description: 'Расслабленный Гаврик наслаждается моментом',
    thumbnail: '/images/IMG_2754.jpeg',
    videoUrl: '/video-files/918260A4-9580-4E91-8682-0ABAE0CCA632.mp4',
  },
  {
    id: 'video-3',
    title: 'Веселые моменты',
    description: 'Наши пушистые проказничают',
    thumbnail: '/images/IMG_2783.jpeg',
    videoUrl: '/video-files/EBFB6F1E-D096-4F62-8483-5107BC3D82A3_3.mp4',
  },
];
