# Demo 2 — Environments, Secrets & GITHUB_TOKEN Permissions

**Theme:** "Security is a feature: least privilege + controlled deployment."

## Goal

Use environments to gate deployments, scope secrets, and apply least-privilege `GITHUB_TOKEN` permissions.

## Setup (one-time, in GitHub UI)

1. **Create environments:** Settings → Environments → create `staging` and `production`
2. **Add repo-level secret:** Settings → Secrets and variables → Actions → `REPO_API_KEY` (any dummy value)
3. **Add environment secrets:** In each environment, add `ENV_API_KEY` with a different value per environment

> **Note — Required reviewers (approval gates):** On GitHub Team/Enterprise or personal-account public repos,
> you can also enable **"Required reviewers"** under Deployment protection rules on the production environment.
> This adds a manual approval step before the production job runs. If your org plan doesn't support it,
> the demo still works — production just deploys automatically after staging. Mention the concept during the talk track.

## Key Concepts

- **Environments** gate deployments and scope secrets to specific stages
- **Repo secrets** are available in all jobs; **environment secrets** only in jobs targeting that environment
- `permissions:` at workflow level sets a tight default; jobs can override with only what they need
- **`GITHUB_TOKEN`** — a short-lived token automatically created for every workflow run. It lets your workflow interact with the GitHub API (e.g. post comments, create releases, push code) without needing a personal access token. It expires when the job finishes and its permissions are controlled by the `permissions:` key in your workflow YAML.
- `GITHUB_TOKEN` follows least-privilege — start with `contents: read` and add more per job

## What's in This Demo

| File | Purpose |
|------|---------|
| `.github/workflows/02-env-secrets-permissions.yml` | The workflow |
| `demos/demo2/` | Demo folder (changes here trigger the workflow) |

## Workflow Structure

```
deploy-staging          ← runs immediately, uses staging secrets
    │
    ▼
deploy-production       ← waits for staging to finish, then deploys
                          (+ manual approval if protection rule is enabled)

permission-demo         ← runs in parallel, shows GITHUB_TOKEN override
```

## Try It

- Push a change to `demos/demo2/` or the workflow file
- Run manually from the Actions tab
- Staging deploys first, then production follows automatically
- If you have required reviewers enabled, production will pause for approval
- Create an open issue first so the permission-demo job can post a comment

## "Small Upgrade" — Job-Level Permission Override

The workflow default is `contents: read` only. The `permission-demo` job adds `issues: write` at the job level:

```yaml
permissions:        # workflow level
  contents: read

jobs:
  permission-demo:
    permissions:    # job-level override
      contents: read
      issues: write
```

Without the override, the issue comment step would fail with a 403.

## Takeaways

1. Environments gate deployments and scope secrets
2. `permissions:` is how you right-size `GITHUB_TOKEN` access
3. Avoid hardcoding secrets; prefer environment protections for production deployments
