import VideoSection from '../components/VideoSection';
import { videos } from '../data/videos';

function VideoPage() {
  return (
    <div className="app">
      <main className="main-content">
        <section className="gallery-page-section">
          <div className="gallery-page-header">
            <h1 className="gallery-page-title">Видео</h1>
            <a href="/" className="gallery-page-back">← На главную</a>
          </div>
          <VideoSection videos={videos} />
        </section>
      </main>
    </div>
  );
}

export default VideoPage;
