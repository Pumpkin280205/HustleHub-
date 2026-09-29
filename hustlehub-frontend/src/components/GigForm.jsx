import { useState } from 'react';
import api, { getErrorMessage, getFieldErrors } from '../api/client';
import FormField from './FormField';
import { GIG_CATEGORIES, validateGig } from '../utils/validation';

const EMPTY = { title: '', description: '', category: '', price: '' };

export default function GigForm({ gig, onSaved, onCancel }) {
  const isEdit = Boolean(gig);
  const [form, setForm] = useState(
    isEdit
      ? { title: gig.title, description: gig.description, category: gig.category, price: String(gig.price) }
      : EMPTY
  );
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const found = validateGig(form);
    if (Object.keys(found).length) return setErrors(found);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      price: Number(form.price)
    };

    setSaving(true);
    try {
      const { data } = isEdit
        ? await api.put(`/gigs/${gig._id}`, payload)
        : await api.post('/gigs', payload);
      onSaved(data.gig);
    } catch (err) {
      setErrors(getFieldErrors(err));
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card gig-form" noValidate>
      <h2>{isEdit ? 'Edit gig' : 'New gig'}</h2>
      {formError && <p className="error" role="alert">{formError}</p>}

      <FormField id="title" label="Title" maxLength={100}
        value={form.title} onChange={handleChange} error={errors.title} />

      <FormField id="description" label="Description" as="textarea" rows={5} maxLength={2000}
        value={form.description} onChange={handleChange} error={errors.description}
        hint={`${form.description.length}/2000 characters`} />

      <div className="form-row">
        <FormField id="category" label="Category" as="select"
          value={form.category} onChange={handleChange} error={errors.category}>
          <option value="">Choose a category</option>
          {GIG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </FormField>

        <FormField id="price" label="Price (R)" type="number" min="1" max="1000000" step="0.01" inputMode="decimal"
          value={form.price} onChange={handleChange} error={errors.price} />
      </div>

      <div className="actions">
        <button type="submit" disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create gig'}</button>
        <button type="button" className="secondary" onClick={onCancel} disabled={saving}>Cancel</button>
      </div>
    </form>
  );
}
