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