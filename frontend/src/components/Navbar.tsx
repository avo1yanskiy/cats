import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">🐾</Link>
        <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
          <span className={isOpen ? 'open' : ''}></span>
          <span className={isOpen ? 'open' : ''}></span>
          <span className={isOpen ? 'open' : ''}></span>
        </button>
        <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
          <Link to="/videos" onClick={() => setIsOpen(false)}>Видео</Link>
          <Link to="/gallery" onClick={() => setIsOpen(false)}>Галерея</Link>
          <Link to="/stories" onClick={() => setIsOpen(false)}>Истории</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
