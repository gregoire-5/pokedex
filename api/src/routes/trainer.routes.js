const express = require("express");
const trainerController = require("../controllers/trainer.controller");
const authM = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authM, trainerController.createTrainer);
router.get("/", authM, trainerController.getTrainer);
router.put("/", authM, trainerController.updateTrainer);
router.delete("/", authM, trainerController.deleteTrainer);
router.post("/mark", authM, trainerController.markPokemon);

module.exports = router;
