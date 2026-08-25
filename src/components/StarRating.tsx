interface StarRatingProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export default function StarRating({ rating, count, size = 'sm', showNumber = true }: StarRatingProps) {
  const full = Math.round(rating);
  const stars = Array.from({ length: 5 }, (_, i) => (i < full ? '★' : '☆')).join('');
  return (
    <span className={`stars stars--${size}`}>
      <span className="stars__icons" aria-hidden="true">{stars}</span>
      {showNumber && <em className="stars__num">{rating.toFixed(1)}</em>}
      {count != null && <span className="stars__count">({count})</span>}
    </span>
  );
}
