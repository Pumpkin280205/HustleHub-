import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/useAuth';
import { formatCurrency } from '../utils/format';

const formatDate = (iso) => new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/bookings/mine'), api.get('/transactions/mine')])
      .then(([b, t]) => {
        setBookings(b.data.bookings);
        setTransactions(t.data.transactions);
        setStatus('ready');
      })
      .catch((err) => { setError(getErrorMessage(err)); setStatus('error'); });
  }, []);

  if (status === 'loading') return <p className="muted">Loading bookings…</p>;
  if (status === 'error') return <p className="error" role="alert">{error}</p>;

  const isClient = user.role === 'client';

  return (
    <>
      <h1>My bookings</h1>

      {bookings.length === 0 ? (
        <div className="card">
          <p className="muted">You have no bookings yet.</p>
          {isClient && <Link to="/gigs">Browse gigs</Link>}
        </div>
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Gig</th>
                <th>{isClient ? 'Freelancer' : 'Client'}</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.gigTitle}</td>
                  <td>{isClient ? b.freelancer?.email : b.client?.email}</td>
                  <td>{formatCurrency(b.amount)}</td>
                  <td>{formatDate(b.createdAt)}</td>
                  <td><span className="badge">{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="section-title">Transactions</h2>
      {transactions.length === 0 ? (
        <p className="muted">No transactions recorded yet.</p>
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td><code>{t.reference}</code></td>
                  <td>{formatCurrency(t.amount)}</td>
                  <td>{t.paymentMethod}</td>
                  <td>{formatDate(t.createdAt)}</td>
                  <td><span className="badge">{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
