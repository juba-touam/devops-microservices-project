# Microservices E-Commerce Platform

Projet démonstratif DevOps — plateforme e-commerce basée sur une architecture microservices, conteneurisée avec Docker et déployée sur AWS via un pipeline CI/CD GitHub Actions. L'objectif est de mettre en pratique l'ensemble de la chaîne DevOps : conteneurisation, infrastructure as code, intégration continue et déploiement continu.

## Architecture

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

## Stack technique

| Service          | Technologie          | Port  | Description                             |
|------------------|----------------------|-------|-----------------------------------------|
| **Frontend**     | Angular 17 + Nginx   | 4200  | SPA avec catalogue, panier, paiement    |
| **Catalogue**    | Java 17, Spring Boot | 8080  | Gestion des produits                    |
| **Payment**      | Python 3.12, FastAPI | 8000  | Traitement des paiements                |
| **Notification** | Node.js 20, Express  | 3001  | Réception des notifications de paiement |
| **MongoDB**      | MongoDB 7            | 27017 | Base de données partagée                |

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) et [Docker Compose](https://docs.docker.com/compose/install/)
- [Terraform](https://developer.hashicorp.com/terraform/downloads) (pour le provisionnement AWS)
- [AWS CLI](https://aws.amazon.com/cli/) configuré avec vos credentials

## Lancement local

```bash
docker compose up --build
```

L'application est accessible sur [http://localhost:4200](http://localhost:4200).

## API Endpoints

### Catalogue

| Méthode | Endpoint              | Description         |
|---------|-----------------------|---------------------|
| GET     | `/api/catalogue`      | Liste des produits  |
| GET     | `/api/catalogue/{id}` | Détail d'un produit |
| GET     | `/api/health`         | Health check        |

### Payment

| Méthode | Endpoint             | Description          |
|---------|----------------------|----------------------|
| POST    | `/api/payments`      | Créer un paiement    |
| GET     | `/api/payments`      | Liste des paiements  |
| GET     | `/api/payments/{id}` | Détail d'un paiement |
| GET     | `/api/health`        | Health check         |

### Notification

| Méthode | Endpoint              | Description               |
|---------|-----------------------|---------------------------|
| POST    | `/api/notifications`  | Recevoir une notification |
| GET     | `/api/notifications`  | Liste des notifications   |
| GET     | `/api/health`         | Health check              |

## CI/CD

Le pipeline GitHub Actions s'exécute à chaque push sur `main` :

```
SonarCloud Analysis → Build & Push Docker Hub → Deploy sur EC2
```

1. **SonarCloud** — Analyse statique du code (qualité, bugs, vulnérabilités)
2. **Build & Push** — Build des 4 images Docker et push sur Docker Hub (`jubatouam/<service>:<commit-sha>`)
3. **Deploy** — Connexion SSH à l'EC2, pull des images et redémarrage des conteneurs

### Secrets GitHub requis

| Secret               | Description                        |
|----------------------|------------------------------------|
| `SONAR_TOKEN`        | Token SonarCloud                   |
| `DOCKERHUB_USERNAME` | Utilisateur Docker Hub             |
| `DOCKERHUB_TOKEN`    | Token d'accès Docker Hub           |
| `EC2_HOST`           | IP publique de l'instance EC2      |
| `EC2_USER`           | Utilisateur SSH (ubuntu)           |
| `EC2_SSH_KEY`        | Clé privée SSH (.pem)              |

## Infrastructure AWS (Terraform)

L'infrastructure est définie dans `infra/` et provisionne :

- **VPC** (10.0.0.0/16) avec subnet public, Internet Gateway et route table
- **Security Group** ouvrant les ports 22, 80, 4200, 8080, 8000, 3001
- **Instance EC2** (t3.small, Ubuntu 22.04) avec Docker pré-installé via user data

```bash
cd infra
terraform init
terraform apply -var="key_name=<votre-key-pair>"
```

Pour détruire l'infrastructure :

```bash
terraform destroy -var="key_name=<votre-key-pair>"
```

## Flux de données

1. L'utilisateur parcourt le catalogue de produits
2. Il ajoute des articles au panier (gestion côté client)
3. Il valide le paiement via le service Payment
4. Payment enregistre la transaction et notifie le service Notification
5. Notification stocke l'événement en base

## Structure du projet

```
.
├── .github/workflows/
│   └── ci-cd.yml            # Pipeline CI/CD
├── infra/
│   ├── main.tf              # Infrastructure AWS
│   ├── variables.tf         # Variables Terraform
│   └── outputs.tf           # Outputs (IP, DNS, etc.)
├── services/
│   ├── catalogue/           # Java Spring Boot
│   ├── payment/             # Python FastAPI
│   ├── notification/        # Node.js Express
│   └── frontend/            # Angular 17 + Nginx
├── docker-compose.yml       # Orchestration locale
└── sonar-project.properties # Config SonarCloud
```

## Réseau

Tous les services communiquent sur un réseau Docker bridge (`microservices`). Nginx sert de reverse proxy et route les appels `/api/*` vers les services backend correspondants. Les données MongoDB sont persistées via un volume Docker.
