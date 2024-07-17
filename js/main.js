// Selecionando elementos do DOM
const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');
const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

// Criando o card de ataques dinamicamente
const pokemonCard = document.createElement('div');
pokemonCard.classList.add('pokemon-card');

const cardHeader = document.createElement('div');
cardHeader.classList.add('pokemon-card__header');
cardHeader.innerHTML = '<h3>Dados do Pokémon</h3>';

const cardBody = document.createElement('div');
cardBody.classList.add('pokemon-card__body');

const typeItem = document.createElement('p');
typeItem.classList.add('pokemon-type');
cardBody.appendChild(typeItem);

const movesList = document.createElement('ul');
movesList.classList.add('pokemon-moves');
cardBody.appendChild(movesList);

pokemonCard.appendChild(cardHeader);
pokemonCard.appendChild(cardBody);
document.body.appendChild(pokemonCard);

// Variável para manter o estado do Pokémon atual
let currentPokemonId = 1;

// Função para buscar dados do Pokémon na API
const fetchPokemon = async(pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    if (APIResponse.ok) {
        const data = await APIResponse.json();
        return data;
    } else {
        throw new Error('Pokemon not found');
    }
}

// Função para buscar detalhes de um movimento (ataque)
const fetchMoveDetails = async(moveUrl) => {
    const response = await fetch(moveUrl);
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error('Move details not found');
    }
}

// Função para renderizar os dados do Pokémon na tela
const renderPokemon = async(pokemon) => {
    try {
        const data = await fetchPokemon(pokemon);

        // Atualiza os elementos com os dados do Pokémon
        pokemonName.textContent = data.name;
        pokemonNumber.textContent = `#${data.id}`;
        pokemonImage.src = data.sprites.front_default;
        pokemonImage.alt = `Imagem de ${data.name}`;

        // Limpa a lista de ataques
        movesList.innerHTML = '';

        // Adiciona o tipo do Pokémon
        typeItem.textContent = `Tipo: ${data.types.map(type => type.type.name).join(', ')}`;

        // Adiciona os ataques do Pokémon na lista
        await Promise.all(data.moves.slice(0, 4).map(async(move) => {
            const moveDetails = await fetchMoveDetails(move.move.url);
            const moveItem = document.createElement('li');
            moveItem.textContent = moveDetails.name;
            movesList.appendChild(moveItem);
        }));

        // Exibe o card de ataques
        pokemonCard.style.display = 'block';

    } catch (error) {
        console.error(error);
        pokemonName.textContent = 'Pokemon não encontrado :(';
        pokemonNumber.textContent = '';
        pokemonImage.src = '';
        pokemonImage.alt = '';
        pokemonCard.style.display = 'none';
    }
}

// Event listener para o formulário de busca
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const searchTerm = input.value.toLowerCase().trim();
    renderPokemon(searchTerm);
});

// Event listener para o botão Anterior
buttonPrev.addEventListener('click', () => {
    if (currentPokemonId > 1) {
        currentPokemonId--;
        renderPokemon(currentPokemonId);
    }
});

// Event listener para o botão Próximo
buttonNext.addEventListener('click', () => {
    currentPokemonId++;
    renderPokemon(currentPokemonId);
});

// Renderiza o primeiro Pokémon ao carregar a página
renderPokemon(currentPokemonId);