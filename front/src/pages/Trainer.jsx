import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../public/styles/trainer.css";

const Trainer = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [trainerName, setTrainerName] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/trainer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des informations du dresseur");
        }

        const data = await response.json();
        setTrainer(data);
        setTrainerName(data.trainerName);
        setImgUrl(data.imgUrl);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainer();
  }, [token]);

  const handleUpdateTrainer = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/trainer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ trainerName, imgUrl }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du dresseur");
      }

      const updatedTrainer = await response.json();
      setTrainer(updatedTrainer);
      setTrainerName(updatedTrainer.trainerName);
      setImgUrl(updatedTrainer.imgUrl);
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="trainer-page">
      {trainer ? (
        <div>
          <h2>Mon Dresseur</h2>
          <div className="trainer-info">
            <img src={trainer.imgUrl || "/path/to/default-image.png"} alt={trainer.trainerName} className="trainer-image" />
            <p>Nom : {trainer.trainerName}</p>
            <p>Créé le : {new Date(trainer.creationDate).toLocaleDateString()}</p>
            <div>
              <h3>Pokémons vus :</h3>
              <ul>
                {trainer.pkmnSeen.map((pokemon, index) => (
                  <li key={index}>{pokemon.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Pokémons capturés :</h3>
              <ul>
                {trainer.pkmnCatch.map((pokemon, index) => (
                  <li key={index}>{pokemon.name}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="update-trainer">
            <h3>Modifier mon dresseur</h3>
            <input
              type="text"
              placeholder="Nom du dresseur"
              value={trainerName}
              onChange={(e) => setTrainerName(e.target.value)}
            />
            <input
              type="text"
              placeholder="URL de l'image"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
            />
            <button onClick={handleUpdateTrainer}>Mettre à jour</button>
          </div>
        </div>
      ) : (
        <div>
          <h2>Pas encore de dresseur !</h2>
          <p>Créez votre dresseur pour commencer l'aventure.</p>
        </div>
      )}
    </div>
  );
};

export default Trainer;
