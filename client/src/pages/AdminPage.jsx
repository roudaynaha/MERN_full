import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/axiosInstance.js';
import EventCard from '../components/EventCard.jsx';
import EventForm from '../components/EventForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const [events, setEvents] = useState([]); const [editing, setEditing] = useState(null); const [error, setError] = useState('');
  const loadEvents = async () => { try { const { data } = await api.get('/events'); setEvents(data); } catch { setError('Impossible de charger les événements.'); } };
  useEffect(() => { if (isAdmin) loadEvents(); }, [isAdmin]);
  if (!isAdmin) return <Navigate to="/events" replace />;
  async function saveEvent(payload) { const { data } = editing ? await api.patch(`/events/${editing._id}`, payload) : await api.post('/events', payload); setEvents((current) => editing ? current.map((item) => item._id === data._id ? data : item) : [data, ...current]); setEditing(null); }
  async function deleteEvent(id) { if (!window.confirm('Supprimer cet événement et ses feedbacks ?')) return; try { await api.delete(`/events/${id}`); setEvents((current) => current.filter((item) => item._id !== id)); } catch (requestError) { setError(requestError.response?.data?.message || 'Suppression impossible.'); } }
  return <section className="admin-page"><p className="eyebrow">ESPACE ADMIN</p><h1>Piloter les événements</h1><p className="visitor-note">Vous êtes la seule personne autorisée à créer, modifier ou supprimer les événements.</p><EventForm key={editing?._id || 'new'} event={editing} onSave={saveEvent} onCancel={() => setEditing(null)} />{error && <p className="form-error">{error}</p>}<h2 className="section-title">Événements publiés</h2><div className="event-grid">{events.map((event) => <EventCard key={event._id} event={event} onEdit={setEditing} onDelete={deleteEvent} />)}</div></section>;
}
