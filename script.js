const API_URL = 'https://pokeapi.co/api/v2/pokemon/';

let loadedPokemon = [];

let next = [];

//Laden von 20 Pokemon
async function loadPokemon() {
    removeScrollEvent();
    let url = API_URL + next;
    let response = await fetch(url);
    let newPokemon = await response.json();
    let pokemon = newPokemon['results'];

    let newNext = newPokemon['next'].split('?')[1];

    next = [];
    next.push('?' + newNext);

    for (let i = 0; i < pokemon.length; i++) {
        let currentPokemon = pokemon[i];

        let url = currentPokemon['url'];
        let response = await fetch(url);
        let newPokemon = await response.json();

        addToLoadedPokemon(newPokemon);
        renderPokemon(newPokemon);
        checkTypeForColor(newPokemon, newPokemon['id']);
    }
    addScrollEvent();
}


//Laden von 20 Pokemon nach laden des bodys und anschließend nach scrollen zum unteren Ende der Seite
function checkEndOfPage() {
    let scrollPos = window.innerHeight + window.scrollY;
    let scrollLimitBottom = document.body.scrollHeight - 200;
    if (scrollPos >= scrollLimitBottom) {
        loadPokemon();
    }
}

function addScrollEvent() {
    window.addEventListener('scroll', checkEndOfPage);
}

function removeScrollEvent() {
    window.removeEventListener('scroll', checkEndOfPage);
}

//Hinzufügen der geladenen Pokemon zum Array "loaded Pokemon"
function addToLoadedPokemon(currentPokemon) {
    loadedPokemon.push(currentPokemon);
}

//Auswahl der richtigen Hintergrundfarbe nach Typ
function checkTypeForColor(newPokemon, id) {
    let type = newPokemon['types'][0]['type']['name'];
    document.getElementById(`pokemon${id}`).classList.add('bg-' + type);
}

//Suchfunktion
function filterPokemon() {
    let search = document.getElementById('search').value;
    search = search.toLowerCase();
    document.getElementById('pokemon').innerHTML = '';
    for (let i = 0; i < loadedPokemon.length; i++) {
        let pokemon = loadedPokemon[i];
        if (pokemon['species']['name'].toLowerCase().includes(search)) {
            renderPokemon(pokemon, i);
            checkTypeForColor(pokemon, pokemon['id']);
        }
    }
}


//Templates


function renderPokemon(newPokemon) {
    let firstLetter = newPokemon['name'].charAt(0);
    let firstLetterCap = firstLetter.toUpperCase();
    let remainingLetters = newPokemon['name'].slice(1);
    let pokemonCapitalized = firstLetterCap + remainingLetters;
    document.getElementById('pokemon').innerHTML += `
    <div id="pokemon${newPokemon['id']}" class="pokemon">
            <span>${pokemonCapitalized}</span>
        <div id="types${newPokemon['id']}">
        </div>
        <img class="pokeball-img" src="img/pokeball.png">
        <img class="pokemon-img" src="${newPokemon['sprites']['other']['official-artwork']['front_default']}">
    </div>
    `;
    for (let i = 0; i < newPokemon['types'].length; i++) {
        const type = newPokemon['types'][i];
        document.getElementById('types' + newPokemon['id']).innerHTML += `
    <div><span>${type['type']['name']}</span></div>
    `;
    }
}
