import { useState } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import api, { getErrorMessage, getFieldErrors } from '../api/client';
import { useAuth } from '../context/useAuth';
import FormField from '../components/FormField';
import { validateLogin } from '../utils/validation';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (user) return <Navigate to="/gigs" replace />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined }); // clear a field's error as the user fixes it
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const found = validateLogin(form);
    if (Object.keys(found).length) return setErrors(found);

    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email: form.email.trim().toLowerCase(), password: form.password });
      login(data);
      navigate(location.state?.from?.pathname || '/gigs', { replace: true });
    } catch (err) {
      // Generic message: never reveal whether the email or the password was wrong
      setErrors(getFieldErrors(err));
      setFormError(getErrorMessage(err));
      setForm((f) => ({ ...f, password: '' })); // don't leave a failed password in the field
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card form" noValidate>
      <h1>Log in</h1>
      {location.state?.registered && !formError && <p className="success" role="status">Account created. Please log in.</p>}
      {formError && <p className="error" role="alert">{formError}</p>}

      <FormField id="email" label="Email" type="email" autoComplete="email"
        value={form.email} onChange={handleChange} error={errors.email} />

      <FormField id="password" label="Password" type="password" autoComplete="current-password"
        value={form.password} onChange={handleChange} error={errors.password} />

      <button type="submit" disabled={loading}>{loading ? 'Logging in…' : 'Log in'}</button>
      <p>No account? <Link to="/register">Register</Link></p>
    </form>
  );
}
