import type { Cat } from '../data/cats';
import './CatCard.css';

interface CatCardProps {
  cat: Cat;
}

function CatCard({ cat }: CatCardProps) {
  return (
    <div className="cat-card">
      <div className="cat-image-wrapper">
        <img src={cat.image} alt={cat.name} className="cat-image" />
      </div>
      <div className="cat-info">
        <h3 className="cat-name">{cat.name}</h3>
        <p className="cat-age">{cat.age}</p>
        <p className="cat-breed">{cat.breed}</p>
        <p className="cat-color">{cat.color}</p>
        <p className="cat-description">{cat.description}</p>
      </div>
    </div>
  );
}

export default CatCard;