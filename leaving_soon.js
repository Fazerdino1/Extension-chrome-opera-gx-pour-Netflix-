
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
