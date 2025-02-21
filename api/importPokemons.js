require("dotenv").config();
const mongoose = require("mongoose");
const Pokemon = require("./src/models/pkmn.model");

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/pokedex";
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch(err => console.error("❌ Erreur de connexion à MongoDB :", err));

const rawRegions = {
  "red": "Kanto", "blue": "Kanto", "yellow": "Kanto",
  "gold": "Johto", "silver": "Johto", "crystal": "Johto",
  "ruby": "Hoenn", "sapphire": "Hoenn", "emerald": "Hoenn",
  "firered": "Kanto", "leafgreen": "Kanto",
  "diamond": "Sinnoh", "pearl": "Sinnoh", "platinum": "Sinnoh",
  "heartgold": "Johto", "soulsilver": "Johto",
  "black": "Unys", "white": "Unys", "black-2": "Unys", "white-2": "Unys",
  "x": "Kalos", "y": "Kalos",
  "omega-ruby": "Hoenn", "alpha-sapphire": "Hoenn",
  "sun": "Alola", "moon": "Alola", "ultra-sun": "Alola", "ultra-moon": "Alola",
  "let's-go-pikachu": "Kanto", "let's-go-eevee": "Kanto",
  "sword": "Galar", "shield": "Galar",
  "brilliant-diamond": "Sinnoh", "shining-pearl": "Sinnoh",
  "legends-arceus": "Hisui",
  "scarlet": "Paldea", "violet": "Paldea"
};

async function fetchPokemon(id) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la récupération du Pokémon ${id}:`, error);
    return null;
  }
}

async function fetchPokemonDetails(id) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails du Pokémon ${id}:`, error);
    return null;
  }
}

async function importPokemons() {
  const count = 1025;
  console.log(`🔄 Début de l'importation des ${count} Pokémon...`);

  for (let i = 1; i <= count; i++) {
    try {
      const pokemonInfo = await fetchPokemon(i);
      const pokemonDetails = await fetchPokemonDetails(i);
      if (!pokemonInfo || !pokemonDetails) continue;

      let nameEntry = pokemonDetails.names.find(n => n.language.name === "fr") || 
                      pokemonDetails.names.find(n => n.language.name === "en");
      const name = nameEntry ? nameEntry.name : `Pokemon ${i}`;

      let descriptionEntry = pokemonDetails.flavor_text_entries.find(e => e.language.name === "fr") ||
                             pokemonDetails.flavor_text_entries.find(e => e.language.name === "en");
      const description = descriptionEntry ? descriptionEntry.flavor_text.replace(/\n|\f/g, ' ') : "Pas de description";

      const regions = pokemonInfo.game_indices.map(game => rawRegions[game.version.name] || "Unknown");
      const uniqueRegions = [...new Set(regions)];
      let regionWithIndex = [{ regionName: "National", regionPokedexNumber: i }];
      regionWithIndex = regionWithIndex.concat(uniqueRegions.map(region => ({
        regionName: region,
        regionPokedexNumber: i
      })));

      const newPokemon = new Pokemon({
        name,
        imgUrl: pokemonInfo.sprites.front_default,
        description,
        types: pokemonInfo.types.map(t => t.type.name),
        regions: regionWithIndex,
        height: pokemonInfo.height,
        weight: pokemonInfo.weight,
        soundPath: pokemonInfo.cries.latest
      });

      await newPokemon.save();
      console.log(`✅ ${name} ajouté à la base de données`);

    } catch (error) {
      console.error(`❌ Erreur avec le Pokémon ${i}:`, error);
    }
  }

  console.log("🎉 Importation terminée !");
  mongoose.connection.close();
}

importPokemons();
