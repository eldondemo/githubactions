# GitHub Actions Workshop — 7 Demo Script Plan (Progressive, Intro-Friendly)

> Goal: 7 demos that start simple and build real-world complexity without turning into “hello world” or being too long.
> Pattern per demo: **Story → Setup → Highlight 2–4 key concepts → Run → Read logs → Small tweak → Re-run → Takeaways**

---

## Logistics / Suggested Flow
- Keep each demo ~8–12 minutes (plus questions) so you can complete all 7 in a half-day format.
- Use a single repo with branches like `demo-01`, `demo-02`, etc. so students can follow along and you can recover quickly.
- Reuse the same “sample app / sample repo” throughout to reduce context switching.

Repo baseline (used across demos):
- `/src` minimal code (or a small Python app for demo 7)
- `/.github/workflows/` holds all workflows
- `/scripts/` helper scripts (lint/test/build)
- `README.md` with “How to run locally” and links to each demo branch

---

# Demo 1 — Workflows (Triggers, Jobs, Steps, Marketplace Actions)
**Theme:** “Automation isn’t CI/CD yet — it’s an event-driven workflow engine.”

### Outcome
Attendees understand: workflow file location, `on:` triggers, job/step anatomy, and reading logs.

### Setup
- Create `.github/workflows/01-workflows.yml`
- Add simple repo content (README + a small script)

### Script Outline
1. **Show the UI:** Actions tab → “New workflow” → YAML editor
2. **Workflow anatomy:**
   - `name`, `on: [push, workflow_dispatch]`
   - `jobs`, `runs-on`
   - `steps` with `uses` vs `run`
3. **Use 2 marketplace actions (not just echo):**
   - `actions/checkout`
   - a “summary” step writing to `$GITHUB_STEP_SUMMARY`
4. **Run it twice:**
   - push commit to trigger
   - run manual dispatch and compare inputs

### “Small Upgrade” (keeps it meaningful)
- Add a matrix for OS or version (keep it tiny: 2 items)
- Show how it impacts logs and parallel jobs

### Takeaways
- Workflows are YAML + events + jobs + steps
- Marketplace actions are building blocks
- Logs + step summaries make workflows maintainable

---

# Demo 2 — Environments, Secrets, and `GITHUB_TOKEN` Permissions
**Theme:** “Security is a feature: least privilege + controlled deployment.”

### Outcome
Attendees can:
- use repo secrets and environment secrets
- understand basic `permissions:` for `GITHUB_TOKEN`
- see environment protection rules (approval) in action

### Setup
- Create environments: `staging`, `production`
- Add one secret at repo-level and one at environment-level
- Create `.github/workflows/02-env-secrets-permissions.yml`

### Script Outline
1. **Show Settings → Environments**
   - Explain environment secrets + “required reviewers” concept (if enabled)
2. **Workflow uses environments:**
   - job `deploy-staging` → `environment: staging`
   - job `deploy-production` → `environment: production` (with approval gate)
3. **Secrets usage**
   - Use `secrets.MY_API_KEY` as an env var in a step (no printing!)
4. **`GITHUB_TOKEN` permissions**
   - Start with tight permissions, e.g. `contents: read`
   - Attempt a write action (comment on PR or create a release draft) and show failure
   - Add only the needed permission and rerun

### “Small Upgrade”
- Add job-level permission override vs workflow-level default

### Takeaways
- Environments gate deployments and scope secrets (GitHub environment docs)  
- `permissions:` is how you right-size `GITHUB_TOKEN` access  
- Avoid hardcoding secrets; prefer environment protections for production deployments

(Refs: GitHub environment management docs) https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments

---

# Demo 3 — Policies, Sharing Workflows, and Caching
**Theme:** “Scale from one repo to many: standardization + speed.”

### Outcome
Attendees understand:
- why org/repo policies matter conceptually
- how reusable workflows reduce duplication
- how caching speeds up pipelines (intro level)

### Setup
- Create `.github/workflows/03-reuse-cache.yml`
- Create `.github/workflows/_reusable-test.yml` (reusable via `workflow_call`)
- Add a dependency installation step (Python pip or Node npm)

### Script Outline
1. **Policy concept (no deep admin work):**
   - Explain “trusted actions / allowed actions” at org/repo level
   - Talk through what breaks if policy blocks marketplace actions
2. **Reusable workflow**
   - Create `_reusable-test.yml` with `on: workflow_call`
   - Caller workflow invokes it using `uses: owner/repo/.github/workflows/_reusable-test.yml@ref`
3. **Caching**
   - Add `actions/cache` for dependencies
   - Run once (cold cache), then again (cache hit)
   - Show cache key includes lockfile hash

### “Small Upgrade”
- Add inputs to reusable workflow (e.g., python version)
- Show how calling workflow passes inputs

### Takeaways
- Reusable workflows are the simplest form of “internal platform” for CI
- Cache gives fast wins; keep key strategy understandable

(Refs: GitHub reusable workflows docs) https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows

---

# Demo 4 — Custom Actions (JavaScript action + optional Docker action)
**Theme:** “When workflows get messy, package logic as an action.”

### Recommendation on Docker
Docker actions can be **kept optional** to avoid complexity/time. Lead with JS action (fast, cross-platform), then show Docker as “same idea, different packaging.”

### Setup
- Create local action directory: `.github/actions/demo-js-action/`
- Include `action.yml` and a small JS implementation
- Workflow: `.github/workflows/04-custom-actions.yml`

