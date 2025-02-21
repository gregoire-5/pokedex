import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isLoading } = useAuth();

  return (
    <nav>
      {/* Logo qui redirige vers la page d'accueil */}
      <Link to="/" className="logo">
        <img src="/path/to/logo.png" alt="Logo" />
      </Link>

      <div className="nav-links">
        <Link to="/mes-pokemons">Mes Pokémon</Link>
        <Link to="/trainer">Mon dresseur</Link>
        <Link to="/attraper-pokemon">Attraper un Pokémon</Link>

        {isLoading ? (
          <span>Chargement...</span>
        ) : !user ? (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        ) : (
          <>
            {/* <span>Bienvenue, {user.username}!</span> */}
            <button onClick={logout}>Déconnexion</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
