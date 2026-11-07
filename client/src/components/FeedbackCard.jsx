import { useAuth } from '../context/AuthContext.jsx';

export default function FeedbackCard({ feedback, onDelete }) {
  const { member } = useAuth();
  const isOwner = member?.id === feedback.author?._id;

  return (
    <article className="feedback-card">
      <div className="feedback-heading">
        <strong>{feedback.author?.name || 'Membre Campus Éclat'}</strong>
        <span aria-label={`${feedback.rating} out of 5 stars`}>{'★'.repeat(feedback.rating)}{'☆'.repeat(5 - feedback.rating)}</span>
      </div>
      <p>{feedback.text}</p>
      <div className="card-actions">
        <small>{new Date(feedback.createdAt).toLocaleDateString()}</small>
        {isOwner && <button className="link-button danger-link" onClick={() => onDelete(feedback._id)}>Supprimer</button>}
      </div>
    </article>
  );
}
