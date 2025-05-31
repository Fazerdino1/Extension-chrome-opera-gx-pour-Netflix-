
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
