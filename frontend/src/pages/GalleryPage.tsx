import Gallery from '../components/Gallery';

function GalleryPage() {
  return (
    <div className="app">
      <main className="main-content">
        <section className="gallery-page-section">
          <div className="gallery-page-header">
            <h1 className="gallery-page-title">Галерея</h1>
            <a href="/" className="gallery-page-back">← На главную</a>
          </div>
          <Gallery />
        </section>
      </main>
    </div>
  );
}

export default GalleryPage;
