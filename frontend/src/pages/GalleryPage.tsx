import { useState } from 'react';
import { galleryByYear } from '../data/galleryPhotos';
import '../pages/GalleryPage.css';

const years = Object.keys(galleryByYear).sort((a, b) => b.localeCompare(a));

function GalleryPage() {
  const [activeYear, setActiveYear] = useState(years[0]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const photos = galleryByYear[activeYear] || [];

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % photos.length);
  };
  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
  };

  return (
    <div className="gallery-page">
      <header className="gallery-hero">
        <div className="gallery-hero-paw left">🐾</div>
        <div className="gallery-hero-paw right">🐾</div>
        <h1 className="gallery-hero-title">Галерея</h1>
        <p className="gallery-hero-subtitle">Наши лучшие моменты</p>
        <a href="/" className="gallery-back">← На главную</a>
      </header>

      <nav className="gallery-tabs">
        {years.map((year) => (
          <button
            key={year}
            className={`tab-button ${activeYear === year ? 'active' : ''}`}
            onClick={() => setActiveYear(year)}
          >
            {year}
            <span className="tab-count">{galleryByYear[year].length}</span>
          </button>
        ))}
      </nav>

      <div className="gallery-content">
        {photos.length === 0 ? (
          <div className="gallery-empty">
            <span className="empty-icon">📷</span>
            <p>В {activeYear} году фотографий пока нет</p>
            <p className="empty-hint">Добавьте фото в папку assets/images</p>
          </div>
        ) : (
          <div className="masonry-grid">
            {photos.map((src, index) => (
              <div
                key={src}
                className="masonry-item"
                onClick={() => openLightbox(index)}
              >
                <img src={src} alt={`Фото ${activeYear}`} loading="lazy" />
              </div>
            ))}
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>✕</button>
            <button className="lightbox-prev" onClick={prevImage}>‹</button>
            <img
              src={photos[lightboxIndex]}
              alt="Фото"
              className="lightbox-image"
            />
            <button className="lightbox-next" onClick={nextImage}>›</button>
            <div className="lightbox-counter">
              {lightboxIndex + 1} / {photos.length} ({activeYear})
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryPage;
