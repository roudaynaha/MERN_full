import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      await register(form);
      navigate('/events');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create your account.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-page"><form className="card auth-card" onSubmit={submit}>
      <p className="eyebrow">Join the community</p><h1>Create an account</h1>
      {error && <p className="form-error" role="alert">{error}</p>}
      <label>Name<input name="name" value={form.name} onChange={updateField} minLength="2" required /></label>
      <label>Email<input name="email" type="email" value={form.email} onChange={updateField} required /></label>
      <label>Password<input name="password" type="password" value={form.password} onChange={updateField} minLength="8" required /></label>
      <button className="button" disabled={submitting}>{submitting ? 'Creating account…' : 'Create account'}</button>
      <p>Already a member? <Link to="/login">Log in</Link>.</p>
    </form></section>
  );
}
