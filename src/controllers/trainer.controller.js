const Trainer = require("../models/trainer.model");
const Pokemon = require("../models/pkmn.model");

exports.createTrainer = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const trainerExists = await Trainer.findOne({ userId: req.user.userId });

    if (trainerExists) {
      return res
        .status(400)
        .json({ message: "Un dresseur existe déjà pour cet utilisateur" });
    }

    const newTrainer = new Trainer({
      userId: req.user.userId,
      trainerName: req.body.trainerName,
      imgUrl: req.body.imgUrl,
    });

    await newTrainer.save();
    res.status(201).json(newTrainer);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.getTrainer = async (req, res) => {
  try {
    const userId = req.user.userId;
    const trainer = await Trainer.findOne({ userId }).populate(
      "pkmnSeen pkmnCatch"
    );

    if (!trainer) {
      return res.status(404).json({ message: "Dresseur non trouvé." });
    }

    res.status(200).json(trainer);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.updateTrainer = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    const updatedTrainer = await Trainer.findOneAndUpdate({ userId }, updates, {
      new: true,
    });

    if (!updatedTrainer) {
      return res.status(404).json({ message: "Dresseur non trouvé." });
    }

    res.status(200).json(updatedTrainer);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.deleteTrainer = async (req, res) => {
  try {
    const userId = req.user.userId;

    const deletedTrainer = await Trainer.findOneAndDelete({ userId });

    if (!deletedTrainer) {
      return res.status(404).json({ message: "Dresseur non trouvé." });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.markPokemon = async (req, res) => {
  try {
    const { trainerId, pokemonId, isCaptured } = req.body;

    if (!trainerId || !pokemonId) {
      return res
        .status(400)
        .json({ message: "L'ID du dresseur et du Pokémon sont requis." });
    }

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: "Dresseur non trouvé." });
    }

    // Vérification que le Pokémon existe
    const pokemon = await Pokemon.findById(pokemonId);
    if (!pokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé." });
    }

    // Ajout du Pokémon dans la bonne liste
    if (isCaptured) {
      if (!trainer.pkmnCatch.includes(pokemonId)) {
        trainer.pkmnCatch.push(pokemonId);
      }
    } else {
      if (!trainer.pkmnSeen.includes(pokemonId)) {
        trainer.pkmnSeen.push(pokemonId);
      }
    }

    await trainer.save();
    res.status(200).json({ message: "Pokémon mis à jour", trainer });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
