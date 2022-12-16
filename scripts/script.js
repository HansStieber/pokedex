const API_URL = 'https://pokeapi.co/api/v2/pokemon/';
let currentPokemon = [];  //Base Daten der Pokemon die gerade neu hinzu geladen werden
let loadedPokemon = [];   //Daten aller Pokemon die geladen wurden
let next = [];
let currentId;


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
    loadedPokemon.push(newPokemon);
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
    document.getElementById('loader-container').style = 'z-index: 99;';
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
function filterPokemon() {
    let search = document.getElementById('search').value;
    search = search.toLowerCase();
    document.getElementById('pokemon').innerHTML = '';
    loadSearchedPokemon(search);
}


//Laden der gesuchten Pokemon
function loadSearchedPokemon(search) {
    for (let i = 0; i < loadedPokemon.length; i++) {
        let pokemon = loadedPokemon[i];
        if (pokemon['species']['name'].toLowerCase().includes(search)) {
            renderPokemon(pokemon, i);
            checkTypeForColor(pokemon, pokemon['id']);
        }
    }
}


//Öffnen des Statusfenster eines Pokemon
function openStats(id) {
    currentId = id;
    loadStatsContainer(id);
    loadPokemonImg(id);
    showArrows(id);
    loadNameCapizalized(id);
    addPokemonNumber(id);
    renderStatsTypes(loadedPokemon[id - 1]);
    loadAbout(loadedPokemon[id - 1]);
    loadBaseStats(loadedPokemon[id - 1]);
    loadMoves(loadedPokemon[id - 1]);
}


//Laden des Fensters mit den Stats eines Pokemon
function loadStatsContainer(id) {
    document.getElementById('poke-stats-container').className = '';
    document.getElementById('poke-stats-container').classList.add('poke-stats-container');
    document.getElementById('poke-stats-container').classList.add('show-stats');

    let type = loadedPokemon[id - 1]['types'][0]['type']['name'];
    document.getElementById('poke-stats-container').classList.add('bg-' + type);

    document.getElementById('poke-stats-bg').classList.add('show-stats-bg');

    document.getElementById('body').classList.add('overflow-hidden');
}


//Laden des Image des ausgewählten Pokemon
function loadPokemonImg(id) {
    document.getElementById('stat-img').src = `${loadedPokemon[id - 1]['sprites']['other']['official-artwork']['front_default']}`;
}


//Laden des Namen mit Großbuchstaben
function loadNameCapizalized(id) {
    let firstLetter = loadedPokemon[id - 1]['name'].charAt(0);
    let firstLetterCap = firstLetter.toUpperCase();
    let remainingLetters = loadedPokemon[id - 1]['name'].slice(1);
    let pokemonCapitalized = firstLetterCap + remainingLetters;
    document.getElementById('species').innerHTML = pokemonCapitalized;
}


//Hinzufügen der Nummer des jeweiligen Pokemon
function addPokemonNumber(id) {
    document.getElementById('id-container').innerHTML = '';
    document.getElementById('id-container').innerHTML = id;
}


//Öffnen der Stat section about
function openAbout() {
    document.getElementById('about-selector').classList.add('selected-info');
    document.getElementById('base-stats-selector').classList.remove('selected-info');
    document.getElementById('moves-selector').classList.remove('selected-info');

    document.getElementById('about').classList.remove('d-none');
    document.getElementById('base-stats').classList.add('d-none');
    document.getElementById('moves').classList.add('d-none');
}


//Laden der Stat section about
function loadAbout(pokemon) {
    document.getElementById('base-experience').innerHTML = `${pokemon['base_experience']}`;
    let heightt = pokemon['height'];
    let height = heightt / 10;
    document.getElementById('height').innerHTML = height;
    let weightt = pokemon['weight'];
    let weight = weightt / 10;
    document.getElementById('weight').innerHTML = weight;
    document.getElementById('abilities').innerHTML = '';
    for (let i = 0; i < pokemon['abilities'].length; i++) {
        let ability = pokemon['abilities'][i];
        document.getElementById('abilities').innerHTML += `
        <span>${ability['ability']['name']}</span>
        `;
    }
}


