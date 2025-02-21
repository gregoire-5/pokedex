import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Trainer = () => {
  const { user } = useAuth();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", avatarUrl: "" });

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3000/api/trainers/${user.userId}`)
        .then((res) => res.json())
        .then((data) => {
          setTrainer(data);
          setFormData({ name: data.name, avatarUrl: data.avatarUrl });
        })
        .catch(() => setError("Impossible de charger le dresseur"))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`http://localhost:3000/api/trainers/${user.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour");
      }

      alert("Dresseur mis à jour !");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="trainer-container">
      <h2>Mon Dresseur</h2>
      <img src={trainer?.avatarUrl} alt="Avatar du dresseur" />
      <form onSubmit={handleUpdate}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        <input type="url" name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} required />
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export default Trainer;
