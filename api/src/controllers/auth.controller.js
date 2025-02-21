const userService = require("../services/user.service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifie que tous les champs sont remplis
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    // Vérifie si l'email est déjà utilisé
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du nouvel utilisateur
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "USER",
    });

    // Sauvegarde en base de données
    await newUser.save();
    res.status(201).json({ message: "Utilisateur créé avec succès !" });

  } catch (err) {
    console.error("Erreur lors de l'inscription :", err);

    // Gestion des erreurs MongoDB
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Données invalides", error: err.message });
    }

    if (err.code === 11000) { // Code 11000 = erreur d'unicité (email déjà utilisé normalement)
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    res.status(500).json({ message: "Erreur serveur, veuillez réessayer plus tard." });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // `identifier` peut être un email ou un username

    // Recherche par email ou username
    const user = await userService.getUserByIdentifier(identifier);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Nom d'utilisateur/email incorrect" });
    }

    // Vérification du mot de passe
    const isPasswordValid = await userService.verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Mot de passe incorrect" });
    }

    // Génération du token
    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "2h",
    });

    res.json({ userId: user._id, token });

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

