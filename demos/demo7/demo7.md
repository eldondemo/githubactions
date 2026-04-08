# Demo 7 — CI/CD with GitHub Actions: Building a Python Application

**Theme:** "Put it all together with a real pipeline (test → build → package → deploy-ish)."

## Goal

Walk through a realistic CI/CD pipeline that ties together concepts from every previous demo: triggers, caching, environments, secrets, artifacts, and step summaries.

## Key Concepts

- **CI triggers** — `on: push` + `on: pull_request` with path filters so the pipeline only runs when relevant code changes
- **Caching** — `actions/cache` for pip dependencies keyed on `requirements.txt` hash (from Demo 3)
- **Quality gates** — Ruff linter + Pytest must both pass before building
- **Matrix testing** — Run tests against Python 3.11 and 3.12 in parallel
- **Build artifacts** — Package the app with metadata and upload via `actions/upload-artifact` (from Demo 5)
- **Environment-based deployment** — Staging and production environments with approval gates (from Demo 2)
- **Build once, deploy many** — The same artifact flows from build → staging → production

## What's in This Demo

| File | Purpose |
|------|---------|
| `.github/workflows/07-python-cicd.yml` | Full CI/CD pipeline — lint, test, build, deploy |
| `demos/demo7/app.py` | Minimal Python math service |
| `demos/demo7/test_app.py` | Pytest tests for the app |
| `demos/demo7/requirements.txt` | Python dependencies (pytest, ruff) |

## Pipeline Structure

```
                    ┌─────────┐     ┌─────────────────┐
                    │  Lint   │     │  Test (3.11)     │
  push / PR ──────►│  (Ruff) │     │  Test (3.12)     │   (parallel)
                    └────┬────┘     └────────┬────────┘
                         │                   │
                         └───────┬───────────┘
                                 ▼
                          ┌──────────────┐
                          │    Build     │
                          │  (artifact)  │
                          └──────┬───────┘
                                 ▼
                        ┌────────────────┐
                        │  Deploy →      │
                        │  Staging       │
                        └────────┬───────┘
                                 ▼
                        ┌────────────────┐
                        │  Deploy →      │  ← approval gate
                        │  Production    │
                        └────────────────┘
```

## Job-by-Job Walkthrough

### 1. Lint (Ruff)

Runs the Ruff linter and formatter check:
```yaml
- run: ruff check . --output-format=text
- run: ruff format --check .
```
Fast feedback — catches style issues before tests even run.

### 2. Test (Matrix)

Tests against Python 3.11 and 3.12 in parallel:
```yaml
strategy:
  matrix:
    python-version: ["3.11", "3.12"]
```
- Caches pip to avoid re-downloading on every run
- Generates JUnit XML + text output
- Uploads test results as artifacts (downloadable per version)

### 3. Build

Only runs after lint + test both pass (`needs: [lint, test]`):
- Packages `app.py` + `requirements.txt`
- Stamps a `BUILD_INFO.txt` with commit SHA, branch, run number
- Uploads the build artifact with a 5-day retention

### 4. Deploy → Staging

Uses `environment: staging`:
- Downloads the build artifact 
- Verifies contents
- Simulates deployment + smoke test (runs the app)

### 5. Deploy → Production

Uses `environment: production`:
- Same artifact that passed staging
- If you've configured required reviewers on the `production` environment, this job pauses for approval
- Demonstrates "build once, deploy many" — no rebuild between environments

## Concepts from Previous Demos

| Concept | Source Demo | Used Here |
|---------|------------|-----------|
| Triggers & path filters | Demo 1 | `on: push`, `on: pull_request` with `paths:` |
| Environments & approval | Demo 2 | `environment: staging`, `environment: production` |
| Caching | Demo 3 | `actions/cache` for pip |
| Artifacts | Demo 5 | Upload test results + build package |
| Step summaries | Demo 5 | Each job writes to `$GITHUB_STEP_SUMMARY` |
| Log groups | Demo 5 | `::group::` for organized output |

## Try It

1. **Push a change** to `demos/demo7/` or run manually from the Actions tab
2. Watch lint and test jobs run in parallel
3. After they pass, the build job creates and uploads the artifact
4. Staging deploys automatically; production waits for approval (if configured)
5. Download the **test-results** artifacts to see JUnit XML output
6. Check the **Summary** tab — each job writes a status card

## "Small Upgrade" — Add a Failing Test

Edit `test_app.py` and add a test that fails:

```python
def test_intentional_failure(self):
    assert add(1, 1) == 3  # This will fail!
```

Push and watch:
- Test job fails with clear output
- Build and deploy jobs are **skipped** (they depend on test)
- Test artifacts are still uploaded (`if: always()`) so you can debug

## Setup: Environments (Optional but Recommended)

To see the full deployment flow with approval gates:

1. Go to **Settings → Environments**
2. Create `staging` (no protection rules)
3. Create `production` with **Required reviewers** enabled
4. Run the workflow — production will pause and wait for approval

## Takeaways

1. This is the standard pattern teams replicate and scale — lint, test, build, deploy through environments
2. CI/CD is just workflows + environments + permissions + consistent building blocks from the previous demos
3. Build once, deploy many — the same artifact flows from staging to production with no rebuild
