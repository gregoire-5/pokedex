const Trainer = require("../models/trainer.model");
const Pokemon = require("../models/pkmn.model");

// ➤ Créer un dresseur (POST /trainer)
exports.createTrainer = async (req, res) => {
    try {
      if (!req.user || !req.user.username) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
  
      const { trainerName, imgUrl } = req.body;
      const username = req.user.username; // Récupéré via le token
  
      // Vérifier si un dresseur existe déjà
      const existingTrainer = await Trainer.findOne({ username });
      if (existingTrainer) {
        return res.status(400).json({ message: "Un dresseur existe déjà pour cet utilisateur." });
      }
  
      // Créer le dresseur
      const newTrainer = new Trainer({ username, trainerName, imgUrl });
      await newTrainer.save();
  
      res.status(201).json(newTrainer);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  };
  

// ➤ Récupérer les infos d’un dresseur (GET /trainer)
exports.getTrainer = async (req, res) => {
  try {
    const username = req.user.username; // Récupéré via le middleware d'authentification
    const trainer = await Trainer.findOne({ username }).populate("pkmnSeen pkmnCatch");

    if (!trainer) {
      return res.status(404).json({ message: "Dresseur non trouvé." });
    }

    res.status(200).json(trainer);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ➤ Modifier un dresseur (PUT /trainer)
exports.updateTrainer = async (req, res) => {
  try {
    const username = req.user.username;
    const updates = req.body;

    const updatedTrainer = await Trainer.findOneAndUpdate({ username }, updates, { new: true });

    if (!updatedTrainer) {
      return res.status(404).json({ message: "Dresseur non trouvé." });
    }

    res.status(200).json(updatedTrainer);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ➤ Supprimer un dresseur (DELETE /trainer)
exports.deleteTrainer = async (req, res) => {
  try {
    const username = req.user.username;

    const deletedTrainer = await Trainer.findOneAndDelete({ username });

    if (!deletedTrainer) {
      return res.status(404).json({ message: "Dresseur non trouvé." });
    }

    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
