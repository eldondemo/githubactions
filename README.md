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

## How to Run Locally

1. Clone the repo
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
