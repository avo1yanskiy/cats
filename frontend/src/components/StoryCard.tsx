import type { Story } from '../data/stories';
import { cats } from '../data/cats';
import './StoryCard.css';

interface StoryCardProps {
  story: Story;
}

function StoryCard({ story }: StoryCardProps) {
  const cat = cats.find((c) => c.id === story.catId);

  return (
    <div className="story-card">
      {story.image && (
        <img src={story.image} alt={story.title} className="story-image" />
      )}
      <div className="story-content">
        <div className="story-header">
          <h3 className="story-title">{story.title}</h3>
          {cat && <span className="story-cat">{cat.name}</span>}
        </div>
        <time className="story-date">{story.date}</time>
        <p className="story-text">{story.content}</p>
      </div>
    </div>
  );
}

export default StoryCard;