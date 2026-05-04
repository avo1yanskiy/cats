import { useState } from 'react';
import './VideoSection.css';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
}

interface VideoSectionProps {
  videos: Video[];
}

function VideoSection({ videos }: VideoSectionProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <>
      <div className="videos-grid">
        {videos.map((video) => (
          <div key={video.id} className="video-card" onClick={() => setSelectedVideo(video)}>
            <div className="video-thumbnail">
              <img src={video.thumbnail} alt={video.title} />
              <div className="video-play-icon">▶</div>
            </div>
            <div className="video-info">
              <h3>{video.title}</h3>
              <p>{video.description}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <div className="video-modal" onClick={() => setSelectedVideo(null)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setSelectedVideo(null)}>✕</button>
            <video src={selectedVideo.videoUrl} controls autoPlay />
            <div className="video-modal-info">
              <h3>{selectedVideo.title}</h3>
              <p>{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VideoSection;
