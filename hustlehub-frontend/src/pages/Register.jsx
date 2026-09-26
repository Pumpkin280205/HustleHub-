import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api, { getErrorMessage, getFieldErrors } from '../api/client';
import { useAuth } from '../context/useAuth';
import FormField from '../components/FormField';
import { validateRegister } from '../utils/validation';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', role: 'client' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/gigs" replace />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined }); // clear a field's error as the user fixes it
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const found = validateRegister(form);
    if (Object.keys(found).length) return setErrors(found);

    setLoading(true);
    try {
      const { email, password, role } = form; // confirmPassword never leaves the browser
      await api.post('/auth/register', { email: email.trim().toLowerCase(), password, role });
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (err) {
      setErrors(getFieldErrors(err));
      setFormError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card form" noValidate>
      <h1>Create an account</h1>
      {formError && <p className="error" role="alert">{formError}</p>}

      <FormField id="email" label="Email" type="email" autoComplete="email"
        value={form.email} onChange={handleChange} error={errors.email} />

      <FormField id="password" label="Password" type="password" autoComplete="new-password" maxLength={72}
        value={form.password} onChange={handleChange} error={errors.password}
        hint="At least 8 characters with uppercase, lowercase, a number and a special character" />

      <FormField id="confirmPassword" label="Confirm password" type="password" autoComplete="new-password"
        value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />

      <fieldset className="radio-group">
        <legend>I want to</legend>
        <label>
          <input type="radio" name="role" value="client" checked={form.role === 'client'} onChange={handleChange} />
          Hire freelancers (Client)
        </label>
        <label>
          <input type="radio" name="role" value="freelancer" checked={form.role === 'freelancer'} onChange={handleChange} />
          Offer my services (Freelancer)
        </label>
        {errors.role && <small className="field-error">{errors.role}</small>}
      </fieldset>

      <button type="submit" disabled={loading}>{loading ? 'Creating account…' : 'Register'}</button>
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </form>
  );
}
