import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import GigForm from '../components/GigForm';
import { formatCurrency, formatDate, formatMonth } from '../utils/format';

export default function FreelancerDashboard() {
  const [income, setIncome] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | gig being edited
  const [notice, setNotice] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/income'), api.get('/gigs/mine'), api.get('/bookings/mine')])
      .then(([i, g, b]) => {
        setIncome(i.data.income);
        setGigs(g.data.gigs);
        setBookings(b.data.bookings);
        setStatus('ready');
      })
      .catch((err) => { setError(getErrorMessage(err)); setStatus('error'); });
  }, []);

  const startEditing = (value) => {
    setNotice('');
    setActionError('');
    setEditing(value);
  };

  const handleSaved = (saved) => {
    setGigs((current) =>
      editing === 'new' ? [saved, ...current] : current.map((g) => (g._id === saved._id ? saved : g))
    );
    setNotice(editing === 'new' ? 'Gig created.' : 'Gig updated.');
    setEditing(null);
  };

  const handleDelete = async (gig) => {
    if (!window.confirm(`Delete "${gig.title}"? Existing bookings and income are kept.`)) return;
    setNotice('');
    setActionError('');
    try {
      await api.delete(`/gigs/${gig._id}`);
      setGigs((current) => current.filter((g) => g._id !== gig._id));
      setNotice('Gig deleted.');
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  if (status === 'loading') return <p className="muted">Loading dashboard…</p>;
  if (status === 'error') return <p className="error" role="alert">{error}</p>;

  return (
    <>
      <h1>Dashboard</h1>

      {/* Income */}
      <section aria-labelledby="income-heading">
        <h2 id="income-heading" className="section-title">Income</h2>
        <div className="stats">
          <div className="card stat">
            <span className="stat-label">Total income</span>
            <strong className="stat-value">{formatCurrency(income.totalIncome)}</strong>
          </div>
          <div className="card stat">
            <span className="stat-label">This month</span>
            <strong className="stat-value">{formatCurrency(income.thisMonth)}</strong>
          </div>
          <div className="card stat">
            <span className="stat-label">Paid bookings</span>
            <strong className="stat-value">{income.bookingCount}</strong>
          </div>
          <div className="card stat">
            <span className="stat-label">Average per booking</span>
            <strong className="stat-value">{formatCurrency(income.averagePerBooking)}</strong>
          </div>
        </div>

        {income.monthly.length > 0 && (
          <div className="card table-wrap">
            <table>
              <thead>
                <tr><th>Month</th><th>Bookings</th><th>Income</th></tr>
              </thead>
              <tbody>
                {income.monthly.map((m) => (
                  <tr key={`${m.year}-${m.month}`}>
                    <td>{formatMonth(m.year, m.month)}</td>
                    <td>{m.count}</td>
                    <td>{formatCurrency(m.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Gigs */}
      <section aria-labelledby="gigs-heading">
        <div className="section-header">
          <h2 id="gigs-heading" className="section-title">My gigs</h2>
          {!editing && <button onClick={() => startEditing('new')}>+ New gig</button>}
        </div>

        {notice && <p className="success" role="status">{notice}</p>}
        {actionError && <p className="error" role="alert">{actionError}</p>}

        {editing && (
          <GigForm
            key={editing === 'new' ? 'new' : editing._id}
            gig={editing === 'new' ? null : editing}
            onSaved={handleSaved}
            onCancel={() => setEditing(null)}
          />
        )}

        {gigs.length === 0 ? (
          <div className="card"><p className="muted">You haven't listed any gigs yet.</p></div>
        ) : (
          <div className="card table-wrap">
            <table>
              <thead>
                <tr><th>Title</th><th>Category</th><th>Price</th><th>Listed</th><th><span className="sr-only">Actions</span></th></tr>
              </thead>
              <tbody>
                {gigs.map((g) => (
                  <tr key={g._id}>
                    <td><Link to={`/gigs/${g._id}`}>{g.title}</Link></td>
                    <td><span className="badge">{g.category}</span></td>
                    <td>{formatCurrency(g.price)}</td>
                    <td>{formatDate(g.createdAt)}</td>
                    <td className="row-actions">
                      <button className="secondary small" onClick={() => startEditing(g)}>Edit</button>
                      <button className="danger small" onClick={() => handleDelete(g)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent bookings */}
      <section aria-labelledby="bookings-heading">
        <div className="section-header">
          <h2 id="bookings-heading" className="section-title">Recent bookings</h2>
          {bookings.length > 0 && <Link to="/bookings">View all</Link>}
        </div>

        {bookings.length === 0 ? (
          <div className="card"><p className="muted">No one has booked your gigs yet.</p></div>
        ) : (
          <div className="card table-wrap">
            <table>
              <thead>
                <tr><th>Gig</th><th>Client</th><th>Amount</th><th>Date</th></tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b._id}>
                    <td>{b.gigTitle}</td>
                    <td>{b.client?.email}</td>
                    <td>{formatCurrency(b.amount)}</td>
                    <td>{formatDate(b.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
