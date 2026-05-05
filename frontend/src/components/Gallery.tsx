import { useState, useEffect } from 'react';
import './Gallery.css';
import { galleryPhotos, GalleryPhoto } from '../data/galleryPhotos';

function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  const years = [2025, 2026, 2027];

  const filteredPhotos = galleryPhotos.filter((photo: GalleryPhoto) => photo.year === selectedYear);

  const openImage = (index: number) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);

  const prevImage = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? filteredPhotos.length - 1 : selectedIndex - 1);
  };

  const nextImage = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === filteredPhotos.length - 1 ? 0 : selectedIndex + 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredPhotos.length]);

  if (filteredPhotos.length === 0) {
    return (
      <div className="gallery">
        <div className="gallery-empty">
          <p>Фото за {selectedYear} год появятся скоро!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery">
      <div className="gallery-years">
        {years.map((year) => (
          <button
            key={year}
            className={`gallery-year-tab ${selectedYear === year ? 'active' : ''}`}
            onClick={() => {
              setSelectedYear(year);
              setSelectedIndex(null);
            }}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {filteredPhotos.map((photo: GalleryPhoto, index: number) => (
          <div key={photo.id} className="gallery-item" onClick={() => openImage(index)}>
            <img src={photo.src} alt={photo.alt} />
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div className="gallery-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            <button className="modal-prev" onClick={prevImage}>‹</button>
            <img src={filteredPhotos[selectedIndex].src} alt={filteredPhotos[selectedIndex].alt} className="modal-image" />
            <button className="modal-next" onClick={nextImage}>›</button>
            <div className="modal-counter">{selectedIndex + 1} / {filteredPhotos.length}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;