import './VideoPage.css';

function VideoPage() {
  return (
    <div className="app">
      <main className="main-content">
        <div className="placeholder-container">
          <div className="placeholder-card">
            <div className="placeholder-image">
              <img 
                src="https://images.unsplash.com/photo-1513245543132-3e6e31548f28?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Котик играет с клубком" 
              />
            </div>
            <div className="placeholder-content">
              <div className="placeholder-icon">🚧</div>
              <h1>Раздел в разработке</h1>
              <p>
                Мы снимаем самые смешные и милые видео наших котиков.<br/>
                Совсем скоро этот раздел наполнится контентом!
              </p>
              <a href="/" className="placeholder-back">
                ← Вернуться на главную
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VideoPage;
