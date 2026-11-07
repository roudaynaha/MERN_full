import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function HomePage() {
  const { member } = useAuth();
  return (
    <section className="hero">
      <p className="eyebrow">LA VIE DU CAMPUS, AUTREMENT</p>
      <h1>Les moments qui font <em>briller</em> votre campus.</h1>
      <p>Découvrez des événements inspirants, rejoignez la communauté et partagez les expériences qui comptent.</p>
      <div className="hero-actions">
        <Link className="button" to="/events">Explorer les événements</Link>
        {!member && <Link className="button button-secondary" to="/register">Devenir membre</Link>}
      </div>
      <p className="visitor-note">{member ? 'Partagez votre feedback et vivez pleinement la communauté.' : 'Créez votre compte pour devenir membre et donner votre avis.'}</p>
    </section>
  );
}
