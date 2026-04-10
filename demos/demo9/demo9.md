# Demo 9 — Service Containers

**Theme:** "Run real infrastructure alongside your tests — no external setup required."

## Goal

Use GitHub Actions **service containers** to spin up a PostgreSQL database as a sidecar, then run integration tests against it automatically.

## Key Concepts

- **`services:`** defines containers that run alongside your job (databases, caches, message queues)
- **Health checks** ensure the service is ready before steps execute
- **Port mapping** (`5432:5432`) exposes the container to the runner
- **Environment variables** pass connection config cleanly — no hardcoded credentials in code

## What's in This Demo

| File | Purpose |
|------|---------|
| `.github/workflows/09-service-containers.yml` | The workflow — starts Postgres, runs integration tests |
| `demos/demo9/index.js` | User CRUD module using the `pg` (node-postgres) library |
| `demos/demo9/index.test.js` | Jest integration tests — add, list, delete, duplicate rejection |
| `demos/demo9/package.json` | Dependencies: `pg` + `jest` |

## Workflow Structure

```
integration-test
    │
    ├── services: postgres:16     ← Sidecar container (health-checked)
    │
    ├── actions/checkout@v4
    ├── actions/setup-node@v4
    ├── npm install
    └── npm test                  ← Tests run against real Postgres
```

## Service Container Pattern

```yaml
services:
  postgres:
    image: postgres:16
    env:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: testdb
    ports:
      - 5432:5432
    options: >-
      --health-cmd "pg_isready -U postgres"
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
```

- **`image:`** — any Docker image from Docker Hub (or a private registry)
- **`env:`** — environment variables passed into the container (Postgres uses these to create the DB)
- **`ports:`** — maps container ports to the runner's localhost
- **`options:`** — Docker CLI flags; health checks prevent tests from starting before the DB is ready

## Health Checks

Without health checks, your tests might start before Postgres is accepting connections. The `options` block uses Docker's built-in health check mechanism:

```
--health-cmd "pg_isready -U postgres"   ← Command to check readiness
--health-interval 10s                    ← Check every 10 seconds
--health-timeout 5s                      ← Timeout per check
--health-retries 5                       ← Fail after 5 failed checks
```

GitHub Actions waits for the health check to pass before running any steps.

## Try It

1. Push a change to `demos/demo9/` or run manually from the Actions tab
2. Watch the **Initialize containers** step in the logs — Postgres starts and health checks pass
3. The tests create a `users` table, run CRUD operations, and clean up
4. After the job finishes, the **Stop containers** step tears everything down automatically

## Other Services You Can Use

The same `services:` pattern works for any Docker image:

```yaml
services:
  redis:
    image: redis:7
    ports:
      - 6379:6379

  mysql:
    image: mysql:8
    env:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: testdb
    ports:
      - 3306:3306
```

## Takeaways

1. Service containers give you real infrastructure in CI — no mocks, no external dependencies
2. Health checks prevent flaky "connection refused" failures
3. Containers are ephemeral — created fresh per job, torn down automatically
4. The app code doesn't know it's in CI — it just connects to `localhost:5432`
