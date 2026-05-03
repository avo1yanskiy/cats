import StoryCard from '../components/StoryCard';
import { stories } from '../data/stories';
import '../pages/StoriesPage.css';

function StoriesPage() {
  return (
    <div className="app">
      <main className="main-content">
        <section className="stories-section">
          <div className="stories-page-header">
            <h1 className="stories-page-title">Истории</h1>
            <a href="/" className="stories-page-back">← На главную</a>
          </div>

          <div className="story-year-section">
            <h2 className="story-year-title">История Кати</h2>
            <div className="stories-list">
              {stories.filter((s) => s.catId === 'katya').map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
              {stories.filter((s) => s.catId === 'katya').length === 0 && (
                <p className="stories-empty">Историй пока нет.</p>
              )}
            </div>
          </div>

          <div className="story-year-section">
            <h2 className="story-year-title">История Гаврика</h2>
            <div className="stories-list">
              {stories.filter((s) => s.catId === 'gavrik').map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
              {stories.filter((s) => s.catId === 'gavrik').length === 0 && (
                <p className="stories-empty">Историй пока нет.</p>
              )}
            </div>
          </div>

          <div className="story-year-section">
            <h2 className="story-year-title">Как мы прижились у нас дома</h2>
            <div className="stories-list">
              {stories.filter((s) => s.catId === 'both').map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
              {stories.filter((s) => s.catId === 'both').length === 0 && (
                <p className="stories-empty">Историй пока нет.</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default StoriesPage;
