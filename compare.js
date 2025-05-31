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