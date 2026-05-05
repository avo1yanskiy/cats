import { useState } from 'react';
import './VideoPage.css';
import { videos } from '../data/videos';

function VideoPage() {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const years = [2025, 2026, 2027];

  const filteredVideos = videos.filter((v) => v.year === selectedYear);

  return (
    <div className="app">
      <main className="main-content">
        <section className="video-page-section">
          <div className="video-page-header">
            <h1 className="video-page-title">Видео</h1>
            <a href="/" className="video-page-back">← На главную</a>
          </div>

          <div className="video-years">
            {years.map((year) => (
              <button
                key={year}
                className={`video-year-tab ${selectedYear === year ? 'active' : ''}`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </button>
            ))}
          </div>

          {filteredVideos.length === 0 ? (
            <div className="video-empty">
              <p>Видео за {selectedYear} год появятся скоро!</p>
            </div>
          ) : (
            <div className="video-grid">
              {filteredVideos.map((video) => (
                <div key={video.id} className="video-card">
                  <video controls preload="metadata">
                    <source src={video.videoUrl} type="video/mp4" />
                  </video>
                  <div className="video-info">
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default VideoPage;