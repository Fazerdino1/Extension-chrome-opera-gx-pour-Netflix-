
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
