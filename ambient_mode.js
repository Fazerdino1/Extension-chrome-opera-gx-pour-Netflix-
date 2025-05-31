
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
