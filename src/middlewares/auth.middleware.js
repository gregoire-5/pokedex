const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Accès refusé, token manquant" });
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decodedToken; // On stocke l'utilisateur déchiffré dans la requête
    next();
  } catch (err) {
    res.status(401).json({ message: "Accès refusé, token invalide" });
  }
};
