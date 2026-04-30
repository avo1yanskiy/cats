import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <a href="/" className="navbar-logo">🐾</a>
        <div className="navbar-links">
          <a href="/">Котики</a>
          <a href="#gallery">Галерея</a>
          <a href="#stories">Истории</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;