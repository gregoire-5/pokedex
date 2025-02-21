import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../../public/styles/pokemonList.css";

const PokemonList = () => {
  const { token } = useAuth();
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/pkmn/search?page=1&size=20", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des Pokémon");
        }

        const data = await response.json();
        setPokemons(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, [token]);

  if (loading) return <p>Chargement des Pokémon...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="pokemon-list">
      {pokemons.map((pokemon) => (
        <div key={pokemon._id} className="pokemon-card">
          <img src={pokemon.imgUrl} alt={pokemon.name} />
          <h3>{pokemon.name}</h3>
          <div className="pokemon-types">
            {pokemon.types && pokemon.types.map((type, index) => (
              <span key={index} className="pokemon-type">{type}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PokemonList;
