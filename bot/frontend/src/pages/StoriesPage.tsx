import { useState } from 'react';
import StoryCard from '../components/StoryCard';
import { stories } from '../data/stories';
import '../pages/StoriesPage.css';

type TabType = 'katya' | 'gavrik' | 'both';

const tabLabels: Record<TabType, string> = {
  katya: 'Катя',
  gavrik: 'Гаврик',
  both: 'Истории'
};

function StoriesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('both');

  const filteredStories = stories.filter((s) => s.catId === activeTab);

  return (
    <div className="stories-page">
      <header className="stories-hero">
        <div className="stories-hero-paw left">🐾</div>
        <div className="stories-hero-paw right">🐾</div>
        <h1 className="stories-hero-title">Истории</h1>
        <p className="stories-hero-subtitle">Хроники нашей жизни</p>
        <a href="/" className="stories-back">← На главную</a>
      </header>

      <nav className="stories-tabs">
        {(Object.keys(tabLabels) as TabType[]).map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tabLabels[tab]}
            <span className="tab-count">{stories.filter((s) => s.catId === tab).length}</span>
          </button>
        ))}
      </nav>

      <div className="timeline">
        {filteredStories.length === 0 ? (
          <div className="timeline-empty">
            <span className="empty-icon">📝</span>
            <p>Пока нет историй</p>
          </div>
        ) : (
          filteredStories.map((story, index) => (
            <div key={story.id} className="timeline-item">
              <div className="timeline-marker">
                <div className="timeline-dot" />
                {index < filteredStories.length - 1 && <div className="timeline-line" />}
              </div>
              <div className="timeline-content">
                <StoryCard story={story} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StoriesPage;