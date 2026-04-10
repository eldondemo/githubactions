# Demo 8 — Using GitHub Copilot to Create a Workflow

**Theme:** "From zero to production CI in four prompts."

## Goal

Show how GitHub Copilot Chat can generate and iteratively refine a GitHub Actions workflow — applying the same best practices from earlier demos without memorizing YAML syntax.

## Key Concepts

- **Copilot Chat (ask mode)** generates workflows from natural language descriptions
- **Iterative refinement** — each follow-up prompt builds on the previous context
- **Best practices for free** — Copilot applies community patterns (caching, matrix, linting) automatically

## What's in This Demo

| File | Purpose |
|------|---------|
| `.github/workflows/08-copilot-ci.yml` | The workflow — built live via Copilot Chat |
| `demos/demo8/index.js` | Simple Node.js app using lodash |
| `demos/demo8/index.test.js` | Jest tests |
| `demos/demo8/package.json` | Dependencies: lodash, jest, eslint |

## Workflow Structure (final result after 4 prompts)

```
test (matrix: node 20 + 22)
    │
    ├── actions/checkout@v4
    ├── actions/setup-node@v4      ← parameterized by matrix
    ├── actions/cache@v4           ← keyed on package-lock.json + node version
    ├── npm install
    ├── npm run lint               ← added in prompt 2
    └── npm test
```

## The Four Prompts

### Prompt 1 — Basic CI
> "Create a GitHub Actions workflow file called 08-copilot-ci.yml that runs on push to main. It should checkout the code, install Node.js 20, run npm install, and run npm test. The working directory is demos/demo8."

Result: a working workflow with trigger, one job, four steps.

### Prompt 2 — Add linting
> "Add a linting step that runs npm run lint before the test step."

Result: `npm run lint` inserted between install and test.

### Prompt 3 — Add caching
> "Add npm dependency caching using actions/cache so npm install is skipped when package-lock.json hasn't changed."

Result: `actions/cache@v4` with hash-based key — same pattern as Demo 3.

### Prompt 4 — Matrix strategy
> "Run this workflow on both Node 20 and Node 22 using a matrix strategy."

Result: `strategy.matrix.node-version: [20, 22]` — two parallel jobs, same concept as Demo 1c.

## Try It

1. Open VS Code with Copilot Chat in ask mode
2. Walk through the four prompts one at a time, accepting each change
3. Review the final YAML — it should match what Demos 1–3 taught manually
4. Commit and push → switch to GitHub Actions tab → watch both matrix jobs run

## Takeaways

1. Copilot applies community best practices — caching keys, matrix syntax, step ordering
2. Iterative prompting lets you build complexity gradually instead of writing everything at once
3. Understanding the concepts (Demos 1–7) means you can verify and refine what Copilot generates
4. Four sentences produced a production-quality multi-version, cached, linted CI pipeline
