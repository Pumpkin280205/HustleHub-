import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/useAuth';
import BookingPanel from '../components/BookingPanel';
import { formatCurrency } from '../utils/format';

export default function GigDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [gig, setGig] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/gigs/${id}`)
      .then(({ data }) => { setGig(data.gig); setStatus('ready'); })
      .catch((err) => {
        const code = err.response?.status;
        setError(code === 400 || code === 404 ? 'This gig does not exist or has been removed.' : getErrorMessage(err));
        setStatus('error');
      });
  }, [id]);

  if (status === 'loading') return <p className="muted">Loading gig…</p>;
  if (status === 'error') {
    return (
      <div className="card">
        <p className="error" role="alert">{error}</p>
        <Link to="/gigs">Back to gigs</Link>
      </div>
    );
  }

  return (
    <article className="card gig-detail">
      <Link to="/gigs">← Back to gigs</Link>
      <span className="badge">{gig.category}</span>
      <h1>{gig.title}</h1>
      <p className="description">{gig.description}</p>
      <p className="price">{formatCurrency(gig.price)}</p>

      {user.role === 'client'
        ? <BookingPanel gig={gig} />
        : <p className="muted">Only client accounts can book gigs.</p>}
    </article>
  );
}
