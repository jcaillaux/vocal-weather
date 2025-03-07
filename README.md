## Projet Vocal Weather

Application de récupération de données météo par commande vocale.

## Installation

```bash
# création de l'environnement
python3 -m venv .venv

# backend
pip install -r requirement

# frontend 

cd frontend/
npm i
```

## Configuration

Un fichier `.env` contenant la clé API et les infos postgres doit être placé dans le dossier `backend/` :

```bash
# FOR AZURE SPEECH RECOGNITION SERVICE
SPEECH_KEY = AZURZ_API_KEY
SPEECH_REGION = SERVICE_REGION

# FOR DATABASE CONNECTION
DB_HOST=DATABASE_HOST
DB_USER=DATABASE_USER
DB_PASS=DATABASE_PASSWORD
DB_NAME=DATABASE_NAME

DB_SCHEMA_LOGS=SCHEMA_NAME_FOR_LOGS
```

## Lancement (Développement)

```bash
# Fastapi

cd backend/app
fastapi dev main.py

# Frontend
cd frontend/
npm run dev
```

## Lancement (Build)

```bash
cd frontend/
npm run build
cp chrunks ../backend/static/

cd ../backend/app
fastapi run main.py
```

### Services

Tous les services utilisés sont dans le dossier `app/services`

* Azure STT
* NER : GliNER
* SugarJS (Date Parser)
* Geo-Coding (Open Metéo)
* Weather Forecast (Open Météo)
