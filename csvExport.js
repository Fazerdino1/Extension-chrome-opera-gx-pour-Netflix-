// Export CSV fictif (simulation)
function exportCSV(data, filename) {
  const csv = data.map(row => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}

chrome.storage.local.get("watchStats", (data) => {
  const stats = data.watchStats || [];
  const rows = [["Date", "Durée (s)"]];
  stats.forEach(entry => rows.push([entry.date, entry.duration]));
  exportCSV(rows, "stats.csv");
});