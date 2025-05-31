
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
