const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: "props.env" });
const pkmnRoutes = require("./routes/pkmn.routes");

const app = express();
const port = 3000;

// Middlewares globaux
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/td")
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/pkmn", pkmnRoutes);
// app.use("/users", userRouter); // Assure-toi d'importer le userRouter si tu l'utilises

// Lancement du serveur
app.listen(port, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${port}`);
});
