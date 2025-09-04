# Guide de Déploiement sur Netlify - BilledApp

Ce guide vous explique comment déployer votre application BilledApp sur Netlify.

## 📋 Prérequis

1. Un compte Netlify (gratuit)
2. Votre projet BilledApp configuré
3. Un backend déployé (Heroku, Railway, ou autre)

## 🚀 Étapes de Déploiement

### 1. Préparer le Backend

Avant de déployer le frontend, assurez-vous que votre backend est déployé et accessible. Vous pouvez utiliser :
- **Heroku** (recommandé)
- **Railway**
- **Render**
- **Vercel** (pour les fonctions serverless)

### 2. Déployer le Frontend sur Netlify

#### Option A : Déploiement via Git (Recommandé)

1. **Poussez votre code sur GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Préparation pour déploiement Netlify"
   git push origin main
   ```

2. **Connectez votre repository à Netlify**
   - Allez sur [netlify.com](https://netlify.com)
   - Cliquez sur "New site from Git"
   - Choisissez votre provider (GitHub, GitLab, etc.)
   - Sélectionnez votre repository
   - Sélectionnez la branche `main`

3. **Configuration du build**
   - **Build command** : `npm run build`
   - **Publish directory** : `.` (racine du projet)
   - **Base directory** : `Billed-app-FR-Front`

#### Option B : Déploiement par glisser-déposer

1. **Préparez les fichiers**
   ```bash
   cd Billed-app-FR-Front
   npm install
   npm run build
   ```

2. **Déployez sur Netlify**
   - Allez sur [netlify.com](https://netlify.com)
   - Glissez-déposez le dossier `Billed-app-FR-Front` dans la zone de déploiement

### 3. Configuration des Variables d'Environnement

Dans le dashboard Netlify :

1. Allez dans **Site settings** > **Environment variables**
2. Ajoutez la variable :
   - **Key** : `VITE_API_BASE_URL`
   - **Value** : L'URL de votre backend déployé (ex: `https://votre-app.herokuapp.com`)

### 4. Configuration du Domaine

1. **Domaine par défaut** : Netlify vous donne un domaine automatique
2. **Domaine personnalisé** (optionnel) :
   - Allez dans **Domain settings**
   - Ajoutez votre domaine personnalisé
   - Configurez les DNS selon les instructions

## 🔧 Configuration Avancée

### Redirections SPA

Le fichier `netlify.toml` est déjà configuré pour gérer les redirections d'une Single Page Application.

### Headers de Sécurité

Les headers de sécurité sont configurés dans `netlify.toml` :
- Protection XSS
- Protection contre le clickjacking
- Headers de cache pour les assets

### Variables d'Environnement

Le fichier `env.example` contient un exemple de configuration. Pour la production :
- Créez un fichier `.env` (ne pas commiter)
- Ou configurez directement dans Netlify

## 🧪 Test du Déploiement

1. **Vérifiez l'URL de déploiement**
2. **Testez la connexion** avec les comptes :
   - Admin : `admin@test.tld` / `admin`
   - Employé : `employee@test.tld` / `employee`

## 🐛 Résolution de Problèmes

### Erreur CORS
Si vous avez des erreurs CORS, vérifiez que votre backend autorise les requêtes depuis votre domaine Netlify.

### Variables d'environnement
Assurez-vous que `VITE_API_BASE_URL` est correctement configurée dans Netlify.

### Build échoue
Vérifiez que tous les fichiers nécessaires sont présents et que les dépendances sont installées.

## 📚 Ressources Utiles

- [Documentation Netlify](https://docs.netlify.com/)
- [Guide des variables d'environnement Netlify](https://docs.netlify.com/environment-variables/overview/)
- [Configuration netlify.toml](https://docs.netlify.com/configure-builds/file-based-configuration/)

## 🎉 Félicitations !

Votre application BilledApp est maintenant déployée sur Netlify ! 🚀
