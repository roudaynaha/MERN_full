import { useEffect, useState } from 'react';
import api from '../api/axiosInstance.js';
import EventCard from '../components/EventCard.jsx';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  async function loadEvents() {
    setStatus('loading');
    try {
      const { data } = await api.get('/events');
      setEvents(data);
      setStatus('ready');
    } catch {
      setError('Unable to load events. Check that the API is running.');
      setStatus('error');
    }
  }

  useEffect(() => { loadEvents(); }, []);

  return (
    <section>
      <div className="page-heading"><div><p className="eyebrow">AGENDA</p><h1>Les prochains rendez-vous</h1><p className="visitor-note">Des moments pensés pour apprendre, créer et se rencontrer.</p></div></div>
      {status === 'loading' && <p>Chargement des événements…</p>}
      {status === 'error' && <p className="form-error" role="alert">{error}</p>}
      {status === 'ready' && events.length === 0 && <p className="empty-state">Les prochains rendez-vous arrivent très bientôt.</p>}
      <div className="event-grid">{events.map((event) => <EventCard key={event._id} event={event} />)}</div>
    </section>
  );
}
