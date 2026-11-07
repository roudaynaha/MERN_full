import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosInstance.js';
import FeedbackCard from '../components/FeedbackCard.jsx';
import FeedbackForm from '../components/FeedbackForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function EventDetailPage() {
  const { eventId } = useParams();
  const { member, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState('');

  async function loadEvent() {
    try {
      const { data } = await api.get(`/events/${eventId}`);
      setEvent(data.event);
      setFeedbacks(data.feedbacks);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load this event.');
    }
  }

  useEffect(() => { loadEvent(); }, [eventId]);

  async function createFeedback(payload) {
    const { data } = await api.post('/feedbacks', payload);
    setFeedbacks((current) => [data, ...current]);
  }

  async function deleteFeedback(feedbackId) {
    try {
      await api.delete(`/feedbacks/${feedbackId}`);
      setFeedbacks((current) => current.filter((feedback) => feedback._id !== feedbackId));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete feedback.');
    }
  }

  async function deleteEvent() {
    if (!window.confirm('Delete this event and all feedback?')) return;
    try {
      await api.delete(`/events/${eventId}`);
      navigate('/events');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete event.');
    }
  }

  if (error) return <p className="form-error" role="alert">{error}</p>;
  if (!event) return <p>Loading event…</p>;
  return (
    <section className="detail-layout">
      <Link className="text-link" to="/events">← Tous les événements</Link>
      <article className="card detail-card">
        <div className="card-topline"><span className="tag">Rendez-vous</span><time dateTime={event.date}>{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(event.date))}</time></div>
        <h1>{event.title}</h1><p>{event.description}</p>
        <p><strong>Lieu :</strong> {event.location}</p><p><strong>Publié par :</strong> {event.author?.name}</p>
        {isAdmin && <button className="button button-danger" onClick={deleteEvent}>Supprimer l’événement</button>}
      </article>
      <section className="feedback-section"><h2>Les retours de la communauté</h2>
        {member?.isMember || isAdmin ? <FeedbackForm eventId={eventId} onCreate={createFeedback} /> : <p className="visitor-note">{member ? 'Devenez membre depuis votre espace pour laisser un feedback.' : 'Connectez-vous, devenez membre, puis partagez votre avis.'}</p>}
        {feedbacks.length === 0 ? <p className="empty-state">Aucun retour pour le moment.</p> : feedbacks.map((feedback) => <FeedbackCard key={feedback._id} feedback={feedback} onDelete={deleteFeedback} />)}
      </section>
    </section>
  );
}
