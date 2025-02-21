import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const [pokemons, setPokemons] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/pokemon");
        if (!response.ok) throw new Error("Impossible de récupérer les Pokémon");
        const data = await response.json();
        setPokemons(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPokemons();
  }, []);

  return (
    <div className="home-container">
      <h1>Pokédex</h1>
      {error && <p className="error">{error}</p>}
      <div className="pokemon-list">
        {pokemons.map((pokemon) => (
          <div key={pokemon._id} className="pokemon-card">
            <img src={pokemon.imgUrl} alt={pokemon.name} />
            <h2>{pokemon.name}</h2>
            <p>{pokemon.description}</p>
            <p>Types: {pokemon.types.join(", ")}</p>
            {user && (
              <div>
                <button>Marquer comme vu</button>
                <button>Marquer comme attrapé</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
