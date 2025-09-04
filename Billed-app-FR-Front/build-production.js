#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir __dirname en ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lire le fichier index.html
const indexPath = path.join(__dirname, 'index.html');
let htmlContent = fs.readFileSync(indexPath, 'utf8');

// Récupérer l'URL de l'API depuis les variables d'environnement
const apiBaseUrl = process.env.VITE_API_BASE_URL || process.env.VITE_API_URL || 'https://billedapp.onrender.com';

// Remplacer la variable dans le HTML
htmlContent = htmlContent.replace(
  "window.API_BASE_URL = 'https://billedapp.onrender.com';",
  `window.API_BASE_URL = '${apiBaseUrl}';`
);

// Supprimer les logs de debug en production
if (process.env.NODE_ENV === 'production') {
  htmlContent = htmlContent.replace(
    /\/\/ Logs de debug pour le déploiement[\s\S]*?console\.log\('🌍 URL actuelle:', window\.location\.href\);/g,
    ''
  );
}

// Écrire le fichier modifié
fs.writeFileSync(indexPath, htmlContent);

console.log(`✅ Build completed - API URL set to: ${apiBaseUrl}`);
