const mongoose = require("mongoose");

let validateEmail = function (email) {
  let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validateEmail, "Veuillez entrer une adresse email valide"],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"], // Liste des rôles possibles
    default: "USER", // Par défaut, un utilisateur n'est pas admin
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
