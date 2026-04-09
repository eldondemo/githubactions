# Demo 1b — Checkout, Scripts & Manual Triggers

**Theme:** "Your workflow can use files from your repo — and you can trigger it manually."

## Goal

Learn the difference between `uses:` (marketplace action) and `run:` (shell command), and see how `workflow_dispatch` enables manual triggers with inputs.

## Key Concepts

- **`uses:`** calls a pre-built action from the marketplace (e.g., `actions/checkout@v4`)
- **`run:`** executes a shell command directly on the runner
- Without `actions/checkout`, the runner has an empty workspace — your repo files aren't there
- **`workflow_dispatch`** adds a "Run workflow" button to the Actions tab so you can trigger a workflow manually without pushing code. You can define custom inputs (e.g., a greeting message) that the user fills in before running.

## What's in This Demo

| File | Purpose |
|------|---------|
| `.github/workflows/01b-checkout-and-scripts.yml` | The workflow |
| `demos/demo1b/greet.sh` | Script called by the workflow |

## Try It

- **Push trigger:** Edit `demos/demo1b/greet.sh` and push to `main`
- **Manual trigger:** Actions tab → "Demo 1b" → "Run workflow" → type a custom greeting

## Takeaways

1. `uses:` = reusable action from the marketplace; `run:` = inline shell command
2. `actions/checkout@v4` clones your repo so scripts and files are available
3. `workflow_dispatch` lets you run a workflow on demand with custom inputs
