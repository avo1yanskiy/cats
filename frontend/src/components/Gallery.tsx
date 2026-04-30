import { useState, useEffect } from 'react';
import './Gallery.css';

const galleryImages = [
  { id: '1', src: '/images/IMG_2754.jpeg', alt: 'Катя и Гаврик' },
  { id: '2', src: '/images/IMG_2776.jpeg', alt: 'Катя и Гаврик' },
  { id: '3', src: '/images/IMG_2777.jpeg', alt: 'Катя и Гаврик' },
  { id: '4', src: '/images/IMG_2783.jpeg', alt: 'Катя и Гаврик' },
];

function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openImage = (index: number) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);

  const prevImage = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? galleryImages.length - 1 : selectedIndex - 1);
  };

  const nextImage = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === galleryImages.length - 1 ? 0 : selectedIndex + 1);
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
        {galleryImages.map((img, index) => (
          <div key={img.id} className="gallery-item">
            <img
              src={img.src}
              alt={img.alt}
              onClick={() => openImage(index)}
            />
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div className="gallery-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>

            <button className="modal-prev" onClick={prevImage}>
              ‹
            </button>

            <img
              src={galleryImages[selectedIndex].src}
              alt={galleryImages[selectedIndex].alt}
              className="modal-image"
            />

            <button className="modal-next" onClick={nextImage}>
              ›
            </button>

            <div className="modal-counter">
              {selectedIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;