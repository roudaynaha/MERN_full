# Rapport synthétique — Student Club Hub

## Objectif

Student Club Hub est une application web pour une association étudiante. Les visiteurs consultent les événements et avis; les membres inscrits gèrent leurs propres contenus.

## Architecture

Le projet est organisé en deux dossiers. `server/` contient l'API Express, les modèles Mongoose, les routes et le middleware JWT. `client/` contient la SPA React 18 créée avec Vite.

## Modèles et relations

`Member` contient le nom, l'e-mail unique et le mot de passe haché avec bcrypt. `Event` référence son auteur avec `author: { ref: 'Member' }`: un membre peut donc publier plusieurs événements. `Feedback` référence à la fois un événement et son auteur: un événement peut recevoir plusieurs avis. Les routes utilisent `populate()` pour retourner le nom de l'auteur et le titre de l'événement lié.

## Sécurité

L'inscription et la connexion renvoient un JWT. Le middleware `protect` lit `Authorization: Bearer <token>`, vérifie le jeton et attache le membre à la requête. Les créations et suppressions sont protégées; une suppression exige aussi que le membre soit auteur de la ressource. Les fichiers `.env` sont ignorés par Git.

## Interface

La SPA utilise React Router, composants réutilisables, formulaires contrôlés, `useState`, `useEffect`, AuthContext et `localStorage`. Axios ajoute automatiquement le JWT. Sans session, l'interface reste en lecture seule; après connexion, les formulaires et suppressions sont disponibles.

## Mise en ligne

MongoDB Atlas héberge les données, Render l'API et Vercel le client. Les variables nécessaires sont `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` sur Render et `VITE_API_URL` sur Vercel. Des captures de l'application déployée et des pages Render/Vercel peuvent être ajoutées avant la soutenance.
