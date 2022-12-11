const API_URL = 'https://pokeapi.co/api/v2/pokemon/';

let currentPokemon;


//Laden von 20 Pokemon
async function loadPokemon() {
    for (let i = 1; i < 21; i++) {

        let url = API_URL + i;
        let response = await fetch(url);
        currentPokemon = await response.json();

        console.log(currentPokemon);
        renderPokemon(currentPokemon, i);
        checkTypeForColor(currentPokemon, i);
    }
}

function checkTypeForColor(currentPokemon, i) {
    if (typeIsGrass(currentPokemon))
    makeBackgroundGreen(i);
}

function typeIsGrass(currentPokemon) {
    return currentPokemon['types'][0]['type']['name'] == 'grass';
}

function makeBackgroundGreen(i) {
    document.getElementById(`pokemon${i}`).classList.add('bg-grass');
}


//Templates


function renderPokemon(currentPokemon, i) {
    document.getElementById('pokemon').innerHTML += `
    <div id="pokemon${i}" class="pokemon">
        <span>${currentPokemon['name']}</span>
        <img src="${currentPokemon['sprites']['other']['official-artwork']['front_default']}">
    </div>
    `;
}
