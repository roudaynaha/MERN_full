import { useState } from 'react';

const initialForm = { title: '', description: '', date: '', location: '' };
const toInputDate = (value) => value ? new Date(value).toISOString().slice(0, 16) : '';

export default function EventForm({ event, onSave, onCancel }) {
  const [form, setForm] = useState(() => event ? { ...event, date: toInputDate(event.date) } : initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSave({ ...form, date: new Date(form.date).toISOString() });
      setForm(initialForm);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create the event.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="card form-card" onSubmit={submit}>
      <h2>{event ? 'Modifier l’événement' : 'Créer un événement'}</h2>
      {error && <p className="form-error" role="alert">{error}</p>}
      <label>Titre<input name="title" value={form.title} onChange={updateField} minLength="3" required /></label>
      <label>Description<textarea name="description" value={form.description} onChange={updateField} minLength="10" rows="4" required /></label>
      <div className="form-grid">
        <label>Date et heure<input name="date" type="datetime-local" value={form.date} onChange={updateField} required /></label>
        <label>Lieu<input name="location" value={form.location} onChange={updateField} required /></label>
      </div>
      <div className="form-actions"><button className="button" disabled={submitting}>{submitting ? 'Enregistrement…' : event ? 'Enregistrer' : 'Publier l’événement'}</button>{event && <button type="button" className="button button-secondary" onClick={onCancel}>Annuler</button>}</div>
    </form>
  );
}
