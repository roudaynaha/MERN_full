import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate('/events');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to log in.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-page"><form className="card auth-card" onSubmit={submit}>
      <p className="eyebrow">Welcome back</p><h1>Log in</h1>
      {error && <p className="form-error" role="alert">{error}</p>}
      <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength="8" required /></label>
      <button className="button" disabled={submitting}>{submitting ? 'Logging in…' : 'Log in'}</button>
      <p>New here? <Link to="/register">Create an account</Link>.</p>
    </form></section>
  );
}
