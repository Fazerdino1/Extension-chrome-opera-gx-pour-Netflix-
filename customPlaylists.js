// Système de playlists personnalisées
chrome.storage.local.get("customPlaylists", (data) => {
  let playlists = data.customPlaylists || [];
  console.log("Playlists actuelles :", playlists);
});