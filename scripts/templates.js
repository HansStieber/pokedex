//Rendern der Pokemon auf der Übersichtsseite
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


//Rendern der Pokemon Types auf der Übersichtsseite
function renderTypeHtml(newPokemon) {
    for (let i = 0; i < newPokemon['types'].length; i++) {
        const type = newPokemon['types'][i];
        document.getElementById('types' + newPokemon['id']).innerHTML += `
    <div><div class="type-container">${type['type']['name']}</div></div>
    `;
    }
}


//Rendern der Pokemon Types auf der Detailansicht
function renderStatsTypes(pokemon) {
    document.getElementById('stat-type-container').innerHTML = '';
    for (let i = 0; i < pokemon['types'].length; i++) {
        const type = pokemon['types'][i];
        document.getElementById('stat-type-container').innerHTML += `
    <div><div class="type-container">${type['type']['name']}</div></div>
    `;
    }
}


//Rendern der Base experience in den Pokemon Stats
function loadBaseExperience(pokemon) {
    document.getElementById('base-experience').innerHTML = `${pokemon['base_experience']}`;
}


//Rendern der Höhe in den Pokemon Stats
function loadHeight(pokemon) {
    let heightt = pokemon['height'];                                            
    let height = heightt / 10;                                                                  
    document.getElementById('height').innerHTML = height;
}


//Rendern des Gewichts experience in den Pokemon Stats
function loadWeight(pokemon) {
    let weightt = pokemon['weight'];
    let weight = weightt / 10;                                                                  
    document.getElementById('weight').innerHTML = weight;
}


//Rendern der Abilities in den Pokemon Stats
function loadAbilities(pokemon) {
    document.getElementById('abilities').innerHTML = '';                                        
    for (let i = 0; i < pokemon['abilities'].length; i++) {
        let ability = pokemon['abilities'][i];
        document.getElementById('abilities').innerHTML += `
        <span>${ability['ability']['name']}</span>
        `;
    }
}


//Rendern der Moves in den Pokemon Stats
function renderMoves(move) {
    document.getElementById('moves').innerHTML += `
    <div class="move">${move}</div>
    `;
}