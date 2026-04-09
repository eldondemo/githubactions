# Demo 1c — Context Variables, Summaries & Matrix Strategy

**Theme:** "GitHub Actions knows about your repo — and can run the same job on multiple platforms at once."

## Goal

Use `${{ github.* }}` context to access run metadata, write rich Markdown summaries, and run across multiple OS configurations with a matrix.

## Key Concepts

- **Context variables** like `${{ github.repository }}`, `${{ github.actor }}`, `${{ runner.os }}` give you metadata about the current run
- **`GITHUB_STEP_SUMMARY`** — append Markdown to this special file and it renders in the Actions summary tab (great for reports and dashboards)
- **Matrix strategy** — run the same job multiple times with different configurations (e.g., OS, language version). Each combination becomes a separate parallel job.

## What's in This Demo

| File | Purpose |
|------|---------|
| `.github/workflows/01c-summaries-and-matrix.yml` | The workflow |
| `demos/demo1c/` | Demo folder (changes here trigger the workflow) |

## Workflow Structure

```
info (ubuntu-latest)     ← prints context + writes summary
info (windows-latest)    ← same job, different OS — runs in parallel
```

## Try It

- Push a change to `demos/demo1c/` or run manually from the Actions tab
- Check the Actions tab: you'll see **two jobs** (one per OS)
- Click the **Summary** tab to see the Markdown table rendered

## Takeaways

1. `${{ github.* }}` and `${{ runner.* }}` give you rich metadata about every run
2. `GITHUB_STEP_SUMMARY` turns your workflow into a reporting tool
3. Matrix strategy runs the same job across multiple configurations in parallel