//Öffnen der Stat section base stats
function openBaseStats() {
    document.getElementById('about-selector').classList.remove('selected-info');
    document.getElementById('base-stats-selector').classList.add('selected-info');
    document.getElementById('moves-selector').classList.remove('selected-info');

    document.getElementById('about').classList.add('d-none');
    document.getElementById('base-stats').classList.remove('d-none');
    document.getElementById('moves').classList.add('d-none');
}


//Laden der Stat section Base Stats
function loadBaseStats(pokemon) {
    for (let i = 0; i < pokemon['stats'].length; i++) {

        let stat = pokemon['stats'][i]['base_stat'];
        document.getElementById('base-stat' + i).style = `width: ${stat}px;`
        document.getElementById('stat-number' + i).innerHTML = `${stat}`;

        document.getElementById('base-stat' + i).className = '';
        document.getElementById('base-stat' + i).classList.add('actual-progress');
        let type = pokemon['types'][0]['type']['name'];
        document.getElementById('base-stat' + i).classList.add('bg-' + type);
    }
}

//Öffnen der Stat section Moves
function openMoves() {
    document.getElementById('about-selector').classList.remove('selected-info');
    document.getElementById('base-stats-selector').classList.remove('selected-info');
    document.getElementById('moves-selector').classList.add('selected-info');

    document.getElementById('about').classList.add('d-none');
    document.getElementById('base-stats').classList.add('d-none');
    document.getElementById('moves').classList.remove('d-none');
}


//Laden der Stat section Moves
function loadMoves(pokemon) {
    document.getElementById('moves').innerHTML = '';
    for (let i = 1; i < pokemon['moves'].length; i++) {
        let move = pokemon['moves'][i]['move']['name'];
        document.getElementById('moves').innerHTML += `
    <div class="move">${move}</div>
    `;
    }
}

//Schließen des Statusfenster eines Pokemon
function closeStats() {
    document.getElementById('poke-stats-container').classList.remove('show-stats');
    document.getElementById('poke-stats-bg').classList.remove('show-stats-bg');
    document.getElementById('body').classList.remove('overflow-hidden');
    hideArrows();
}


//Anzeigen der Pfeile zum sliden
function showArrows(id) {
    if (id > 1) {
        document.getElementById('slide-left').classList.remove('d-none');
    }
    document.getElementById('slide-right').classList.remove('d-none');
}


//Verbergen der Pfeile zum sliden
function hideArrows() {
    document.getElementById('slide-left').classList.add('d-none');
    document.getElementById('slide-right').classList.add('d-none');
}


//Zum nächsten Pokemon wechseln
async function slideRight() {
    if (currentId == loadedPokemon.length) {
        await loadPokemon();
        currentId++;
        openStats(currentId);
    } else {
        currentId++;
        openStats(currentId);
    }
}


//Zum vorherigen Pokemon wechseln
function slideLeft() {
    currentId--;
    openStats(currentId);
    if (currentId == 1) {
        document.getElementById('slide-left').classList.add('d-none');
    }
}




//Templates


function renderPokemonHtml(newPokemon, pokemonCap) {
    document.getElementById('pokemon').innerHTML += `
    <div id="pokemon${newPokemon['id']}" class="pokemon" onclick="openStats(${newPokemon['id']})">
            <span>${pokemonCap}</span>
        <div id="types${newPokemon['id']}">
        </div>
        <img class="pokeball-img" src="img/pokeball.jpg">
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

function renderStatsTypes(pokemon) {
    document.getElementById('stat-type-container').innerHTML = '';
    for (let i = 0; i < pokemon['types'].length; i++) {
        const type = pokemon['types'][i];
        document.getElementById('stat-type-container').innerHTML += `
    <div><div class="type-container">${type['type']['name']}</div></div>
    `;
    }
}
