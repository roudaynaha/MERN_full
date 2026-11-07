import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { member, isAdmin, becomeMember } = useAuth();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!member) return <section className="auth-page"><div className="card auth-card"><h1>Connectez-vous pour accéder à votre espace.</h1></div></section>;
  async function join() {
    setError(''); setSaving(true);
    try { await becomeMember(); } catch (requestError) { setError(requestError.response?.data?.message || 'Impossible de devenir membre.'); } finally { setSaving(false); }
  }
  return <section className="profile-page"><p className="eyebrow">MON ESPACE</p><h1>Bonjour, {member.name}.</h1><article className="card profile-card"><div className="avatar">{member.name[0]?.toUpperCase()}</div><div><h2>{member.name}</h2><p>{member.email}</p><span className="tag">{isAdmin ? 'Administrateur·rice' : member.isMember ? 'Membre Campus Éclat' : 'Étudiant·e'}</span></div></article>{!isAdmin && !member.isMember && <article className="membership-card"><div><p className="eyebrow">LA COMMUNAUTÉ</p><h2>Prêt·e à devenir membre ?</h2><p>Devenez membre pour pouvoir laisser vos feedbacks après les événements.</p></div><button className="button" onClick={join} disabled={saving}>{saving ? 'Inscription…' : 'Devenir membre'}</button></article>}{member.isMember && !isAdmin && <p className="success-note">Vous faites partie de la communauté. Vos feedbacks comptent !</p>}{error && <p className="form-error">{error}</p>}</section>;
}
