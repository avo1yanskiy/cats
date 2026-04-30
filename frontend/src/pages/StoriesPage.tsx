import StoryCard from '../components/StoryCard';
import { stories } from '../data/stories';

function StoriesPage() {
  return (
    <div className="app">
      <main className="main-content">
        <section className="gallery-page-section">
          <div className="gallery-page-header">
            <h1 className="gallery-page-title">Истории</h1>
            <a href="/" className="gallery-page-back">← На главную</a>
          </div>

          <div className="story-both-section">
            <h3>Как мы нашли друг друга</h3>
            <div className="stories-list">
              {stories.filter((s) => s.catId === 'both').map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>

          <div className="story-cat-section">
            <h3>Приключения Кати</h3>
            <div className="stories-list">
              {stories.filter((s) => s.catId === 'katya').map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>

          <div className="story-cat-section">
            <h3>Приключения Гаврика</h3>
            <div className="stories-list">
              {stories.filter((s) => s.catId === 'gavrik').map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default StoriesPage;
