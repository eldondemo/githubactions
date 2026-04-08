# GitHub Actions Workshop

A hands-on workshop repo for learning GitHub Actions — from basic workflows to full CI/CD pipelines.

## Repository Structure

```
├── .github/workflows/   # GitHub Actions workflow files
├── scripts/              # Helper scripts used by workflows
├── src/                  # Sample application code
└── README.md
```

## Demos

| Demo | Topic | Workflow |
|------|-------|----------|
| 1 | Workflows (Triggers, Jobs, Steps, Marketplace Actions) | `01-workflows.yml` |
| 2 | Environments, Secrets & GITHUB_TOKEN Permissions | `02-env-secrets-permissions.yml` |

## How to Run Locally

1. Create the repo
2. Check out the relevant demo branch or use `main`
3. Push a commit or use **Actions → Run workflow** (manual dispatch)

## Demo 1 — Workflows

**Goal:** Understand workflow file location, `on:` triggers, job/step anatomy, and how to read logs.

### Key Concepts
- Workflows live in `.github/workflows/`
- `on:` defines **when** a workflow runs (push, pull_request, workflow_dispatch, etc.)
- Jobs run in parallel by default; steps run sequentially within a job
- `uses:` calls a marketplace action; `run:` executes shell commands
- `$GITHUB_STEP_SUMMARY` writes rich Markdown to the Actions summary tab

### Try It
- **Push trigger:** Push any commit to see the workflow run automatically
- **Manual trigger:** Go to Actions tab → "Demo 1 — Workflows" → "Run workflow"
  - Try different inputs (e.g. change the greeting message)

## Demo 2 — Environments, Secrets & Permissions

**Goal:** Use environments to gate deployments, scope secrets, and apply least-privilege `GITHUB_TOKEN` permissions.

### Setup (one-time, in GitHub UI)
1. **Create environments:** Settings → Environments → create `staging` and `production`
2. **Add protection rule:** On `production`, enable "Required reviewers" and add yourself
3. **Add repo-level secret:** Settings → Secrets → Actions → `REPO_API_KEY` (any dummy value)
4. **Add environment secrets:** In each environment, add `ENV_API_KEY` with a different value

### Key Concepts
- **Environments** gate deployments and scope secrets to specific stages
- **Repo secrets** are available in all jobs; **environment secrets** only in jobs targeting that environment
- `permissions:` at workflow level sets a tight default; jobs can override with only what they need
- `GITHUB_TOKEN` follows least-privilege — start with `contents: read` and add more per job

### Try It
- Push a commit or run manually — staging deploys automatically, production waits for approval
- Create an open issue first so the permission-demo job can post a comment on it
