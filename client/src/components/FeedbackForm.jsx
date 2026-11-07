import { useState } from 'react';

export default function FeedbackForm({ eventId, onCreate }) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState('5');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onCreate({ event: eventId, text, rating: Number(rating) });
      setText('');
      setRating('5');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to add feedback.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="feedback-form" onSubmit={submit}>
      <h3>Partager votre feedback</h3>
      {error && <p className="form-error" role="alert">{error}</p>}
      <label>Votre avis<textarea value={text} onChange={(event) => setText(event.target.value)} minLength="2" rows="3" required /></label>
      <label>Note<select value={rating} onChange={(event) => setRating(event.target.value)}>{[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} / 5</option>)}</select></label>
      <button className="button" disabled={submitting}>{submitting ? 'Publication…' : 'Publier mon feedback'}</button>
    </form>
  );
}
