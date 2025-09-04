# Guide de Déploiement Backend - BilledApp

Ce guide vous explique comment déployer le backend de votre application BilledApp sur Railway (recommandé pour SQLite).

## 🚀 Déploiement sur Railway (Recommandé)

Railway est parfait pour votre backend car il supporte SQLite et les fichiers persistants.

### 1. Préparation

1. **Créez un compte Railway** : [railway.app](https://railway.app)
2. **Connectez votre GitHub** à Railway

### 2. Déploiement

#### Option A : Via GitHub (Recommandé)

1. **Poussez votre code sur GitHub**
   ```bash
   cd Billed-app-FR-Back
   git add .
   git commit -m "Configuration pour déploiement Railway"
   git push origin main
   ```

2. **Déployez sur Railway**
   - Allez sur [railway.app](https://railway.app)
   - Cliquez sur "New Project"
   - Sélectionnez "Deploy from GitHub repo"
   - Choisissez votre repository
   - Sélectionnez le dossier `Billed-app-FR-Back`

#### Option B : Via Railway CLI

1. **Installez Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Connectez-vous**
   ```bash
   railway login
   ```

3. **Déployez**
   ```bash
   cd Billed-app-FR-Back
   railway init
   railway up
   ```

### 3. Configuration des Variables d'Environnement

Dans le dashboard Railway :

1. Allez dans votre projet > **Variables**
2. Ajoutez les variables :
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = L'URL de votre frontend Netlify (ex: `https://votre-app.netlify.app`)

### 4. Récupérer l'URL de votre API

1. Dans Railway, allez dans **Settings** > **Domains**
2. Copiez l'URL générée (ex: `https://votre-app-production.up.railway.app`)
3. Cette URL sera utilisée pour `VITE_API_BASE_URL` dans votre frontend

## 🔄 Alternative : Déploiement sur Render

Si vous préférez Render :

### 1. Création du compte
- Allez sur [render.com](https://render.com)
- Créez un compte gratuit

### 2. Déploiement
1. **Nouveau Web Service**
2. **Connectez votre GitHub**
3. **Sélectionnez votre repository** et le dossier `Billed-app-FR-Back`
4. **Configuration** :
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Environment** : `Node`

### 3. Variables d'environnement sur Render
- `NODE_ENV` = `production`
- `FRONTEND_URL` = URL de votre frontend Netlify

## 🔧 Configuration Post-Déploiement

### 1. Mettre à jour le Frontend

Une fois votre backend déployé, mettez à jour la variable d'environnement dans Netlify :

1. Allez dans votre projet Netlify
2. **Site settings** > **Environment variables**
3. Modifiez `VITE_API_BASE_URL` avec l'URL de votre backend Railway/Render

### 2. Test de l'API

Testez votre API déployée :
```bash
curl https://votre-backend.railway.app/
```

Vous devriez voir : `Bill app backend API v1`

## 🧪 Test Complet

1. **Testez l'API** : Vérifiez que l'endpoint racine répond
2. **Testez l'authentification** : Essayez de vous connecter avec :
   - Admin : `admin@test.tld` / `admin`
   - Employé : `employee@test.tld` / `employee`
3. **Testez le frontend** : Vérifiez que votre app Netlify se connecte au backend

## 🐛 Résolution de Problèmes

### Erreur CORS
- Vérifiez que `FRONTEND_URL` est correctement configurée
- Assurez-vous que l'URL du frontend correspond exactement

### Base de données
- Railway/Render gère automatiquement la persistance de SQLite
- Les migrations s'exécutent automatiquement au démarrage

### Port
- Railway/Render définit automatiquement le port via `process.env.PORT`
- Votre code est déjà configuré pour cela

### Logs
- Consultez les logs dans le dashboard Railway/Render
- Utilisez `railway logs` si vous utilisez Railway CLI

## 📊 Monitoring

### Railway
- Dashboard avec métriques en temps réel
- Logs détaillés
- Monitoring des performances

### Render
- Dashboard avec statistiques
- Logs d'application
- Alertes par email

## 💰 Coûts

### Railway
- **Gratuit** : 500 heures/mois
- **Pro** : $5/mois pour usage illimité

### Render
- **Gratuit** : 750 heures/mois
- **Starter** : $7/mois pour usage illimité

## 🎉 Félicitations !

Votre backend BilledApp est maintenant déployé ! 🚀

**Prochaines étapes** :
1. Mettez à jour `VITE_API_BASE_URL` dans Netlify
2. Testez votre application complète
3. Configurez un domaine personnalisé si souhaité
