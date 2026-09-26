import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

export default function GigCard({ gig }) {
  return (
    <Link to={`/gigs/${gig._id}`} className="card gig-card">
      <span className="badge">{gig.category}</span>
      <h2>{gig.title}</h2>
      <p className="muted clamp">{gig.description}</p>
      <strong className="price">{formatCurrency(gig.price)}</strong>
    </Link>
  );
}