### Script Outline (JS action)
1. **Why custom action?**
   - “We reuse this step everywhere; copy/paste is technical debt.”
2. **Show action interface**
   - inputs: `message`, output: `result`
3. **Implementation**
   - Use `@actions/core` to read input and set output
   - Add `core.notice()` for a nice log annotation
4. **Consume the action**
   - `uses: ./.github/actions/demo-js-action`
   - demonstrate output used in a later step

### Optional Add-on (Docker action, 3-minute peek)
- Show `Dockerfile` + `action.yml` `runs: using: docker`
- Explain tradeoffs at a high level:
  - Pros: pinned toolchain
  - Cons: image build/pull time, Linux-only

### Takeaways
- JS actions are a great “first custom action”
- Composite actions exist too (mention briefly as a stepping stone)

(Refs: Actions toolkit repo) https://github.com/actions/toolkit

---

# Demo 5 — Runners (GitHub-hosted) and Workflow Logs
**Theme:** “Where does this run, and how do I debug it?”

### Outcome
Attendees can:
- choose `runs-on`
- use logs effectively (groups, annotations, summaries)
- use artifacts for debugging

### Setup
- `.github/workflows/05-runners-logs.yml`
- Include failing test or deliberate failure toggle via input

### Script Outline
1. **GitHub-hosted runners overview**
   - `ubuntu-latest` / `windows-latest` / `macos-latest`
2. **Log readability upgrades**
   - group logs (folding)
   - warnings/notice/error annotations
   - `$GITHUB_STEP_SUMMARY`
3. **Artifacts**
   - upload a test report or build output
4. **Debug scenario**
   - intentionally fail a step
   - show rerun failed jobs
   - show how to capture extra state on failure

### “Small Upgrade”
- Add conditional step `if: failure()` to upload logs only when needed

### Takeaways
- Better logs = faster debugging and less fear of CI
- Artifacts are your “black box recorder”

---

# Demo 6 — Actions Runner Controller (ARC) (Concept + Lightweight Demo)
**Theme:** “Self-hosted runners at scale on Kubernetes, without babysitting VMs.”

### Important framing
Keep this one **conceptual and safe** for an intro class:
- show architecture + what problem it solves
- show what the YAML “runs-on: [self-hosted,…]” looks like
- optionally show a sample ARC manifest/helm command (don’t deep-dive install)

### Setup
- `.github/workflows/06-arc.yml` uses `runs-on: [self-hosted, linux, x64]`
- Slides/diagram reference

### Script Outline
1. **Problem statement**
   - cost / network access / custom toolchains / compliance
2. **ARC overview**
   - Kubernetes operator that orchestrates and scales runners
   - ephemeral runners; auto-scale on queue depth
3. **What changes for developers?**
   - `runs-on` labels select runner scale set
4. **Operational talking points (high-level)**
   - runner groups for isolation
   - scaling boundaries (min/max)
   - security boundaries: dedicated namespaces, least privilege

### Takeaways
- ARC is the bridge between GitHub Actions and Kubernetes elasticity
- It’s “self-hosted runners, but managed like cloud infrastructure”

(Refs: GitHub Docs on ARC) https://docs.github.com/en/actions/concepts/runners/actions-runner-controller

---

# Demo 7 — CI/CD with GitHub Actions: Building a Python Application
**Theme:** “Put it all together with a real pipeline (test → build → package → deploy-ish).”

### Outcome
Attendees walk away with a realistic, not-too-long Python CI pipeline:
- lint + unit tests
- caching dependencies
- build artifact
- environment-based “deploy” simulation (or real deploy if appropriate)

### Setup
- Minimal Python app + tests (pytest)
- `.github/workflows/07-python-cicd.yml`
- Include `requirements.txt` or `pyproject.toml`

### Script Outline
1. **CI trigger**
   - `on: pull_request` + `on: push` to `main`
2. **Install + cache**
   - cache pip directory keyed on lock/requirements hash
3. **Quality gates**
   - `ruff`/`flake8` (pick one) + `pytest`
4. **Build artifact**
   - build a wheel or zip the app
   - upload artifact
5. **CD flavor (keep it simple)**
   - job with `environment: staging`
   - simulate deploy: “extract artifact + run smoke test”
   - optional production job with approval gate

### “Small Upgrade”
- Use reusable workflow from Demo 3 for “test” job to reinforce reuse

### Takeaways
- This is the standard pattern teams replicate and scale
- CI/CD is just workflows + environments + permissions + consistent building blocks

---

## Appendix — Consistent Teaching Moves (Use in Every Demo)
- Start each demo by showing the **goal** (“what problem are we solving?”)
- End each demo with **3 takeaways** and a **1-minute Q&A**
- Always show:
  - Where YAML lives
  - Where logs are
  - How to rerun
  - One “tweak and rerun” moment

---

## Branch / File Map (Suggested)
- `demo-01-workflows` → `.github/workflows/01-workflows.yml`
- `demo-02-env-secrets-token` → `.github/workflows/02-env-secrets-permissions.yml`
- `demo-03-reuse-cache` → `.github/workflows/03-reuse-cache.yml` + `._reusable-test.yml`
- `demo-04-custom-actions` → `.github/actions/demo-js-action/*` + workflow
- `demo-05-runners-logs` → workflow + artifact upload
- `demo-06-arc` → workflow + diagram/notes
- `demo-07-python-cicd` → python app + workflow