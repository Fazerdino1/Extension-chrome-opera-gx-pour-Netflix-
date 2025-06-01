
import { initController } from "./modules/controller.js";
import { initSkipper } from "./modules/skipper.js";
import { initThemeSwitcher } from "./modules/themeSwitcher.js";

document.addEventListener("DOMContentLoaded", () => {
  initController();
  initSkipper();
  initThemeSwitcher();

  // Chargement des préférences sauvegardées
  chrome.storage.sync.get(["theme", "skip", "stats"], (data) => {
    document.getElementById("themeToggle").checked = !!data.theme;
    document.getElementById("skipIntro").checked = !!data.skip;
    document.getElementById("statsEnabled").checked = !!data.stats;
  });

  document.getElementById("saveConfig").addEventListener("click", () => {
    const theme = document.getElementById("themeToggle").checked;
    const skip = document.getElementById("skipIntro").checked;
    const stats = document.getElementById("statsEnabled").checked;

    chrome.storage.sync.set({ theme, skip, stats }, () => {
      document.getElementById("status").textContent = "Préférences sauvegardées ✔️";
      setTimeout(() => {
        document.getElementById("status").textContent = "";
      }, 2000);
    });
  });
});