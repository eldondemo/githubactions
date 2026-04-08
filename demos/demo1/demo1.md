# Demo 1 — Workflows (Triggers, Jobs, Steps, Marketplace Actions)

**Theme:** "Automation isn't CI/CD yet — it's an event-driven workflow engine."

## Goal

Understand workflow file location, `on:` triggers, job/step anatomy, and how to read logs.

## Key Concepts

- Workflows live in `.github/workflows/`
- `on:` defines **when** a workflow runs (push, pull_request, workflow_dispatch, etc.)
- Jobs run in parallel by default; steps run sequentially within a job
- `uses:` calls a marketplace action; `run:` executes shell commands
- `$GITHUB_STEP_SUMMARY` writes rich Markdown to the Actions summary tab

## Workflow Anatomy

```yaml
name: "..."              # Display name in the Actions tab
on: [push, ...]          # Triggers — when does this run?
jobs:
  my-job:
    runs-on: ubuntu-latest   # Which runner?
    steps:
      - uses: actions/checkout@v4   # Marketplace action
      - run: echo "Hello"           # Shell command
```

## What's in This Demo

| File | Purpose |
|------|---------|
| `.github/workflows/01-workflows.yml` | The workflow |
| `demos/demo1/greet.sh` | Simple script called by the workflow |

## Try It

- **Push trigger:** Push a change to `demos/demo1/` or the workflow file
- **Manual trigger:** Actions tab → "Demo 1 — Workflows" → "Run workflow"
  - Try different inputs (e.g. change the greeting message)

## "Small Upgrade" — Matrix Strategy

The workflow uses a matrix to run on both `ubuntu-latest` and `windows-latest`:

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
```

This creates **two parallel jobs** — check the Actions logs to see them side by side.

## Takeaways

1. Workflows are YAML + events + jobs + steps
2. Marketplace actions (`uses:`) are reusable building blocks
3. Logs + step summaries make workflows maintainable
