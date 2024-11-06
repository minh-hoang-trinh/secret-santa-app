# SecretSanta

Integrated monorepo for the Secret Santa project.

- BackEnd using NestJS + Prisma + PostgreSQL
- FrontEnd using React + Mantine + TanStack Query & Router

## Getting started

> please make sure that you have `docker` installed on your machine and the port `3001` is available.
>
> If not, you can change the port in the `docker-compose.yaml` file.

```sh
docker compose up --build
```

> For simplicity, the web app is also served by the backend server.

Navigate to http://localhost:3001 to view the web app.

The API documentation can be found at http://localhost:3001/open-api

The database is pre-seeded with some data for testing purposes. The password for all users is `password`. The admin user is `admin`

## Development

### Prerequisites

> You will need a PostgreSQL database running locally. Feel free to change the port, user, password, and database name as you wish.

```sh
docker run -p 5430:5432 -e POSTGRES_USER=local -e POSTGRES_PASSWORD=local -e POSTGRES_DB=secret-santa postgres:17
```

### Install dependencies

```sh
npm i
```

### Setup .env file

```sh
echo "DATABASE_URL=postgresql://local:local@localhost:5430/secret-santa?schema=public" > apps/api/.env
echo "JWT_SECRET=secret" >> apps/api/.env
```

### Migrate the database

```sh
npx nx prisma migrate dev
```

### Start the api

```sh
npx nx serve api
```

### Start the web app

```sh
npx nx serve web
```

navigate to http://localhost:4200 to view the web app.

## Testing

I only cover the critical part of the app with unit test (draw-combination-finder.service.ts), the rest of the app is covered with e2e tests for simplicity.

### Unit tests

```sh
npx nx test api
```

### E2E tests

You will need to either create a new database for e2e test in the existing PostgreSQL instance or spin up a new PostgreSQL instance for the e2e test.

```sh
docker run -p 5435:5432 -e POSTGRES_USER=local -e POSTGRES_PASSWORD=local -e POSTGRES_DB=secret-santa-test postgres:17
echo "DATABASE_URL=postgresql://local:local@localhost:5435/secret-santa-test?schema=public" > apps/api/.env.e2e
```

```sh
npx nx e2e api
```

## Main structure

_.controller.ts files are the controllers for the API endpoints.
_.service.ts files are the services for the controllers.

The core logic to find a possible combination for a draw is defined in the `draw-combination-finder.service.ts` file.

```
.
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── app/
│   │       │   ├── auth/
│   │       │   │   ├── auth.module.ts
│   │       │   │   ├── auth.controller.ts
│   │       │   │   └── auth.service.ts
│   │       │   ├── draws/
│   │       │   │   ├── draws.module.ts
│   │       │   │   ├── draws.service.ts
│   │       │   │   ├── draws.controller.ts
│   │       │   │   └── draw-combination-finder.service.ts
│   │       │   └── users
│   │       └── database/
│   │           ├── prisma/
│   │           │   ├── migrations/
│   │           │   │   └── ...
│   │           │   ├── schema.prisma
│   │           │   └── ...
│   │           └── ...
│   └── web/
│       └── src/
│           └── routes/
│               ├── login/
│               │   └── index.tsx
│               ├── draws/
│               │   ├── $drawId.tsx
│               │   └── index.ts
│               ├── __root.tsx
│               └── index.tsx
├── docker-compose.yaml
├── Dockerfile
├── README
└── ...
```
