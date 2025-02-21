const mongoose = require("mongoose");

const pokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  imgUrl: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: "Veuillez entrer une URL d'image valide",
    },
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
  },
  types: {
    type: [String], // Tableau de string, max 2 éléments
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 1 && v.length <= 2;
      },
      message: "Un Pokémon doit avoir 1 ou 2 types",
    },
  },
  regions: [
    {
      regionName: { type: String, required: true },
      regionPokedexNumber: { type: Number, required: true },
    },
  ],
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  soundPath: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+\.(mp3|wav|ogg)$/i.test(v);
      },
      message: "Veuillez entrer une URL de son valide",
    },
  },
});

const Pokemon = mongoose.model("Pokemon", pokemonSchema);
module.exports = Pokemon;
