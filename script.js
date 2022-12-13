const API_URL = 'https://pokeapi.co/api/v2/pokemon/';

let currentPokemon = [];

let loadedPokemon = [];

let next = [];

//Laden von 20 Pokemon nach laden des bodys und anschließend nach scrollen zum unteren Ende der Seite
function checkEndOfPage() {
    let scrollPos = window.innerHeight + window.scrollY;
    let scrollLimitBottom = document.body.scrollHeight - 200;
    if (closeToEndOfPage(scrollPos, scrollLimitBottom)) {
        loadPokemon();
    }
}

//Hilfsfunktion für checkEndOfPage
function closeToEndOfPage(scrollPos, scrollLimitBottom) {
    return scrollPos >= scrollLimitBottom;
}

//Laden von 20 weiteren Pokemon
async function loadPokemon() {
    showLoader();
    removeScrollEvent();                    //entfernen eines Scrollevents, anschließend werden die Pokemon geladen
    await loadNewPokemonBaseData();         //Laden der Base Daten (Name und url)
    await loadNewPokemonData();                   //Pokemon werden geladen und geredert
    addScrollEvent();
    hideLoader();                     //hinzufügen eines Scrollevents
}

//Laden der Base-Daten von 20 weiteren Pokemon aus der Poke Api (noch nicht gerendert) in das Array loadedPokemon;
//sowie festlegen der nächsten 20 Pokemon die potenziell geladen werden
async function loadNewPokemonBaseData() {
    let url = API_URL + next;
    let response = await fetch(url);
    let newPokemon = await response.json();
    defineNextPokemon(newPokemon);                  //festlegen der nächsten 20 Pokemon
    let pokemon = newPokemon['results'];
    addToCurrentPokemon(pokemon);                    //Hinzufügen zum Array loadedPokemon
}

//Festlegen der nächsten 20 Pokemon die geladen werden über 'next', welches die url der nächsten 20 enthält
function defineNextPokemon(newPokemon) {
    let newNext = newPokemon['next'].split('?')[1];     //newNext ist der Teil der Url der für die nächsten 20 Pokemon steht
    next = [];                                          //next wird geleert
    next.push('?' + newNext);                           //so befindet sich immer ner neueste url-schnipsel im array
}

//Bezieht Base-Daten aus dem Array loadedPokemon und läd anschließend die kompletten Daten der einzelnen Pokemon
//anhand der jeweiligen URL aus den Base-Daten
async function loadNewPokemonData() {
    for (let i = 0; i < currentPokemon.length; i++) {            //for-schleife geht durch das Array loadedPokemon
        let currentSinglePokemon = currentPokemon[i];                      
        let url = currentSinglePokemon['url'];                        //es wird jeweils die url des aktuellen Pokemon geholt
        let response = await fetch(url);
        let newPokemon = await response.json();                 //die geladenen Daten werden als newPokemon definiert

        renderPokemon(newPokemon);                              //Pokemon werden gerendert
        checkTypeForColor(newPokemon, newPokemon['id']);        //Bestimmung des Typs für Hintergrundfarbe
        addToLoadedPokemon(newPokemon);
    }
}

//Hinzufügen der Pokemon zum Array loadedPokemon
function addToLoadedPokemon(newPokemon) {
        loadedPokemon.push(newPokemon)
}

//Hilfsfunktion um die Anfangsbuchstaben groß zu schreiben (in der API sind si klein)
function renderPokemon(newPokemon) {
    let firstLetter = newPokemon['name'].charAt(0);
    let firstLetterCap = firstLetter.toUpperCase();
    let remainingLetters = newPokemon['name'].slice(1);
    let pokemonCapitalized = firstLetterCap + remainingLetters;
    renderPokemonHtml(newPokemon, pokemonCapitalized);
    renderTypeHtml(newPokemon);
}

//Hinzufügen eines Events: beim scrollen wird die Funktion checkEndOfPage ausgeführt;
//Falls das Ende der Seite erreicht ist werden neue Pokemon geladen
function addScrollEvent() {
    window.addEventListener('scroll', checkEndOfPage);
}

//Entfernen des Scroll-Events; so werden immer nur 20 Pokemon geladen
function removeScrollEvent() {
    window.removeEventListener('scroll', checkEndOfPage);
}

//Anzeigen des Loaders
function showLoader() {
    document.getElementById('loader').classList.remove('d-none');
    document.getElementById('loader-container').style = 'z-index: 5;';
}

//Verbergen des Loaders
function hideLoader() {
    document.getElementById('loader').classList.add('d-none');
    document.getElementById('loader-container').style = 'z-index: -1;';  
}

//Hinzufügen der geladenen Pokemon zum Array "loaded Pokemon"
function addToCurrentPokemon(pokemon) {
    currentPokemon = [];
    for (let i = 0; i < pokemon.length; i++) {
        currentPokemon.push(pokemon[i])
    };
}

//Auswahl der richtigen Hintergrundfarbe nach Typ
function checkTypeForColor(newPokemon, id) {
    let type = newPokemon['types'][0]['type']['name'];                      //Definieren des Typs
    document.getElementById(`pokemon${id}`).classList.add('bg-' + type);    //Auswahl der richtigen Klasse mit Hilfe des Typs
}

//Suchfunktion
async function filterPokemon() {
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


function renderPokemonHtml(newPokemon, pokemonCap) {
    document.getElementById('pokemon').innerHTML += `
    <div id="pokemon${newPokemon['id']}" class="pokemon">
            <span>${pokemonCap}</span>
        <div id="types${newPokemon['id']}">
        </div>
        <img class="pokeball-img" src="img/pokeball.png">
        <img class="pokemon-img" src="${newPokemon['sprites']['other']['official-artwork']['front_default']}">
    </div>
    `;
}

function renderTypeHtml(newPokemon) {
    for (let i = 0; i < newPokemon['types'].length; i++) {
        const type = newPokemon['types'][i];
        document.getElementById('types' + newPokemon['id']).innerHTML += `
    <div><div class="type-container">${type['type']['name']}</div></div>
    `;
    }
}
