import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client';
import GigCard from '../components/GigCard';

export default function Gigs() {
  const [gigs, setGigs] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    api.get('/gigs')
      .then(({ data }) => { setGigs(data.gigs); setStatus('ready'); })
      .catch((err) => { setError(getErrorMessage(err)); setStatus('error'); });
  }, []);

  const categories = [...new Set(gigs.map((g) => g.category))].sort();
  const term = search.trim().toLowerCase();
  const visible = gigs.filter((g) =>
    (category === 'all' || g.category === category) &&
    (!term || g.title.toLowerCase().includes(term) || g.description.toLowerCase().includes(term))
  );

  if (status === 'loading') return <p className="muted">Loading gigs…</p>;
  if (status === 'error') return <p className="error" role="alert">{error}</p>;

  return (
    <>
      <h1>Browse gigs</h1>
      <div className="toolbar">
        <input type="search" placeholder="Search gigs…" aria-label="Search gigs" maxLength={100}
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {gigs.length === 0 && <p className="muted">No gigs have been listed yet.</p>}
      {gigs.length > 0 && visible.length === 0 && <p className="muted">No gigs match your search.</p>}

      <div className="grid">
        {visible.map((gig) => <GigCard key={gig._id} gig={gig} />)}
      </div>
    </>
  );
}
