const userService = require("../services/user.service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "USER",
    });

    await newUser.save();
    res.status(201).json({ message: "Utilisateur créé avec succès !" });

  } catch (err) {
    console.error("Erreur lors de l'inscription :", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Données invalides", error: err.message });
    }

    if (err.code === 11000) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    res.status(500).json({ message: "Erreur serveur, veuillez réessayer plus tard." });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await userService.getUserByIdentifier(identifier);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Nom d'utilisateur/email incorrect" });
    }

    const isPasswordValid = await userService.verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "2h",
    });

    res.json({ userId: user._id, token });

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

