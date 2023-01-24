// Client-Side Scripting - Final Assignment 2022
// Ellen Woodward
// JavaScript for Part B- JS API

"use strict"

// get elements from html page
const pokemonContainer = document.getElementById("pokemonDivID");
const searchContainer = document.getElementById("searchDivID");
const dropdownMenu = document.getElementById('dropdown');

const searchBar = document.createElement("input"); // create new input element
searchBar.setAttribute("type", "text"); // allows user to insert text into searchbar
searchBar.setAttribute("placeholder", "Search for a Pokémon...");
searchBar.setAttribute("class", "search-bar") // sets searchbar class for css
searchContainer.appendChild(searchBar); // append sarch bar into the search div

const pokemonNumber = 50; // this is the number of pokemon generated on the page

function createPokemonCard(pokemon) {
  // creates a container for all the data on a pokemon
  const pokemonCard = document.createElement("div");
  pokemonCard.setAttribute("id", pokemon.name); // sets id of card to the name of the pokemon to be used in search
  
  // create a new attribute of the pokemon type to use in the user-select feature
  const newAttribute = document.createAttribute("pokemonType");
  newAttribute.value = pokemon.types[0].type.name;;
  pokemonCard.setAttributeNode(newAttribute);
  
  pokemonCard.setAttribute("class", "pokemon-card") // sets class to pokemon-card

  const imageContainer = document.createElement("div");

  const image = document.createElement("img");
  image.setAttribute("class", "img");
  image.setAttribute("src", pokemon.sprites.front_default) // sets image to be the sprite given in json

  imageContainer.appendChild(image);

  const number = document.createElement("p");
  number.textContent = `No. ${pokemon.id.toString().padStart(3, 0)}`; // writes pokemon id/number in form 00x

  const name = document.createElement("p");
  name.setAttribute("class", "name");
  name.textContent = pokemon.name; // displays pokemon name

  const type = document.createElement("p");
  type.textContent = pokemon.types[0].type.name;
  type.classList.add('types'); // as there are several types to each pokemon, we will read the first one only

  // appends all children to parents
  pokemonCard.appendChild(imageContainer);
  pokemonCard.appendChild(number);
  pokemonCard.appendChild(name);
  pokemonCard.appendChild(type);
  pokemonContainer.appendChild(pokemonCard);
}

// makes function return a promise
async function getPokemonData(id) {

  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`) // fetches json from url using the pokemon id
    .then(response => response.json()) // set response type to json
    .then(pokemonData => createPokemonCard(pokemonData)) // calls functions
    .then(pokemonData => generateSearchFilter())
    .then(pokemonData => generateSearchType());
}

// iterates through ids and pass them into fetch function
async function takePokemons() {

  for (let id = 1; id <= pokemonNumber; id++) {
    await getPokemonData(id); // pauses execution of function until data is received from fetch
  }
}

takePokemons(); // call function 

// searches through all the cards to find match
async function generateSearchFilter() {

  const pokemonCards = document.querySelectorAll(".pokemon-card"); // gets all the cards generated
  
  searchBar.addEventListener("keyup", (searchName) => { // adds an event listener to search bar when a key goes up
    dropdownMenu.selectedIndex = 0; // makes sure dropdown displays 'all'
    const inputValue = searchName.target.value.toLowerCase(); // converts what ever is in the search box to lower case
    
    pokemonCards.forEach((pokemonCard) => { // iterates through every card
      if (pokemonCard.id.toLowerCase().includes(inputValue)) { // if the card attribute 'id' contains what was inputted
        pokemonCard.style.display = "block"; // display it
      }
      else {
        pokemonCard.style.display = "none"; // else hide it
      }
    });
  });
}

// allows user to see only pokemon of a certain type
async function generateSearchType(){

  const pokemonCards = document.querySelectorAll(".pokemon-card"); // gets all the cards generated
  
  dropdownMenu.addEventListener("change", (searchType) =>{ // adds event listener to dropdown when it changes
    const selectedType = dropdownMenu.options[dropdownMenu.selectedIndex].value; // take the value of the dropdown at the index that the user selects
    
    pokemonCards.forEach((pokemonCard) => {

      const type = pokemonCard.getAttribute("pokemonType"); // get the newly created attribute 'pokemonType'

      if (selectedType === "All"){ // display all cards when type is set to all
        pokemonCard.style.display = "block";
      }
      else{
        if (type === selectedType) { // if card matches selected type, display it
          pokemonCard.style.display = "block";
        }
        else {
          pokemonCard.style.display = "none"; // else hide it
        }
      }
    });
  })
}