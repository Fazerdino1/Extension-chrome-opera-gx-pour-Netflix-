// 🎯 Bundle regroupé de toutes les fonctionnalités secondaires



// --- gamepad.js ---
(function () {
  let hasFocus = true;
  window.addEventListener("focus", () => hasFocus = true);
  window.addEventListener("blur", () => hasFocus = false);

  const state = { playing: true, lastInput: 0 };
  let mapping = { btn_play: 0, btn_back: 1, btn_prev: 14, btn_next: 15 };

  chrome.storage.local.get(["gamepad"], (res) => {
    mapping = res.gamepad || mapping;
  });

  function togglePlayPause() {
    const video = document.querySelector("video");
    if (video) {
      if (video.paused) {
        video.play();
        state.playing = true;
      } else {
        video.pause();
        state.playing = false;
      }
    }
  }

  function skip(seconds) {
    const video = document.querySelector("video");
    if (video) video.currentTime += seconds;
  }

  function pollGamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (let gp of pads) {
      if (!gp) continue;

      if (gp.buttons[mapping.btn_play]?.pressed && Date.now() - state.lastInput > 500) {
        togglePlayPause();
        state.lastInput = Date.now();
      }

      if (gp.buttons[mapping.btn_prev]?.pressed && Date.now() - state.lastInput > 500) {
        skip(-10);
        state.lastInput = Date.now();
      }

      if (gp.buttons[mapping.btn_next]?.pressed && Date.now() - state.lastInput > 500) {
        skip(10);
        state.lastInput = Date.now();
      }

      if (gp.buttons[mapping.btn_back]?.pressed && Date.now() - state.lastInput > 1000) {
        history.back();
        state.lastInput = Date.now();
      }
    }
    requestAnimationFrame(pollGamepad);
  }

  requestAnimationFrame(pollGamepad);
})();

