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
    title: 'Катя играет с бантиком',
    description: 'Катя показывает свои охотничьи навыки',
    thumbnail: '/images/cat-katya.jpg',
    videoUrl: '/videos/video-1.mp4',
  },
  {
    id: 'video-2',
    title: 'Гаврик спит',
    description: 'Уютное видео с храпящим Гавриком',
    thumbnail: '/images/cat-gavrik.jpg',
    videoUrl: '/videos/video-2.mp4',
  },
];
