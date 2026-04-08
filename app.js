
const STORAGE_KEY = "weather-trump-deck-order";
const STORAGE_KEY = "weather-card-app-state";
const DOUBLE_TAP_DELAY = 260;
const SHUFFLE_DURATION = 2000;
const SHUFFLE_DURATION = 1000;

const SUITS = [
  { key: "hare", label: "日本晴れ", symbol: "晴", className: "sunny" },
  { key: "ame", label: "雨", symbol: "雨", className: "rainy" },
  { key: "suna", label: "砂嵐", symbol: "砂", className: "sandy" },
  { key: "are", label: "霰", symbol: "霰", className: "hail" },
const WEATHER_TYPES = [
  "sunny",
  "cloudy",
  "rainy",
  "light-rain",
  "heavy-rain",
  "thunderstorm",
  "snow",
  "sleet",
  "hail",
  "ice",
  "fog",
  "windy",
  "sandstorm",
];

const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const deckSlot = document.getElementById("revealedCardSlot");
const interactionZone = document.getElementById("interactionZone");

let currentDeck = [];
let currentCard = null;
let isFaceUp = false;
let isShuffling = false;
let singleTapTimer = null;
let lastTapTime = 0;
initialize();

function initialize() {
  currentDeck = restoreDeck() ?? createShuffledDeck();
  persistDeck(currentDeck);
  const restored = restoreState();

  if (restored) {
    currentDeck = restored.deck;
    isFaceUp = restored.isFaceUp;
  } else {
    currentDeck = createShuffledDeck();
    isFaceUp = false;
    persistState();
  }

  render();
  bindEvents();
}
}

function handleSingleAction() {
  if (isShuffling || currentCard) {
  if (isShuffling || isFaceUp) {
    return;
  }

  currentCard = currentDeck[0];
  isFaceUp = true;
  persistState();
  render();
}

  }

  isShuffling = true;
  currentCard = null;
  isFaceUp = false;
  interactionZone.classList.add("is-shuffling");
  render();

  window.setTimeout(() => {
    currentDeck = createShuffledDeck();
    persistDeck(currentDeck);
    isFaceUp = false;
    isShuffling = false;
    interactionZone.classList.remove("is-shuffling");
    persistState();
    render();
  }, SHUFFLE_DURATION);
}

function restoreDeck() {
function render() {
  deckSlot.classList.toggle("is-empty", !isFaceUp);

  if (!isFaceUp) {
    deckSlot.innerHTML = "";
    return;
  }

  deckSlot.innerHTML = buildCardMarkup(currentDeck[0]);
}

function buildCardMarkup(card) {
  const imagePath = `./assets/weather/${card.type}.svg`;

  return `
    <article class="playing-card" aria-label="${card.id}">
      <img class="playing-card__art" src="${imagePath}" alt="" draggable="false" />
    </article>
  `;
}

function persistState() {
  storage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      deck: currentDeck.map((card) => card.id),
      isFaceUp,
    }),
  );
}

function restoreState() {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== 52) {
    if (!parsed || !Array.isArray(parsed.deck) || typeof parsed.isFaceUp !== "boolean") {
      return null;
    }

    const orderedDeck = createOrderedDeck();
    const cardsById = new Map(orderedDeck.map((card) => [card.id, card]));
    const validIds = new Set(cardsById.keys());

    if (parsed.deck.length !== 52) {
      return null;
    }

    const validIds = new Set(createOrderedDeck().map((card) => card.id));
    const hasAllCards = parsed.every((id) => validIds.has(id)) && new Set(parsed).size === 52;
    const hasAllCards = parsed.deck.every((id) => validIds.has(id)) && new Set(parsed.deck).size === 52;
    if (!hasAllCards) {
      return null;
    }

    const cardsById = new Map(createOrderedDeck().map((card) => [card.id, card]));
    return parsed.map((id) => cardsById.get(id));
    return {
      deck: parsed.deck.map((id) => cardsById.get(id)),
      isFaceUp: parsed.isFaceUp,
    };
  } catch {
    return null;
  }
}

function persistDeck(deck) {
  storage.setItem(
    STORAGE_KEY,
    JSON.stringify(deck.map((card) => card.id)),
  );
}

function createOrderedDeck() {
  return SUITS.flatMap((suit) =>
    RANKS.map((rank) => ({
      id: `${suit.key}_${rank}`,
      suitKey: suit.key,
      suitLabel: suit.label,
      suitSymbol: suit.symbol,
      className: suit.className,
      rank,
  return WEATHER_TYPES.flatMap((type) =>
    Array.from({ length: 4 }, (_, index) => ({
      id: `${type}_${index + 1}`,
      type,
    })),
  );
}
  }

  return deck;
}

function render() {
  deckSlot.classList.toggle("is-empty", currentCard === null);

  if (!currentCard) {
    deckSlot.innerHTML = "";
    return;
  }

  deckSlot.innerHTML = buildCardMarkup(currentCard);
}

function buildCardMarkup(card) {
  const displayRank = getDisplayRank(card.rank);

  return `
    <article class="playing-card ${card.className}" aria-label="${formatCardName(card)}">
      <div class="card-corner top-left">
        <span class="corner-rank">${displayRank}</span>
      </div>
      <div class="card-center">
        <div class="card-art ${card.className}" aria-hidden="true"></div>
      </div>
      <div class="card-corner bottom-right">
        <span class="corner-rank">${displayRank}</span>
      </div>
    </article>
  `;
}

function formatCardName(card) {
  return `${card.suitLabel}の${card.rank}`;
}

function getDisplayRank(rank) {
  if (rank === "A") {
    return "1";
  }

  if (rank === "J") {
    return "11";
  }

  if (rank === "Q") {
    return "12";
  }

  if (rank === "K") {
    return "13";
  }

  return rank;
}

function createStorageHandler() {
  try {
    const testKey = "__weather-trump-test__";
    const testKey = "__weather-card-app-test__";
    window.localStorage.setItem(testKey, "ok");
    window.localStorage.removeItem(testKey);

    return {
      available: true,
      getItem(key) {
        return window.localStorage.getItem(key);
      },
  } catch {
    const memoryStore = new Map();
    return {
      available: false,
      getItem(key) {
        return memoryStore.has(key) ? memoryStore.get(key) : null;
      },
