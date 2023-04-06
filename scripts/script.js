const API_URL = 'https://pokeapi.co/api/v2/pokemon/';
let currentPokemon = [];  //Base Daten der Pokemon die gerade neu hinzu geladen werden
let loadedPokemon = [];   //Daten aller Pokemon die geladen wurden
let next = [];
let currentId;


//Laden von 20 Pokemon nach laden des bodys (onload) und anschließend nach scrollen zum unteren Ende der Seite (eventlistner). Wenn die Seite nicht scrollbar ist werden direkt
//weitere Pokemon geladen.
async function checkEndOfPage() {
    let scrollPos = window.innerHeight + window.scrollY;
    let scrollLimitBottom = document.body.scrollHeight - 200;
    console.log(scrollLimitBottom)
    if (closeToEndOfPage(scrollPos, scrollLimitBottom)) {
        await loadPokemon();
        if (scrollLimitBottom <= 0) {
            loadPokemon();
        }
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
    hideLoader();      //hinzufügen eines Scrollevents

}


//Laden der Base-Daten von 20 weiteren Pokemon aus der Poke Api (noch nicht gerendert) in das Array loadedPokemon;
//sowie festlegen der nächsten 20 Pokemon die potenziell geladen werden
async function loadNewPokemonBaseData() {
    let url = API_URL + next;
    let response = await fetch(url);
    let newPokemon = await response.json();
    defineNextPokemon(newPokemon);                  //festlegen der nächsten 20 Pokemon
    let pokemon = newPokemon['results'];
    addToCurrentPokemon(pokemon);             //Hinzufügen zum Array CurrentPokemon
}


//Festlegen der nächsten 20 Pokemon die geladen werden über 'next', welches die url der nächsten 20 enthält
function defineNextPokemon(newPokemon) {
    let newNext = newPokemon['next'].split('?')[1];     //newNext ist der Teil der Url der für die nächsten 20 Pokemon steht
    next = [];                                          //next wird geleert
    next.push('?' + newNext);                           //so befindet sich immer ner neueste url-schnipsel im array
}


//Hinzufügen der geladenen Pokemon zum Array "loaded Pokemon"
function addToCurrentPokemon(pokemon) {
    currentPokemon = [];                                     //Array wird geleert damit nur die 20 aktuell zu ladenden Pokemon im Array sind
    for (let i = 0; i < pokemon.length; i++) {
        currentPokemon.push(pokemon[i])
    };
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
        addToLoadedPokemon(newPokemon);                         //Pokemon werden dem Array geladene Pokemon hinzugefügt
    }
}


//Hinzufügen der Pokemon zum Array loadedPokemon
function addToLoadedPokemon(newPokemon) {
    loadedPokemon.push(newPokemon);
}


//Hilfsfunktion um die Anfangsbuchstaben der Namen groß zu schreiben (in der API sind sie klein)
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
    document.getElementById('loader-container').style = 'z-index: 99';
}


//Verbergen des Loaders
function hideLoader() {
    document.getElementById('loader').classList.add('d-none');
    document.getElementById('loader-container').style = 'z-index: -1';
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
    document.getElementById('pokemon').innerHTML = '';                  //Container mit den Pokemon wird geleert
    loadSearchedPokemon(search);                                        //Anschließend werden die der Suche entsprechenden Pokemon geladen
}


//Laden der gesuchten Pokemon
function loadSearchedPokemon(search) {
    for (let i = 0; i < loadedPokemon.length; i++) {                        //für die Suche wir das Array loaded Pokemon durchsucht
        let pokemon = loadedPokemon[i];
        if (pokemon['species']['name'].toLowerCase().includes(search)) {    //Wenn die Suche mit teilen eines Names übereistimmt wird das
            renderPokemon(pokemon, i);                                      //Pokemon gerendert
            checkTypeForColor(pokemon, pokemon['id']);
        }
    }
}


