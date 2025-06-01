// Contrôle manette Netflix Ultimate
window.addEventListener("gamepadconnected", () => {
  console.log("Manette connectée.");
  setInterval(() => {
    const gamepad = navigator.getGamepads()[0];
    if (!gamepad) return;

    const [A, B, X, Y] = gamepad.buttons;

    if (A.pressed) document.querySelector('[data-uia="player-play-pause-button"]')?.click();
    if (B.pressed) document.querySelector('.seek-backward')?.click();
    if (X.pressed) document.querySelector('.seek-forward')?.click();
  }, 500);
});