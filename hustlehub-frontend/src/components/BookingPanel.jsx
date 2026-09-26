import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import { formatCurrency } from '../utils/format';

export default function BookingPanel({ gig }) {
  const [step, setStep] = useState('idle'); // idle | confirm | submitting | done
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const confirmBooking = async () => {
    setStep('submitting');
    setError('');
    try {
      // Only the gig id is sent; the server takes the price from the database
      const { data } = await api.post('/bookings', { gigId: gig._id });
      setResult(data);
      setStep('done');
    } catch (err) {
      setError(getErrorMessage(err));
      setStep('confirm');
    }
  };

  if (step === 'done') {
    return (
      <div className="card success-panel" role="status">
        <h2>Booking confirmed</h2>
        <p>Your simulated payment of {formatCurrency(result.transaction.amount)} was successful.</p>
        <p>Transaction reference: <code>{result.transaction.reference}</code></p>
        <Link to="/bookings">View my bookings</Link>
      </div>
    );
  }

  if (step === 'idle') {
    return <button onClick={() => setStep('confirm')}>Book this gig</button>;
  }

  return (
    <div className="card confirm-panel">
      <h2>Confirm booking</h2>
      <p>You are about to book <strong>{gig.title}</strong> for <strong>{formatCurrency(gig.price)}</strong>.</p>
      <p className="muted">This is a simulated payment. No real money will be charged.</p>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="actions">
        <button onClick={confirmBooking} disabled={step === 'submitting'}>
          {step === 'submitting' ? 'Processing…' : 'Confirm and pay'}
        </button>
        <button className="secondary" onClick={() => setStep('idle')} disabled={step === 'submitting'}>Cancel</button>
      </div>
    </div>
  );
}
