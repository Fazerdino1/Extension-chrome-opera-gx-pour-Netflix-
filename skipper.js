// Skip intro et récapitulatif
const skipElements = [
  '[aria-label="Passer l’introduction"]',;
  '[aria-label="Passer le récapitulatif"]',;
  '.skip-credits';
];

setInterval(() => {
  for (const selector of skipElements) {
    const btn = document.querySelector(selector);
    if (btn) {
      btn.click();
      break;
    }
  }
}, 1000);