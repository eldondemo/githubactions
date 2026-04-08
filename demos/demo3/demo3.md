# Demo 3 — Policies, Sharing Workflows, and Caching

**Theme:** "Scale from one repo to many: standardization + speed."

## Goal

Understand reusable workflows, dependency caching, and the concept of org/repo action policies.

## Key Concepts

- **Reusable workflows** (`on: workflow_call`) let you define a job once and call it from multiple workflows
- **Inputs** make reusable workflows flexible (e.g. pass a Node version)
- **`actions/cache`** stores dependencies between runs — keyed on a lockfile hash so the cache auto-invalidates when dependencies change
- **Policies** (talk track): orgs can restrict which marketplace actions are allowed — trusted actions only

## What's in This Demo

| File | Purpose |
|------|---------|
| `.github/workflows/03-reuse-cache.yml` | Caller workflow — invokes the reusable workflow twice |
| `.github/workflows/_reusable-test.yml` | Reusable workflow — install, cache, test |
| `demos/demo3/package.json` | Small Node.js app with a dependency (lodash) |
| `demos/demo3/index.js` | App code |
| `demos/demo3/index.test.js` | Jest tests |

## Workflow Structure

```
03-reuse-cache.yml
    │
    ├── test-node-20  →  _reusable-test.yml (node-version: "20")
    ├── test-node-22  →  _reusable-test.yml (node-version: "22")
    │
    └── summary       →  (runs after both, writes final summary)
```

## Reusable Workflow Pattern

**Define once** (`_reusable-test.yml`):
```yaml
on:
  workflow_call:
    inputs:
      node-version:
        type: string
        default: "20"
```

**Call from anywhere** (`03-reuse-cache.yml`):
```yaml
jobs:
  test:
    uses: ./.github/workflows/_reusable-test.yml
    with:
      node-version: "20"
```

## Caching Pattern

```yaml
- uses: actions/cache@v4
  with:
    path: node_modules
    key: npm-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
    restore-keys: |
      npm-${{ runner.os }}-
```

- **First run:** cache MISS → runs `npm install` → saves to cache
- **Second run:** cache HIT → skips install → much faster

## Try It

1. Push a change to `demos/demo3/` or run manually from the Actions tab
2. Watch both Node 20 and Node 22 jobs run in parallel
3. Check the logs for "❄️ Cache MISS"
4. Run the workflow again — logs should show "⚡ Cache HIT"
5. Check the **Summary** job — it shows test count and cache status **returned from the reusable workflow via outputs**

## Reusable Workflow Outputs

The reusable workflow passes data *back* to the caller using `outputs`:

**In `_reusable-test.yml`:**
```yaml
on:
  workflow_call:
    outputs:
      test-count:
        value: ${{ jobs.test.outputs.test-count }}
      cache-status:
        value: ${{ jobs.test.outputs.cache-status }}
```

**In the caller (`03-reuse-cache.yml`), the summary job reads them:**
```yaml
needs: [test-node-20, test-node-22]
steps:
  - run: |
      echo "Node 20 ran ${{ needs.test-node-20.outputs.test-count }} tests"
      echo "Node 22 ran ${{ needs.test-node-22.outputs.test-count }} tests"
```

This shows the full loop: caller sends **inputs** → reusable workflow returns **outputs**.

## Policy Concepts (Talk Track)

> No setup needed — just explain during the demo:

- Orgs can go to **Settings → Actions → General → Policies** to restrict which actions are allowed
- Options: "Allow all actions", "Allow local actions only", or "Allow select actions"
- If a workflow uses a blocked action, the run **fails immediately** with a clear error
- This is how teams enforce a trusted action allowlist

## Takeaways

1. Reusable workflows are the simplest "internal platform" for CI — define once, call many times
2. Cache gives fast wins; key strategy should be simple and tied to lockfile hashes
3. Org policies control which actions can run — important for security at scale
