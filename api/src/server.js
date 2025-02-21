const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });
const pkmnRoutes = require("./routes/pkmn.routes");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const trainerRoutes = require("./routes/trainer.routes");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const cors = require("cors");

const app = express();
const port = 3000;

// Middlewares globaux
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Connexion à MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/pokedex")
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.log(err));

// Routes
app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pkmn", pkmnRoutes);
app.use("/api/trainer", trainerRoutes);

// Charger la doc Swagger
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Lancement du serveur
app.listen(port, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${port}`);
});
