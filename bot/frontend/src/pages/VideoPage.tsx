import { useState } from 'react';
import { videos } from '../data/videos';
import '../pages/VideoPage.css';

function VideoPage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'katya' | 'gavrik'>('all');

  const filteredVideos = activeTab === 'all'
    ? videos
    : videos.filter(v => v.videoUrl.toLowerCase().includes(activeTab));

  const openVideo = (id: string) => setActiveVideo(id);
  const closeVideo = () => setActiveVideo(null);

  const currentVideo = videos.find(v => v.id === activeVideo);

  return (
    <div className="video-page">
      <header className="video-hero">
        <div className="video-hero-paw left">🐾</div>
        <div className="video-hero-paw right">🐾</div>
        <h1 className="video-hero-title">Видео</h1>
        <p className="video-hero-subtitle">Наши лучшие моменты на видео</p>
        <a href="/" className="video-back">← На главную</a>
      </header>

      <nav className="video-tabs">
        {(['all', 'katya', 'gavrik'] as const).map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'all' ? 'Все' : tab === 'katya' ? 'Катя' : 'Гаврик'}
            <span className="tab-count">
              {tab === 'all' ? videos.length : videos.filter(v => v.videoUrl.toLowerCase().includes(tab)).length}
            </span>
          </button>
        ))}
      </nav>

      <div className="video-content">
        {videos.length === 0 ? (
          <div className="video-empty">
            <span className="empty-icon">🎬</span>
            <p>Видео пока нет</p>
            <p className="empty-hint">Добавьте MP4 файлы в папку assets/videos</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="video-empty">
            <span className="empty-icon">🔍</span>
            <p>Нет видео для выбранного фильтра</p>
          </div>
        ) : (
          <div className="video-grid">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="video-card"
                onClick={() => openVideo(video.id)}
              >
                <div className="video-thumbnail">
                  <img src={video.thumbnail} alt={video.title} loading="lazy" />
                  <div className="play-button">▶</div>
                </div>
                <div className="video-info">
                  <h3 className="video-title">{video.title}</h3>
                  <p className="video-description">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeVideo && currentVideo && (
        <div className="video-modal" onClick={closeVideo}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeVideo}>✕</button>
            <video
              src={currentVideo.videoUrl}
              controls
              autoPlay
              className="modal-video"
            />
            <div className="modal-video-info">
              <h3>{currentVideo.title}</h3>
              <p>{currentVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPage;
