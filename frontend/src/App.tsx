import Navbar from './components/Navbar';
import CatCard from './components/CatCard';
import { cats } from './data/cats';

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
            <p className="hero-subtitle">Пушистые друзья</p>
          </div>
          <div className="hero-scroll">
            <span>Scroll</span>
            <div className="scroll-line"></div>
          </div>
        </section>

        <section className="cats-section">
          <div className="section-header">
            <h2 className="section-title">Котики</h2>
          </div>
          <div className="cats-grid">
            {cats.map((cat) => (
              <CatCard key={cat.id} cat={cat} />
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
