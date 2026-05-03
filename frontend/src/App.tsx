import Navbar from './components/Navbar';
import CatCard from './components/CatCard';
import StoryCard from './components/StoryCard';
import { cats } from './data/cats';
import { stories } from './data/stories';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <section className="hero">
          <div className="hero-paw hero-paw-left">🐾</div>
          <div className="hero-paw hero-paw-right">🐾</div>
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="hero-title-line">Катя</span>
              <span className="hero-title-and">&</span>
              <span className="hero-title-line">Гаврик</span>
            </h1>
            <p className="hero-subtitle">Наши пушистые друзья</p>
          </div>
          <div className="hero-scroll">
            <span>Scroll</span>
            <div className="scroll-line"></div>
          </div>
        </section>

        <section className="intro-section">
          <div className="intro-grid">
            <div className="intro-text">
              <h2>О нас</h2>
              <p>
                Мы — пара котов, которые нашли друг друга в котокафе. 
                Теперь живём вместе и делим одну подушку на двоих.
              </p>
            </div>
            <div className="intro-stats">
              <div className="stat">
                <span className="stat-number">3</span>
                <span className="stat-label">года вместе</span>
              </div>
              <div className="stat">
                <span className="stat-number">∞</span>
                <span className="stat-label">объятий в день</span>
              </div>
            </div>
          </div>
        </section>

        <section className="cats-section">
          <div className="section-header">
            <h2 className="section-title">Наши котики</h2>
            <span className="section-number">01</span>
          </div>
          <div className="cats-grid">
            {cats.map((cat) => (
              <CatCard key={cat.id} cat={cat} />
            ))}
          </div>
        </section>

        <section className="stories-section" id="stories">
          <div className="section-header">
            <h2 className="section-title">История Кати</h2>
            <span className="section-number">02</span>
          </div>
          <div className="stories-list">
            {stories.filter((s) => s.catId === 'katya').map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </section>

        <section className="stories-section">
          <div className="section-header">
            <h2 className="section-title">История Гаврика</h2>
            <span className="section-number">03</span>
          </div>
          <div className="stories-list">
            {stories.filter((s) => s.catId === 'gavrik').map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </section>

        <section className="stories-section">
          <div className="section-header">
            <h2 className="section-title">Как мы прижились у нас дома</h2>
            <span className="section-number">04</span>
          </div>
          <div className="stories-list">
            {stories.filter((s) => s.catId === 'both').map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      </main>
      <footer className="footer">
        <p>Сделано с любовью</p>
      </footer>
    </div>
  );
}

export default App;
