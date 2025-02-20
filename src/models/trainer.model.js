const mongoose = require("mongoose");

const TrainerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  imgUrl: { type: String, default: "" },
  trainerName: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  pkmnSeen: { type: [mongoose.Schema.Types.ObjectId], ref: "Pokemon", default: [] },
  pkmnCatch: { type: [mongoose.Schema.Types.ObjectId], ref: "Pokemon", default: [] }
});

module.exports = mongoose.model("Trainer", TrainerSchema);
