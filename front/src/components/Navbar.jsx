import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth(); // ✅ Utilisation correcte

  return (
    <nav>
      <Link to="/pokedex">Pokédex</Link>
      <Link to="/profile">Profil</Link>
      {!user ? (
        <>
          <Link to="/login">Connexion</Link>
          <Link to="/register">Inscription</Link>
        </>
      ) : (
        <>
          <span>Bienvenue, {user.name}!</span>
          <button onClick={logout}>Déconnexion</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
