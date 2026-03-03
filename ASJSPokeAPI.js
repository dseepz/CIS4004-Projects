const API_BASE = "https://pokeapi.co/api/v2/pokemon/";
const CACHE_PREFIX = "pokeCache:";        // localStorage key prefix
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours (adjust if necessary)

const els = {
  query: document.getElementById("query"),
  findBtn: document.getElementById("findBtn"),
  addBtn: document.getElementById("addBtn"),
  sprite: document.getElementById("sprite"),
  cry: document.getElementById("cry"),
  moveSelects: [
    document.getElementById("move1"),
    document.getElementById("move2"),
    document.getElementById("move3"),
    document.getElementById("move4"),
  ],
  teamTable: document.getElementById("teamTable"),
  teamBody: document.getElementById("teamBody"),
};

let currentPokemon = null; // holds the currently loaded pokemon data

// helpers
function normalizeQuery(q) {
  return q.trim().toLowerCase();
}

function cacheKey(q) {
  return `${CACHE_PREFIX}${q}`;
}

function setStatusEmptyUI() {
  els.sprite.hidden = true;
  els.cry.hidden = true;
  els.cry.removeAttribute("src");
  els.cry.load();
  els.addBtn.disabled = true;
  currentPokemon = null;

  for (const sel of els.moveSelects) {
    sel.innerHTML = "";
    sel.disabled = true;
  }
}

function prettifyMoveName(name) {
  return name.replaceAll("-", " ");
}

function fillMoveDropdowns(moves) {
  const optionsHTML = moves
    .map(m => `<option value="${m}">${prettifyMoveName(m)}</option>`)
    .join("");

  for (const sel of els.moveSelects) {
    sel.innerHTML = optionsHTML;
    sel.disabled = moves.length === 0;
    if (moves.length > 0) sel.selectedIndex = 0;
  }
}

function pickSpriteUrl(data) {
  return (
    data?.sprites?.front_default ||
    data?.sprites?.other?.["official-artwork"]?.front_default ||
    ""
  );
}

function pickCryUrl(data) {
  return data?.cries?.latest || data?.cries?.legacy || "";
}

// caching
function getCachedPokemon(q) {
  const raw = localStorage.getItem(cacheKey(q));
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.timestamp || !parsed.data) return null;

    const isExpired = (Date.now() - parsed.timestamp) > CACHE_TTL_MS;
    if (isExpired) {
      localStorage.removeItem(cacheKey(q));
      return null;
    }

    return parsed.data;
  } catch {
    localStorage.removeItem(cacheKey(q));
    return null;
  }
}

function setCachedPokemon(q, data) {
  const payload = { timestamp: Date.now(), data };
  localStorage.setItem(cacheKey(q), JSON.stringify(payload));
}

// core 
async function fetchPokemon(q) {
  // 1) try cache first
  const cached = getCachedPokemon(q);
  if (cached) return cached;

  // 2) otherwise fetch
  const resp = await fetch(`${API_BASE}${encodeURIComponent(q)}`);
  if (!resp.ok) {
    throw new Error("Pokemon not found. Try a name or number 1–151.");
  }
  const data = await resp.json();

  // 3) store in cache
  setCachedPokemon(q, data);

  return data;
}

function renderPokemon(data) {
  currentPokemon = data;

  // sprite
  const spriteUrl = pickSpriteUrl(data);
  if (spriteUrl) {
    els.sprite.src = spriteUrl;
    els.sprite.hidden = false;
  } else {
    els.sprite.hidden = true;
  }

  // cry audio
  const cryUrl = pickCryUrl(data);
  if (cryUrl) {
    els.cry.src = cryUrl;
    els.cry.hidden = false;
    els.cry.load();
  } else {
    els.cry.hidden = true;
    els.cry.removeAttribute("src");
    els.cry.load();
  }

  // moves -> 4 dropdowns
  const moveNames = (data.moves || []).map(m => m?.move?.name).filter(Boolean);
  fillMoveDropdowns(moveNames);

  // enable add button if we have a pokemon + move list
  els.addBtn.disabled = !data?.name;
}

function addCurrentToTeam() {
  if (!currentPokemon) return;

  const chosenMoves = els.moveSelects.map(sel => sel.value).filter(Boolean);

  const tr = document.createElement("tr");

  const tdLeft = document.createElement("td");
  const img = document.createElement("img");
  img.src = pickSpriteUrl(currentPokemon);
  img.alt = currentPokemon.name;
  img.style.width = "80px";
  img.style.height = "80px";
  img.style.imageRendering = "pixelated";
  tdLeft.appendChild(img);

  const tdRight = document.createElement("td");
  const ul = document.createElement("ul");
  for (const mv of chosenMoves) {
    const li = document.createElement("li");
    li.textContent = mv;
    ul.appendChild(li);
  }
  tdRight.appendChild(ul);

  tr.appendChild(tdLeft);
  tr.appendChild(tdRight);

  els.teamBody.appendChild(tr);
  els.teamTable.hidden = false;
}

// events
els.findBtn.addEventListener("click", async () => {
  const q = normalizeQuery(els.query.value);
  if (!q) return;

  setStatusEmptyUI();

  try {
    const data = await fetchPokemon(q);
    renderPokemon(data);
  } catch (err) {
    alert(err.message || "Fetch failed.");
    setStatusEmptyUI();
  }
});

els.query.addEventListener("keydown", (e) => {
  if (e.key === "Enter") els.findBtn.click();
});

els.addBtn.addEventListener("click", () => {
  addCurrentToTeam();
});

// initial state: ready for user input
setStatusEmptyUI();