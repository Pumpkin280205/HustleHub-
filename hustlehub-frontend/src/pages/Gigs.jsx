import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client';

export default function Gigs() {
  const [gigs, setGigs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/gigs')
      .then(({ data }) => setGigs(data.gigs))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  if (error) return <p className="error">{error}</p>;
  return (
    <>
      <h1>Browse gigs</h1>
      <ul>{gigs.map((g) => <li key={g._id}>{g.title}: R{g.price}</li>)}</ul>
    </>
  );
}
