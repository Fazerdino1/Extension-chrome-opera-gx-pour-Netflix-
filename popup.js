document.addEventListener("DOMContentLoaded", () => {
  const theme = document.getElementById("theme");
  const speed = document.getElementById("speed");
  const enablePreview = document.getElementById("enablePreview");
  const enableStats = document.getElementById("enableStats");

  chrome.storage.local.get(["settings"], (res) => {
    const settings = res.settings || {};
    theme.value = settings.theme || "auto";
    speed.value = settings.speed || "1";
    enablePreview.checked = settings.enablePreview ?? true;
    enableStats.checked = settings.enableStats ?? true;
  });

  document.getElementById("save").onclick = () => {
    chrome.storage.local.set({
      settings: {
        theme: theme.value,
        speed: speed.value,
        enablePreview: enablePreview.checked,
        enableStats: enableStats.checked
      }
    }, () => {
      alert("✅ Paramètres sauvegardés !");
    });
  };

  // Affichage du tableau comparateur
  chrome.storage.local.get(["comparaisonData"], (res) => {
    const data = res.comparaisonData || {};
    const tableDiv = document.getElementById("compare-table");
    if (Object.keys(data).length === 0) {
      tableDiv.innerHTML = "<p style='font-size:12px;color:#aaa;'>Aucune série comparée pour l’instant.</p>";
      return;
    }

    let html = "<table><tr><th>Titre</th><th>Vu</th><th>Total</th><th>Genre</th></tr>";
    for (const k in data) {
      const s = data[k];
      html += `<tr><td>${s.title}</td><td>${s.viewed}</td><td>${s.total}</td><td>${s.genre}</td></tr>`;
    }
    html += "</table>";
    tableDiv.innerHTML = html;
  });
});
const buttonOptions = Array.from({length: 17}, (_, i) => `<option value="\${i}">Bouton \${i}</option>`).join("");
document.querySelectorAll("select").forEach(select => {
  if (select.id.startsWith("btn_")) {
    select.innerHTML = buttonOptions;
  }
});

chrome.storage.local.get(["gamepad"], (res) => {
  const config = res.gamepad || {};
  document.getElementById("btn_play").value = config.btn_play || "0";
  document.getElementById("btn_back").value = config.btn_back || "1";
  document.getElementById("btn_prev").value = config.btn_prev || "14";
  document.getElementById("btn_next").value = config.btn_next || "15";
});

document.getElementById("save").onclick = () => {
  const settings = {
    theme: theme.value,
    speed: speed.value,
    enablePreview: enablePreview.checked,
    enableStats: enableStats.checked
  };

  const gamepad = {
    btn_play: document.getElementById("btn_play").value,
    btn_back: document.getElementById("btn_back").value,
    btn_prev: document.getElementById("btn_prev").value,
    btn_next: document.getElementById("btn_next").value
  };

  chrome.storage.local.set({ settings, gamepad }, () => {
    alert("✅ Paramètres sauvegardés !");
  });
};