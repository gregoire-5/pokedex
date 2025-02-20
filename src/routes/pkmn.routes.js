const express = require("express");
const pokemonController = require("../controllers/pkmn.controller");
const authM = require("../middlewares/auth.middleware");
const roleM = require("../middlewares/role.middleware");
const router = express.Router();

router.post("/", authM, pokemonController.createPokemon);

router.post("/region", authM, pokemonController.addRegionToPokemon);

router.get("/search", authM, pokemonController.searchPokemon);

router.get("/", authM, pokemonController.getPokemon);

router.delete("/", authM, roleM("ADMIN"), pokemonController.deletePokemon);

router.put("/", authM, roleM("ADMIN"), pokemonController.updatePokemon);

router.delete(
  "/region",
  authM,
  roleM("ADMIN"),
  pokemonController.deletePokemonRegion
);

module.exports = router;
