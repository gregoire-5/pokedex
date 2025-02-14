const { getAllTypes } = require("../services/pkmn.service");

const getTypes = (req, res) => {
  res.json(getAllTypes());
};

module.exports = { getTypes };
