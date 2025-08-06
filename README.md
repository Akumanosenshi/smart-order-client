# 🖥️ SmartOrder – Front-end (Ionic / Angular)

**SmartOrder** est une application front-end développée avec **Ionic (Angular)** permettant aux clients et au personnel d’un restaurant de passer des **commandes à emporter**, de **réserver une table**, et de **gérer le menu**.  
L’interface est dynamique et s’adapte automatiquement au rôle de l’utilisateur (`USER` ou `RESTAURANT`) via son token JWT.

Ce front s’intègre à l’API REST SmartOrder (Spring Boot) et offre une **expérience mobile hybride fluide**, optimisée pour tablettes, smartphones et navigateurs modernes.

---

## 🚀 Fonctionnalités principales

- Formulaire d’inscription / connexion (authentification par JWT)
- Navigation adaptative selon le rôle (`USER` ou `RESTAURANT`)
- Gestion du panier, commandes, réservations
- Historique des commandes côté client
- Suivi des commandes et gestion du menu côté restaurant
- Interface responsive mobile-first

---

## ⚙️ Déploiement local avec Docker

### 🔧 Prérequis

- Docker Desktop actif
- Avoir la base de donée + le back qui tourne sur docker sur sa machine ([voir dépôt](https://github.com/Akumanosenshi/SmartOrderBack))
- Port 8100 disponible
  
# 🌐 Étape 1 – Cloner le projet

```bash
git clone https://github.com/Akumanosenshi/SmartOrderFront.git
cd SmartOrderFront
```

# 🚀 Étape 2 – Démarrer l’application

```bash
docker-compose up -d
```

L’application sera accessible à l’adresse suivante :
http://localhost:8100

# 📲​ Étape 3 – Accéder a l'application

1. Admin :
   Username : admin@gmail.com
   mdp : root
   
3. User : crée vous un compte directement depuis l'application 

# 📦 Structure du projet
Le projet suit l’architecture standard Angular :

src/app/components → composants réutilisables

src/app/pages → vues principales (menu, panier, historique…)

src/app/services → logique métier (API, panier, auth…)

src/app/guards → restriction d’accès selon le rôle

src/app/interceptors → injection automatique du JWT dans les appels API

# 🔁 Intégration continue (CI/CD)
Le dépôt intègre un pipeline GitHub Actions (.github/workflows/angular.yml) qui :

Installe les dépendances avec NPM

Compile le projet avec ionic build

Exécute les tests unitaires via Karma et Jasmine

``` yaml
Copier
Modifier
on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test -- --watch=false --browsers=ChromeHeadless
Cette CI permet de valider automatiquement le front à chaque commit ou PR.
```

# 🧪 Tests
Les composants critiques sont testés via Jasmine/Karma :

AuthService

PanierService

Routing Guards

Gestion des rôles

Tous les tests sont exécutés automatiquement dans la pipeline GitHub.


# 🙏 Remerciements
Ce projet a été développé dans le cadre du Projet de fin d’année 2024/2025 à YNOV Bordeaux.
Merci à tous les encadrants, testeurs, collègues et contributeurs pour leur implication dans la réussite du projet.

Développé par Perard Alison – M2 Développement Full Stack

