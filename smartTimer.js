// Minuteur intelligent affichant temps restant (simulation)
setInterval(() => {
  const video = document.querySelector("video");
  if (video && !document.getElementById("smart-timer")) {
    const timer = document.createElement("div");
    timer.id = "smart-timer";
    timer.style.position = "absolute";
    timer.style.top = "10px";
    timer.style.right = "10px";
    timer.style.padding = "5px";
    timer.style.background = "rgba(0,0,0,0.7)";
    timer.style.color = "white";
    timer.style.zIndex = "9999";
    document.body.appendChild(timer);
  }

  const video = document.querySelector("video");
  const timer = document.getElementById("smart-timer");
  if (video && timer) {
    const remaining = Math.max(0, Math.round(video.duration - video.currentTime));
    timer.textContent = `Temps restant : ${remaining}s`;
  }
}, 1000);