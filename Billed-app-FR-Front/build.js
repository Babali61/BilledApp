#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Lire le fichier index.html
const indexPath = path.join(__dirname, 'index.html');
let htmlContent = fs.readFileSync(indexPath, 'utf8');

// Récupérer l'URL de l'API depuis les variables d'environnement
const apiBaseUrl = process.env.VITE_API_BASE_URL || 'https://billedapp.onrender.com';

// Remplacer la variable dans le HTML
htmlContent = htmlContent.replace(
  "window.API_BASE_URL = 'https://billedapp.onrender.com';",
  `window.API_BASE_URL = '${apiBaseUrl}';`
);

// Écrire le fichier modifié
fs.writeFileSync(indexPath, htmlContent);

console.log(`✅ Build completed - API URL set to: ${apiBaseUrl}`);
