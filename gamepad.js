(function () {
  let hasFocus = true;
  window.addEventListener("focus", () => hasFocus = true);
  window.addEventListener("blur", () => hasFocus = false);

  const state = { playing: true, lastInput: 0 };
  let mapping = { btn_play: 0, btn_back: 1, btn_prev: 14, btn_next: 15 };

  chrome.storage.local.get(["gamepad"], (res) => {
    mapping = res.gamepad || mapping;
  });

  function togglePlayPause() {
    const video = document.querySelector("video");
    if (video) {
      if (video.paused) {
        video.play();
        state.playing = true;
      } else {
        video.pause();
        state.playing = false;
      }
    }
  }

  function skip(seconds) {
    const video = document.querySelector("video");
    if (video) video.currentTime += seconds;
  }

  function pollGamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (let gp of pads) {
      if (!gp) continue;

      if (gp.buttons[mapping.btn_play]?.pressed && Date.now() - state.lastInput > 500) {
        togglePlayPause();
        state.lastInput = Date.now();
      }

      if (gp.buttons[mapping.btn_prev]?.pressed && Date.now() - state.lastInput > 500) {
        skip(-10);
        state.lastInput = Date.now();
      }

      if (gp.buttons[mapping.btn_next]?.pressed && Date.now() - state.lastInput > 500) {
        skip(10);
        state.lastInput = Date.now();
      }

      if (gp.buttons[mapping.btn_back]?.pressed && Date.now() - state.lastInput > 1000) {
        history.back();
        state.lastInput = Date.now();
      }
    }
    requestAnimationFrame(pollGamepad);
  }

  requestAnimationFrame(pollGamepad);
})();