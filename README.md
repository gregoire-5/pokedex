# Pokédex

## Description

Ce projet est une application de Pokédex permettant aux utilisateurs de visualiser les Pokémon, de gérer leur propre collection de Pokémon vus et attrapés, et d'accéder à des informations détaillées sur chaque Pokémon. L'application est construite avec un backend en **Express.js** et une base de données **MongoDB**, tandis que le frontend utilise **React.js**.

---

## Tuto d'Installation

### Prérequis

Avant de commencer, il faut s'assurer d'avoir les outils suivants installés :

- [Node.js](https://nodejs.org/) (version 14 ou supérieure)
- [MongoDB](https://www.mongodb.com/) ou une instance MongoDB hébergée (par exemple [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

### Étape 1 : Cloner le dépôt

Cloner ce dépôt dans le répertoire local avec la commande suivante :

```bash
git clone https://github.com/ton-compte/pokedex.git
cd pokedex
```


### Étape 2 : Lancer le Backend

Créer le fichier .env à la racine de api/
```bash
TOKEN_SECRET=
MONGO_URI=
```

Dans le terminal, entrer dans le répertoire api où se trouve le backend :
```bash
cd api
```
Dans le dossier api, installer les dépendances nécessaires avec npm :
```bash
npm install
```

Cette commande va télécharger toutes les bibliothèques nécessaires au bon fonctionnement du backend.

Pour démarrer le serveur backend, exécuter la commande suivante :
```bash
npm run dev
```
Le serveur backend devrait maintenant être en fonctionnement et accessible à l'adresse http://localhost:3000.


### Étape 3 : Lancer le Frontend

Dans le terminal, accéder au répertoire front où se trouve le frontend React :
```bash
cd ../front
```

Installer les dépendances nécessaires pour le frontend en utilisant npm :
```bash
npm install
```

Pour démarrer le serveur frontend, exécuter la commande suivante :
```bash
npm run dev
```

Le frontend devrait maintenant être en fonctionnement et accessible à l'adresse http://localhost:5173.


### Étape 4 : Importer les Pokémon
Pour importer tous les Pokémon dans la base de données, il faut s'assurer que le serveur backend est en cours d'exécution, puis exécuter le script d'importation des Pokémon avec la commande suivante dans le terminal :
```bash
node importPokemons.js
```

Ce script va télécharger les informations des Pokémon depuis l'API de PokeAPI et les insérer automatiquement dans la base de données MongoDB.