const Pokemon = require("../models/pkmn.model");

exports.createPokemon = async (req, res) => {
  try {
    const { name, imgUrl, description, types } = req.body;

    if (!name || !imgUrl || !description || !types) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const existingPokemon = await Pokemon.findOne({ name });
    if (existingPokemon) {
      return res.status(409).json({ message: "Ce Pokémon existe déjà." });
    }

    const newPokemon = new Pokemon({
      name,
      imgUrl,
      description,
      types: types.split(","),
      regions: [],
    });

    await newPokemon.save();
    res.status(201).json(newPokemon);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.addRegionToPokemon = async (req, res) => {
  try {
    const { pokemonId, regionName, regionPokedexNumber } = req.body;

    if (!pokemonId || !regionName || !regionPokedexNumber) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const pokemon = await Pokemon.findById(pokemonId);
    if (!pokemon) {
      return res.status(404).json({ message: "Pokémon introuvable." });
    }

    const regionIndex = pokemon.regions.findIndex((r) => r.regionName === regionName);
    if (regionIndex !== -1) {
      pokemon.regions[regionIndex].regionPokedexNumber = regionPokedexNumber;
    } else {
      pokemon.regions.push({ regionName, regionPokedexNumber });
    }

    await pokemon.save();
    res.status(200).json(pokemon);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.searchPokemon = async (req, res) => {
  try {
    const { partialName, typeOne, page = 1, size = 20 } = req.query;
    let query = {};

    if (partialName) {
      query.name = new RegExp(partialName, "i");
    }
    if (typeOne) {
      query.types = typeOne.toUpperCase();
    }

    const pokemons = await Pokemon.find(query)
      .skip((page - 1) * size)
      .limit(parseInt(size));

    res.status(200).json({ count: pokemons.length, data: pokemons });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getPokemon = async (req, res) => {
  try {
    const { id, name } = req.query;
    if (!id && !name) {
      return res.status(400).json({ message: "ID ou Nom requis" });
    }

    const query = id ? { _id: id } : { name };
    const pokemon = await Pokemon.findOne(query);

    if (!pokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }

    res.status(200).json(pokemon);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.deletePokemon = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "ID requis" });
    }

    const deletedPokemon = await Pokemon.findByIdAndDelete(id);
    if (!deletedPokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }

    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.updatePokemon = async (req, res) => {
  try {
    const { id, ...updateData } = req.query;
    if (!id) {
      return res.status(400).json({ message: "ID requis" });
    }

    const updatedPokemon = await Pokemon.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedPokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }

    res.status(200).json(updatedPokemon);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.deletePokemonRegion = async (req, res) => {
  try {
    const { pkmnID, regionName } = req.query;
    if (!pkmnID || !regionName) {
      return res.status(400).json({ message: "pkmnID et regionName requis" });
    }

    const pokemon = await Pokemon.findById(pkmnID);
    if (!pokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }

    pokemon.regions = pokemon.regions.filter(region => region.regionName !== regionName);
    await pokemon.save();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};