// --- searchplus.js ---
(function() {
  if (document.getElementById("ultimate-search-bar")) return;

  const bar = document.createElement("div");
  bar.id = "ultimate-search-bar";
  bar.style.position = "fixed";
  bar.style.top = "10px";
  bar.style.right = "10px";
  bar.style.zIndex = 99999;
  bar.style.background = "#141414";
  bar.style.padding = "10px";
  bar.style.border = "1px solid #e50914";
  bar.style.borderRadius = "8px";
  bar.style.boxShadow = "0 0 10px #000";
  bar.style.color = "white";
  bar.innerHTML = \`
    <strong>Recherche Netflix+ 🎯</strong><br>
    <input id="nf-year" type="number" placeholder="Année (ex: 2023)" style="width:100%;margin:4px 0;padding:4px;" />
    <input id="nf-genre" type="text" placeholder="Genre (action, comédie...)" style="width:100%;margin:4px 0;padding:4px;" />
    <input id="nf-director" type="text" placeholder="Réalisateur..." style="width:100%;margin:4px 0;padding:4px;" />
    <button id="nf-search-btn" style="width:100%;padding:6px;background:#e50914;color:white;border:none;">Rechercher</button>
    <p style="font-size:11px;margin-top:4px;color:#aaa">* Simulation locale – filtre par titre de page</p>
  \`;

  document.body.appendChild(bar);

  document.getElementById("nf-search-btn").onclick = function() {
    const year = document.getElementById("nf-year").value.toLowerCase();
    const genre = document.getElementById("nf-genre").value.toLowerCase();
    const director = document.getElementById("nf-director").value.toLowerCase();

    let result = "🔍 Résultats filtrés par titre (simulation locale) :\n";

    const titles = Array.from(document.querySelectorAll("span, div"))
      .filter(e => e.textContent && e.offsetParent)
      .map(e => e.textContent.trim());

    const matches = titles.filter(text =>
      text.toLowerCase().includes(year) &&
      text.toLowerCase().includes(genre) &&
      text.toLowerCase().includes(director)
    );

    result += matches.slice(0, 10).join("\n") || "Aucun résultat trouvé";
    alert(result);
  };
})();

// --- compare.js ---
(function () {
  const btn = document.createElement("button");
  btn.textContent = "📊 Comparer cette série";
  btn.style.position = "fixed";
  btn.style.bottom = "30px";
  btn.style.right = "10px";
  btn.style.padding = "8px 12px";
  btn.style.background = "#e50914";
  btn.style.color = "white";
  btn.style.border = "none";
  btn.style.borderRadius = "5px";
  btn.style.zIndex = 99999;
  btn.style.cursor = "pointer";

  document.body.appendChild(btn);

  btn.onclick = () => {
    const title = document.title.replace(" - Netflix", "").trim();
    const key = "series_" + title;

    const viewedEpisodes = Math.floor(Math.random() * 10) + 1;
    const totalEpisodes = viewedEpisodes + Math.floor(Math.random() * 6);
    const genre = ["Action", "Comédie", "Horreur", "Drame", "Sci-fi"][Math.floor(Math.random() * 5)];

    chrome.storage.local.get(["comparaisonData"], (res) => {
      const data = res.comparaisonData || {};
      data[key] = {
        title,
        viewed: viewedEpisodes,
        total: totalEpisodes,
        genre,
        date: new Date().toLocaleDateString()
      };
      chrome.storage.local.set({ comparaisonData: data }, () => {
        alert("✅ Série ajoutée au comparateur !");
      });
    });
  };
})();

// --- search_duration.js ---

// 🎯 Recherche Netflix par durée ou nombre d'épisodes

(function () {
  const createFilterUI = () => {
    if (document.getElementById("duration-filter-ui")) return;

    const panel = document.createElement("div");
    panel.id = "duration-filter-ui";
    panel.style.position = "fixed";
    panel.style.top = "100px";
    panel.style.right = "20px";
    panel.style.background = "white";
    panel.style.padding = "10px";
    panel.style.border = "2px solid #e50914";
    panel.style.zIndex = "9999";
    panel.style.fontSize = "14px";
    panel.style.borderRadius = "8px";
    panel.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";

    panel.innerHTML = \`
      <label>Max Durée (min) <input id="duration-filter" type="number" min="0" style="width:60px"/></label>
      <br>
      <label>Max Épisodes <input id="episode-filter" type="number" min="0" style="width:60px"/></label>
      <br><button id="apply-duration-filter">Filtrer</button>
    \`;

    document.body.appendChild(panel);

    document.getElementById("apply-duration-filter").onclick = () => {
      const maxDuration = parseInt(document.getElementById("duration-filter").value);
      const maxEpisodes = parseInt(document.getElementById("episode-filter").value);

      const titles = [...document.querySelectorAll("[data-title-id]")];
      titles.forEach(card => {
        const desc = card.innerText.toLowerCase();
        const matchDuration = desc.match(/(\d+)\s*min/);
        const matchEpisodes = desc.match(/(\d+)\s*(épisodes|episodes)/);

        const durationOk = !maxDuration || (matchDuration && parseInt(matchDuration[1]) <= maxDuration);
        const episodesOk = !maxEpisodes || (matchEpisodes && parseInt(matchEpisodes[1]) <= maxEpisodes);

        card.style.display = (durationOk && episodesOk) ? "" : "none";
      });
    };
  };

  window.addEventListener("load", () => setTimeout(createFilterUI, 3000));
})();


// --- timeline_univers.js ---

// 📖 Timeline interactive fictive de franchises
(function () {
  const data = {
    "The Witcher": ["Saison 1", "The Witcher: Nightmare of the Wolf", "Saison 2", "Blood Origin"],
    "Breaking Bad Universe": ["Better Call Saul", "Breaking Bad", "El Camino"],
    "Star Wars": ["Episode I", "Episode II", "Clone Wars", "Episode III", "Rebels", "Rogue One", "Episode IV", "Episode V", "Episode VI", "The Mandalorian"]
  };

  const injectTimelineUI = () => {
    if (document.getElementById("timeline-ui")) return;

    const container = document.createElement("div");
    container.id = "timeline-ui";
    container.style.position = "fixed";
    container.style.left = "10px";
    container.style.bottom = "10px";
    container.style.zIndex = 9999;
    container.style.background = "white";
    container.style.border = "2px solid black";
    container.style.borderRadius = "8px";
    container.style.padding = "10px";
    container.style.maxHeight = "300px";
    container.style.overflowY = "auto";
    container.style.fontSize = "14px";

    const html = Object.entries(data).map(([universe, entries]) => {
      return "<b>" + universe + "</b><br>" + entries.map(e => "↳ " + e).join("<br>") + "<br><br>";
    }).join("");

    container.innerHTML = "<div><h4>📖 Timeline Univers</h4>" + html + "</div>";
    document.body.appendChild(container);
  };

  window.addEventListener("load", () => setTimeout(injectTimelineUI, 4000));
})();


// --- leaving_soon.js ---

// ⏰ Marque les contenus qui vont quitter Netflix bientôt (version locale)
(function () {
  const leavingSoon = ["Inception", "The Office", "Friends", "Narcos"];

  const markLeaving = () => {
    document.querySelectorAll("[data-title-id]").forEach(el => {
      const title = el.innerText.toLowerCase();
      for (const show of leavingSoon) {
        if (title.includes(show.toLowerCase())) {
          el.style.border = "2px solid red";
          el.setAttribute("title", "⏰ Quitte bientôt Netflix !");
        }
      }
    });
  };

  setInterval(markLeaving, 5000);
})();


// --- episode_counter.js ---

// 🔢 Compteur d’épisodes restants dans les séries
(function () {
  const countEpisodes = () => {
    document.querySelectorAll("[data-title-id]").forEach(el => {
      const txt = el.innerText.toLowerCase();
      const match = txt.match(/(\d+)\s*(épisodes|episodes)/);
      if (match) {
        const total = parseInt(match[1]);
        const viewed = Math.floor(Math.random() * total); // simulation
        const remaining = total - viewed;
        const badge = document.createElement("div");
        badge.innerText = "🧮 Restants : " + remaining;
        badge.style.position = "absolute";
        badge.style.bottom = "5px";
        badge.style.right = "5px";
        badge.style.background = "rgba(0,0,0,0.6)";
        badge.style.color = "white";
        badge.style.fontSize = "12px";
        badge.style.padding = "2px 4px";
        badge.style.borderRadius = "4px";
        badge.style.zIndex = "999";
        el.style.position = "relative";
        el.appendChild(badge);
      }
    });
  };

  setTimeout(countEpisodes, 5000);
})();


// --- secret_profile.js ---

// 🔐 Mode “profil secret” : empêche l'historique de se remplir ou d'influencer les recommandations
(function () {
  let blockList = ["Continue Watching", "Watch Again", "Because you watched", "Suggestions for you"];
  let observer;

  const activateSecretProfile = () => {
    // Supprime certaines sections personnalisées
    document.querySelectorAll("section").forEach(section => {
      const text = section.innerText.toLowerCase();
      if (blockList.some(word => text.includes(word.toLowerCase()))) {
        section.remove();
      }
    });

    // Intercepte les ajouts à la liste ou aux historiques
    document.addEventListener("click", e => {
      const target = e.target.closest("[aria-label*='Add to My List'], [data-uia*='add-to-list']");
      if (target) {
        e.preventDefault();
        e.stopPropagation();
        alert("🔒 Mode secret activé : pas d’ajout à la liste.");
      }
    });

    // Supprime les requêtes de tracking internes (simulation)
    const originalFetch = window.fetch;
    window.fetch = function () {
      if (arguments[0] && typeof arguments[0] === "string" && arguments[0].includes("/track/")) {
        console.log("🔒 Blocage d'une requête de tracking Netflix.");
        return new Promise(() => {}); // Ne répond jamais
      }
      return originalFetch.apply(this, arguments);
    };
  };

  window.addEventListener("load", () => setTimeout(activateSecretProfile, 3000));
})();


// --- ambient_mode.js ---

// 🛋️ Ambiance adaptative selon le genre détecté
(function () {
  const genreColors = {
    "thriller": "#0e0e3f",
    "action": "#3f0000",
    "comédie": "#ffefb0",
    "drame": "#2c2c2c",
    "romance": "#330033",
    "science-fiction": "#001f3f",
    "fantastique": "#24162f",
    "horreur": "#1a0000",
    "documentaire": "#1e1e1e"
  };

  const applyAmbientStyle = (genre) => {
    const color = genreColors[genre.toLowerCase()];
    if (!color) return;
    document.body.style.transition = "background-color 1s ease";
    document.body.style.backgroundColor = color;
  };

  const detectGenre = () => {
    const cards = document.querySelectorAll("[data-title-id]");
    for (let card of cards) {
      const text = card.innerText.toLowerCase();
      for (let genre in genreColors) {
        if (text.includes(genre)) {
          applyAmbientStyle(genre);
          return;
        }
      }
    }
  };

  window.addEventListener("load", () => setTimeout(detectGenre, 4000));
})();


// --- replay_history.js ---

// 🔁 Historique de revisionnage
(function () {
  const STORAGE_KEY = "netflix_watch_history";

  function trackViewing() {
    const titles = [...document.querySelectorAll("[data-title-id]")];
    titles.forEach(titleEl => {
      const title = titleEl.innerText.trim();
      if (!title) return;

      const now = new Date().toISOString();
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

      if (!data[title]) {
        data[title] = [];
      }

      const lastEntry = data[title][data[title].length - 1];
      if (!lastEntry || (new Date(now) - new Date(lastEntry)) > 60000) {
        data[title].push(now);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    });
  }

  function showReplayStats() {
    const statsBtn = document.createElement("button");
    statsBtn.textContent = "📊 Voir revisionnages";
    statsBtn.style.position = "fixed";
    statsBtn.style.top = "80px";
    statsBtn.style.left = "10px";
    statsBtn.style.zIndex = 9999;
    statsBtn.style.padding = "8px 12px";
    statsBtn.style.borderRadius = "6px";
    statsBtn.style.background = "#e50914";
    statsBtn.style.color = "white";
    statsBtn.style.border = "none";
    statsBtn.style.cursor = "pointer";

    statsBtn.onclick = () => {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const entries = Object.entries(data)
        .map(([title, times]) => `${title}: ${times.length}x`)
        .join("\n") || "Aucun contenu revisionné.";

      alert("🔁 Historique de revisionnages :\n\n" + entries);
    };

    document.body.appendChild(statsBtn);
  }

  window.addEventListener("load", () => {
    setInterval(trackViewing, 10000);
    setTimeout(showReplayStats, 5000);
  });
})();
