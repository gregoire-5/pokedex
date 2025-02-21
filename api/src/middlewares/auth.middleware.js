const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    console.log("Authorization Header:", req.header("Authorization"));

    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Accès refusé, token manquant ou mal formé" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("Decoded Token:", decodedToken);

    req.user = decodedToken; // 🔥 Stocke l'utilisateur déchiffré

    if (!req.user.userId) {
      return res
        .status(401)
        .json({ message: "Utilisateur invalide, userId manquant" });
    }

    next();
  } catch (err) {
    console.log("JWT Error:", err.message);
    res.status(401).json({ message: "Accès refusé, token invalide" });
  }
};
