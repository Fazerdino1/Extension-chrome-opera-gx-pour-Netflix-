// Thème clair/sombre automatique
const hour = new Date().getHours();
const theme = (hour >= 7 && hour <= 19) ? 'light' : 'dark';

document.documentElement.setAttribute('data-netflix-theme', theme);