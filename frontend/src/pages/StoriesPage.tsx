import { useState } from 'react';
import StoryCard from '../components/StoryCard';
import { stories } from '../data/stories';

function StoriesPage() {
  const [selectedCat, setSelectedCat] = useState<string>('both');
  const cats = [
    { id: 'both', label: 'Оба' },
    { id: 'katya', label: 'Катя' },
    { id: 'gavrik', label: 'Гаврик' },
  ];

  const filteredStories = stories.filter((s) => s.catId === selectedCat);

  return (
    <div className="app">
      <main className="main-content">
        <section className="stories-page-section">
          <div className="stories-page-header">
            <h1 className="stories-page-title">Истории</h1>
            <a href="/" className="stories-page-back">← На главную</a>
          </div>

          <div className="stories-tabs">
            {cats.map((cat) => (
              <button
                key={cat.id}
                className={`stories-tab ${selectedCat === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCat(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {filteredStories.length === 0 ? (
            <div className="stories-empty">
              <p>Истории скоро появятся!</p>
            </div>
          ) : (
            <div className="stories-grid">
              {filteredStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default StoriesPage;