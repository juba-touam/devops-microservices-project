# Microservices E-Commerce Platform

Plateforme e-commerce construite avec une architecture microservices, orchestrée via Docker Compose.

## Architecture

Le projet est composé de 4 microservices et d'une base de données MongoDB partagée :

```
                        ┌─────────────┐
                        │  Frontend   │
                        │ Angular 17  │
                        │  (Nginx)    │
                        │  :4200      │
                        └──────┬──────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
          ┌──────▼──────┐ ┌───▼────┐ ┌──────▼───────┐
          │  Catalogue  │ │Payment │ │ Notification │
          │ Spring Boot │ │FastAPI │ │   Express    │
          │   :8080     │ │ :8000  │ │    :3001     │
          └──────┬──────┘ └───┬──┬─┘ └───┬──────────┘
                 │            │  │        │
                 │            │  └────────┘
                 │            │  (HTTP POST)
                 └─────┬──────┘
                       │
                ┌──────▼──────┐
                │   MongoDB   │
                │   mongo:7   │
                │   :27017    │
                └─────────────┘
```

## Services

| Service        | Technologie          | Port  | Description                          |
|----------------|----------------------|-------|--------------------------------------|
| **Frontend**   | Angular 17 + Nginx   | 4200  | SPA avec catalogue, panier, paiement |
| **Catalogue**  | Java 17, Spring Boot | 8080  | Gestion des produits                 |
| **Payment**    | Python 3.12, FastAPI | 8000  | Traitement des paiements             |
| **Notification** | Node.js 20, Express | 3001  | Réception des notifications de paiement |
| **MongoDB**    | MongoDB 7            | 27017 | Base de données partagée             |

## Prérequis

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Lancement

```bash
docker compose up --build
```

L'application est accessible sur [http://localhost:4200](http://localhost:4200).

## API Endpoints

### Catalogue (`/api/catalogue`)

| Méthode | Endpoint               | Description              |
|---------|------------------------|--------------------------|
| GET     | `/api/catalogue`       | Liste des produits       |
| GET     | `/api/catalogue/{id}`  | Détail d'un produit      |
| GET     | `/api/health`          | Health check             |

### Payment (`/api/payment`)

| Méthode | Endpoint               | Description              |
|---------|------------------------|--------------------------|
| POST    | `/api/payments`        | Créer un paiement        |
| GET     | `/api/payments`        | Liste des paiements      |
| GET     | `/api/payments/{id}`   | Détail d'un paiement     |
| GET     | `/api/health`          | Health check             |

### Notification (`/api/notification`)

| Méthode | Endpoint               | Description              |
|---------|------------------------|--------------------------|
| POST    | `/api/notifications`   | Recevoir une notification|
| GET     | `/api/notifications`   | Liste des notifications  |
| GET     | `/api/health`          | Health check             |

## Flux de données

1. L'utilisateur parcourt le catalogue de produits
2. Il ajoute des articles au panier (gestion locale côté client)
3. Il valide le paiement via le service Payment
4. Le service Payment enregistre la transaction et notifie le service Notification
5. Le service Notification stocke la notification en base

## Structure du projet

```
.
├── docker-compose.yml
└── services/
    ├── catalogue/          # Java Spring Boot
    │   ├── Dockerfile
    │   ├── pom.xml
    │   └── src/
    ├── payment/            # Python FastAPI
    │   ├── Dockerfile
    │   ├── requirements.txt
    │   └── app/
    ├── notification/       # Node.js Express
    │   ├── Dockerfile
    │   ├── package.json
    │   └── src/
    └── frontend/           # Angular 17
        ├── Dockerfile
        ├── nginx.conf
        ├── package.json
        └── src/
```

## Réseau et communication

Tous les services communiquent sur un réseau Docker bridge (`microservices`). Nginx (frontend) sert de reverse proxy et route les appels API vers les services backend correspondants.

## Données

Le catalogue est pré-rempli avec 4 produits au démarrage (Laptop, Phone, Tablet, Headphones). Les données MongoDB sont persistées via un volume Docker (`mongo-data`).
