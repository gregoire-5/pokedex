const PkmnType = require("../models/pkmn.type");

function getAllTypes() {
  return {
    data: PkmnType,
    count: PkmnType.length
  };
}

module.exports = { getAllTypes };
