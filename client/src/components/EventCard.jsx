import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function EventCard({ event, onDelete, onEdit }) {
  const { isAdmin } = useAuth();

  return (
    <article className="card event-card">
      <div className="card-topline">
        <span className="tag">Rendez-vous</span>
        <time dateTime={event.date}>{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(event.date))}</time>
      </div>
      <h3><Link to={`/events/${event._id}`}>{event.title}</Link></h3>
      <p>{event.description}</p>
      <dl className="event-meta">
        <div><dt>Lieu</dt><dd>{event.location}</dd></div>
        <div><dt>Publié par</dt><dd>{event.author?.name || 'Campus Éclat'}</dd></div>
      </dl>
      <div className="card-actions">
        <Link className="text-link" to={`/events/${event._id}`}>Découvrir <span>→</span></Link>
        {isAdmin && <div className="admin-actions"><button className="link-button" onClick={() => onEdit(event)}>Modifier</button><button className="link-button danger-link" onClick={() => onDelete(event._id)}>Supprimer</button></div>}
      </div>
    </article>
  );
}
