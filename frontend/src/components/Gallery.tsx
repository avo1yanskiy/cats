import { useState } from 'react';
import './Gallery.css';
import { galleryByYear } from '../data/galleryPhotos';

const allYears = Object.keys(galleryByYear).sort((a, b) => b.localeCompare(a));

function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const openImage = (index: number, year: string) => {
    setSelectedYear(year);
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedIndex(null);
    setSelectedYear(null);
  };

  const prevImage = () => {
    if (selectedIndex === null || !selectedYear) return;
    const photos = galleryByYear[selectedYear];
    setSelectedIndex(selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1);
  };

  const nextImage = () => {
    if (selectedIndex === null || !selectedYear) return;
    const photos = galleryByYear[selectedYear];
    setSelectedIndex(selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1);
  };

  const getImageSrc = (index: number) => {
    if (!selectedYear) return '';
    return galleryByYear[selectedYear][index];
  };

  return (
    <div className="gallery">
      {allYears.map(year => (
        <div key={year} className="gallery-year-section">
          <h3 className="gallery-year-title">{year} год</h3>
          <div className="gallery-grid">
            {galleryByYear[year].map((src, index) => (
              <div key={src} className="gallery-item" onClick={() => openImage(index, year)}>
                <img src={src} alt={`Фото ${year}`} loading="lazy" />
              </div>
            ))}
            {galleryByYear[year].length === 0 && (
              <p className="gallery-empty">В этом году фотографий пока нет.</p>
            )}
          </div>
        </div>
      ))}

      {selectedIndex !== null && selectedYear && (
        <div className="gallery-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            <button className="modal-prev" onClick={prevImage}>‹</button>
            <img src={getImageSrc(selectedIndex)} alt="Фото" className="modal-image" />
            <button className="modal-next" onClick={nextImage}>›</button>
            <div className="modal-counter">
              {selectedIndex + 1} / {galleryByYear[selectedYear].length} ({selectedYear})
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