//Öffnen des Statusfenster eines Pokemon
function openStats(id) {
    currentId = id;
    let pokemon = loadedPokemon[id - 1];
    let name = pokemon['types'][0]['type']['name'];        //Da ein Array bei 0 zu zählen beginnt muss die Pokemon id um 1 verringert werden
    loadStatsContainer(name);
    loadPokemonImg(pokemon);
    showArrows(id);
    loadNameCapitalized(pokemon);
    addPokemonNumber(id);
    renderStatsTypes(pokemon);
    loadAbout(pokemon);
    loadBaseStats(pokemon, name);
    loadMoves(pokemon);
}


//Laden des Containers mit den Stats eines Pokemon
function loadStatsContainer(name) {
    document.getElementById('poke-stats-container').className = '';                                 //entfernt alle Klassen damit erneut eine Hintergrundfarbe bestimmt werden kann
    document.getElementById('poke-stats-container').classList.add('poke-stats-container');          //fügt die Standardklasse wieder hinzu
    document.getElementById('poke-stats-container').classList.add('show-stats');                    //Klasse sorgt für ins Bild sliden des Containers

    let type = name;
    document.getElementById('poke-stats-container').classList.add('bg-' + type);                    //Bestimmung der Hintergrundfarbe

    document.getElementById('poke-stats-bg').classList.add('show-stats-bg');                        //Hintergrund wird grau und unscharf

    document.getElementById('body').classList.add('overflow-hidden');                               //entfernt die Scrollbar des bodys
}


//Laden des Image des ausgewählten Pokemon
function loadPokemonImg(pokemon) {
    document.getElementById('stat-img').src = `${pokemon['sprites']['other']['official-artwork']['front_default']}`;
}


//Laden des Namen mit Großbuchstaben
function loadNameCapitalized(pokemon) {
    let firstLetter = pokemon['name'].charAt(0);
    let firstLetterCap = firstLetter.toUpperCase();
    let remainingLetters = pokemon['name'].slice(1);
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
    loadBaseExperience(pokemon);                //rendert die base-experience
    loadHeight(pokemon);                        //rendert die Höhe in m              
    loadWeight(pokemon);                        //rendert das Gewicht in kg
    loadAbilities(pokemon);                     //rendert die Fähigkeiten der Pokemon 
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
function loadBaseStats(pokemon, name) {
    for (let i = 0; i < pokemon['stats'].length; i++) {                                 //Geht durch das Array pokemon['stats']

        let stat = pokemon['stats'][i]['base_stat'];                                    //Definiert stat um es als länge wieder zu verwenden      
        document.getElementById('base-stat' + i).style = `width: ${stat}px;`
        document.getElementById('stat-number' + i).innerHTML = `${stat}`;

        document.getElementById('base-stat' + i).className = '';                        //entfernt alle Klassen damit im Anschluss die Balken gefärbt werden können
        document.getElementById('base-stat' + i).classList.add('actual-progress');

        let type = name;
        document.getElementById('base-stat' + i).classList.add('bg-' + type);          //färbt die Balken in der Farbe des Pokemon
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
        renderMoves(move);
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
    if (id > 1) {                                                                     //wenn die Id des Pokemon größer 1 ist soll der Pfeil slideLeft angezeigt werden
        document.getElementById('slide-left').classList.remove('d-none');
    }                                                                                 //ebenfalls der Pfeil slideRight
    document.getElementById('slide-right').classList.remove('d-none');
}


//Verbergen der Pfeile zum sliden
function hideArrows() {
    document.getElementById('slide-left').classList.add('d-none');
    document.getElementById('slide-right').classList.add('d-none');
}


//Zum nächsten Pokemon wechseln
async function slideRight() {
    if (currentId == loadedPokemon.length) {            //wenn beim sliden durch die Pokemon das Ende des Arrays erreicht ist
        await loadPokemon();                            //werden weitere 20 Pokemon geladen
        currentId++;
        openStats(currentId);                           //Anschließend die Stats geladen
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
        document.getElementById('slide-left').classList.add('d-none');          //wenn beim sliden nach links der Anfang erreicht ist wird der Pfeil slideLeft entfernt
    }
}

