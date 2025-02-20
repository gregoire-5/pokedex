const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 🔥 Lié à User
  imgUrl: { type: String, required: false },
  trainerName: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  pkmnSeen: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pokemon" }],
  pkmnCatch: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pokemon" }],
});

module.exports = mongoose.model("Trainer", trainerSchema);
