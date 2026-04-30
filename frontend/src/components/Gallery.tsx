import { useState, useEffect } from 'react';
import './Gallery.css';
import { galleryPhotos } from '../data/galleryPhotos';

const images = galleryPhotos.map((src, index) => ({
  id: String(index + 1),
  src,
  alt: 'Катя и Гаврик'
}));

function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openImage = (index: number) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);

  const prevImage = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  };

  const nextImage = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
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
  }, [selectedIndex]);

  return (
    <div className="gallery">
      <div className="gallery-grid">
        {images.map((img, index) => (
          <div key={img.id} className="gallery-item" onClick={() => openImage(index)}>
            <img src={img.src} alt={img.alt} />
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div className="gallery-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            <button className="modal-prev" onClick={prevImage}>‹</button>
            <img src={images[selectedIndex].src} alt={images[selectedIndex].alt} className="modal-image" />
            <button className="modal-next" onClick={nextImage}>›</button>
            <div className="modal-counter">{selectedIndex + 1} / {images.length}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
