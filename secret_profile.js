
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
