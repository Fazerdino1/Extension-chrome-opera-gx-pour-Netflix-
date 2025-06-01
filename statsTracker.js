// Statistiques de visionnage
let startTime = Date.now();

window.addEventListener("beforeunload", () => {
  const duration = Math.round((Date.now() - startTime) / 1000);
  chrome.storage.local.get(["watchStats"], (data) => {
    const stats = data.watchStats || [];
    stats.push({ date: new Date().toISOString(), duration });
    chrome.storage.local.set({ watchStats: stats });
  });
});