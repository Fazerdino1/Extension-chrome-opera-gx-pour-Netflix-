// Égaliseur audio simple
const audio = document.querySelector("video");
if (audio) {
  const context = new AudioContext();
  const source = context.createMediaElementSource(audio);
  const gainNode = context.createGain();
  gainNode.gain.value = 1.2; // Volume boost;

  source.connect(gainNode).connect(context.destination);
}