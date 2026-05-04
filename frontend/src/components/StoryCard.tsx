import { useState } from 'react';
import { cats } from '../data/cats';
import './StoryCard.css';

interface Story {
  id: string;
  catId: 'katya' | 'gavrik' | 'both';
  title: string;
  text: string;
  date: string;
  images?: string[];
}

interface StoryCardProps {
  story: Story;
}

const MAX_TEXT_LENGTH = 300;

function StoryCard({ story }: StoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const cat = cats.find((c) => c.id === story.catId);
  const needCollapse = story.text.length > MAX_TEXT_LENGTH;
  const displayText = needCollapse && !expanded
    ? story.text.slice(0, MAX_TEXT_LENGTH) + '...'
    : story.text;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => {
    if (lightboxIndex === null || !story.images) return;
    setLightboxIndex((lightboxIndex + 1) % story.images.length);
  };
  const prevImage = () => {
    if (lightboxIndex === null || !story.images) return;
    setLightboxIndex((lightboxIndex - 1 + story.images.length) % story.images.length);
  };

  return (
    <>
      <div className="story-card">
        <div className="story-meta">
          {cat && (
            <span className="story-cat-badge" style={{ background: cat.color }}>
              {cat.name}
            </span>
          )}
          <time className="story-date">{new Date(story.date).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</time>
        </div>

        <h3 className="story-title">{story.title}</h3>

        <p className="story-text">
          {displayText}
        </p>

        {needCollapse && (
          <button
            className="story-expand-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Свернуть' : 'Читать далее →'}
          </button>
        )}

        {story.images && story.images.length > 0 && (
          <div className="story-images">
            {story.images.map((src, index) => (
              <img
                key={src}
                src={src}
                alt={`Фото ${index + 1}`}
                className="story-image-thumb"
                loading="lazy"
                onClick={() => openLightbox(index)}
              />
            ))}
          </div>
        )}
      </div>

      {lightboxIndex !== null && story.images && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>✕</button>
            <button className="lightbox-prev" onClick={prevImage}>‹</button>
            <img
              src={story.images[lightboxIndex]}
              alt="Фото"
              className="lightbox-image"
            />
            <button className="lightbox-next" onClick={nextImage}>›</button>
            <div className="lightbox-counter">
              {lightboxIndex + 1} / {story.images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StoryCard;
