const userService = require("../services/user.service");
const User = require("../models/user.model");

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ id: user._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUser = (req, res) => {
  const userIdFromToken = req.auth.userId; // L'ID de l'utilisateur connecté, extrait du token
  const requestedId = req.params.id_or_email; // L'ID ou l'email demandé

  // Si l'utilisateur est connecté et qu'il tente d'accéder à ses propres informations
  if (userIdFromToken !== requestedId) {
    return res
      .status(403)
      .json({
        error:
          "Accès interdit: vous ne pouvez accéder qu'à vos propres informations.",
      });
  }

  // Si l'ID correspond, récupérer les informations de l'utilisateur
  User
    .findById(requestedId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé." });
      }
      res.status(200).json(user); // Retourner les informations de l'utilisateur
    })
    .catch((err) => res.status(500).json({ error: err }));
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUserById(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllUsers = (req, res) => {
  userModel
    .find()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).json({ error: err }));
};

exports.checkUser = (req, res) => {
  return res.status(204).send();
};

exports.getUserMe = async (req, res) => {
  try {
    console.log("req.user:", req.user); // 🔍 Debug

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
