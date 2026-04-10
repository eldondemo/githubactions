# Demo Steps — All Demos (GitHub.com + Copilot walkthrough)

> **Format:** For each demo, open the workflow YAML on GitHub, walk through it, make a small edit to trigger the workflow, then show the run in the Actions tab.

---

## Demo 1a — Hello World (the simplest possible workflow)

**Time:** ~5 min

### Talk Track

- A workflow is a YAML file in `.github/workflows/`
- Every workflow needs: `name`, `on` (trigger), and `jobs`
- `run:` executes a shell command on the runner

### Steps

1. **Open the workflow file**
   - Navigate to `.github/workflows/01a-hello-world.yml`
   - Walk through — it's tiny:
     - **`on: push`** with path filter — triggers when files in `demos/demo1a/` change
     - **One job** (`hello`) running on `ubuntu-latest`
     - **Two steps:** `echo "Hello"` and `date -u`
   - Point out: this is the absolute minimum — no checkout, no marketplace actions, just shell commands

2. **Trigger the workflow — make a small edit**
   - Edit `demos/demo1a/demo1a.md` on GitHub (pencil icon)
   - Add a comment like `<!-- demo run -->`
   - Commit directly to `main`

3. **Show the workflow run**
   - Go to the **Actions** tab
   - Click on `Demo 1a — Hello World`
   - Expand the job → show "Hello, GitHub Actions! 🚀" in the logs
   - Point out: that's it — you just automated something with 10 lines of YAML

---

## Demo 1b — Checkout, Scripts & Manual Triggers

**Time:** ~5 min

### Talk Track

- `uses:` calls a pre-built action from the marketplace (vs `run:` which is inline shell)
- Without `actions/checkout`, the runner has an empty workspace — your repo files aren't there
- `workflow_dispatch` adds a "Run workflow" button so you can trigger manually with custom inputs

### Steps

1. **Open the workflow file**
   - Navigate to `.github/workflows/01b-checkout-and-scripts.yml`
   - Walk through:
     - **Triggers:** `push` + `workflow_dispatch` with a `greeting` input
     - **Step 1 — `uses:`**: `actions/checkout@v4` — clones the repo onto the runner
     - **Step 2 — `run:`**: executes `greet.sh` with the input value
   - Highlight the difference: `uses:` = pre-built action, `run:` = shell command

2. **Show the greeting script**
   - Navigate to `demos/demo1b/greet.sh`
   - Point out it's a plain bash script — the workflow just calls it

3. **Trigger manually (workflow_dispatch)**
   - Go to the **Actions** tab → "Demo 1b" → click **"Run workflow"**
   - Type a custom greeting (e.g., the customer's name) → click Run
   - Show the run → expand the greeting step → see the custom message

4. **Key callouts**
   - `actions/checkout@v4` is the most-used action — almost every workflow starts with it
   - `workflow_dispatch` is great for on-demand tasks (deployments, reports, testing)
   - Inputs make manual triggers flexible

---

## Demo 1c — Context Variables, Summaries & Matrix Strategy

**Time:** ~5 min

### Talk Track

- GitHub Actions knows about your repo, branch, actor, and more via `${{ github.* }}`
- `GITHUB_STEP_SUMMARY` lets you write rich Markdown that shows up in the Actions summary tab
- Matrix strategy runs the same job across multiple configurations in parallel

### Steps

1. **Open the workflow file**
   - Navigate to `.github/workflows/01c-summaries-and-matrix.yml`
   - Walk through:
     - **Matrix:** `os: [ubuntu-latest, windows-latest]` — creates two parallel jobs
     - **Step 1:** prints context variables (`github.repository`, `github.actor`, `runner.os`, etc.)
     - **Step 2:** writes a Markdown summary table to `GITHUB_STEP_SUMMARY`

2. **Trigger the workflow — make a small edit**
   - Edit `demos/demo1c/demo1c.md` on GitHub
   - Add a comment like `<!-- demo run -->`
   - Commit directly to `main`

3. **Show the workflow run**
   - Go to the **Actions** tab → click `Demo 1c — Summaries & Matrix`
   - Point out: **two jobs** running in parallel (ubuntu + windows)
   - Expand one → show the context variables printed in the logs
   - Click the **Summary** tab → show the rendered Markdown table

4. **Key callouts**
   - `${{ github.* }}` context is available in every workflow — no setup needed
   - `GITHUB_STEP_SUMMARY` turns workflows into reporting/dashboard tools
   - Matrix strategy = test across OS, language versions, etc. without duplicating jobs

---

## Demo 2 — Environments, Secrets & GITHUB_TOKEN Permissions

**Time:** ~10 min

### Prerequisites (do before the session)

- Create environments: Settings → Environments → `staging` and `production`
- Add repo-level secret: Settings → Secrets → `REPO_API_KEY` (any dummy value)
- Add environment secrets: In each environment, add `ENV_API_KEY` with different values
- Optional: enable "Required reviewers" on `production` for an approval gate
- Create an open issue (so the permission-demo job can post a comment)

### Talk Track

- Environments gate deployments and scope secrets
- `permissions:` controls what `GITHUB_TOKEN` can do — start tight, add only what each job needs
- `GITHUB_TOKEN` is auto-created per run, expires when the job ends — no PATs needed

### Steps

1. **Open the workflow file**
   - Navigate to `.github/workflows/02-env-secrets-permissions.yml`
   - Walk through:
     - **Triggers:** `push` only (no `workflow_dispatch`) — point this out as intentional
     - **`permissions: contents: read`** at workflow level — tight default
     - **Job 1 — deploy-staging:** uses `environment: staging`, reads repo + environment secrets
     - **Job 2 — deploy-production:** `needs: deploy-staging` (runs after staging), uses `environment: production`
     - **Job 3 — permission-demo:** overrides permissions with `issues: write` at job level, posts a comment on an open issue

2. **Show the environments in Settings**
   - Go to Settings → Environments
   - Show `staging` and `production`
   - If you set up required reviewers on production, point that out

3. **Trigger the workflow — make a small edit**
   - Edit `demos/demo2/demo2.md` on GitHub
   - Add a comment line like `<!-- demo run 1 -->`
   - Commit directly to `main`

4. **Show the workflow run**
   - Go to the **Actions** tab
   - Click on the `Demo 2 — Environments, Secrets & Permissions` run
   - Show the **deployment flow:** staging runs first → production waits
   - If required reviewers are enabled: show the approval gate (click "Review deployments")
   - Expand **deploy-staging** → show secret masking (prints `***` not the value) and the fingerprint approach
   - Expand **permission-demo** → show the issue comment step
   - Go to the open issue → show the bot comment posted by `GITHUB_TOKEN`

5. **Key callouts**
   - Secrets are always masked in logs — you can't accidentally leak them
   - Environment secrets are only available to jobs targeting that environment
   - Without `issues: write` on the permission-demo job, the comment step would fail with a 403
   - `needs:` creates job dependencies — production doesn't start until staging succeeds

---

## Demo 3 — Reusable Workflows & Caching

**Time:** ~10 min

### Talk Track

- DRY principle: define a workflow once, call it from multiple places
- `workflow_call` makes a workflow reusable — it accepts inputs and returns outputs
- Caching speeds up builds by skipping redundant installs (e.g., `npm install`)

### Steps

1. **Open the caller workflow**
   - Navigate to `.github/workflows/03-reuse-cache.yml`
   - Walk through:
     - **Triggers:** `push` with path filters + `workflow_dispatch`
     - **Two jobs calling the same reusable workflow** with different inputs:
       - `test-node-20` → calls `_reusable-test.yml` with `node-version: "20"`
       - `test-node-22` → calls `_reusable-test.yml` with `node-version: "22"`
     - **Summary job:** `needs: [test-node-20, test-node-22]` — runs after both, reads their outputs

2. **Open the reusable workflow**
   - Navigate to `.github/workflows/_reusable-test.yml`
   - Walk through:
     - **`on: workflow_call`** — this is what makes it reusable (not push, not dispatch)
     - **`inputs:`** — `node-version` and `working-directory`
     - **`outputs:`** — `test-count` and `cache-status` passed back to the caller
     - **Cache step:** `actions/cache@v4` keyed on `package-lock.json` hash
     - **Conditional install:** `if: steps.cache-npm.outputs.cache-hit != 'true'` — skips `npm install` on cache hit
     - **Test step:** runs `jest`, captures test count into `GITHUB_OUTPUT`

3. **Show the Node.js demo app**
   - Navigate to `demos/demo3/` — show `index.js` (simple capitalize function) and `index.test.js` (Jest tests)

4. **Trigger the workflow — make a small edit**
   - Edit `demos/demo3/index.test.js` on GitHub
   - Add a comment line like `// demo run 1`
   - Commit directly to `main`

5. **Show the workflow run**
   - Go to the **Actions** tab
   - Click on `Demo 3 — Reuse & Cache`
   - Show **two parallel test jobs** (Node 20 and Node 22)
   - Expand one → show the cache step: should say "Cache MISS" on first run
   - Click the **Summary** tab → show the table with test counts and cache status

6. **(Optional) Run it again for cache hit**
   - Make another trivial edit to `demos/demo3/index.test.js`
   - Push again → this time the cache step should say "Cache HIT" and skip `npm install`
   - Compare run times — second run should be faster

7. **Key callouts**
   - Reusable workflows are the "internal platform" pattern — define once, call many times
   - Outputs let callers use data from the reusable workflow (test counts, status, etc.)
   - Cache key includes the lockfile hash — any dependency change busts the cache automatically
   - Mention org-level policies: admins can restrict which actions/reusable workflows are allowed

---

## Demo 4 — Custom Actions (JavaScript + Composite)

**Time:** ~10 min

### Talk Track

- When marketplace actions don't fit, you can build your own
- Two main types: **JavaScript** (full Node.js, `@actions/core`) and **Composite** (pure YAML, no code)
- Both use `action.yml` to define inputs, outputs, and what runs

### Steps

1. **Open the workflow file**
   - Navigate to `.github/workflows/04-custom-actions.yml`
   - Walk through:
     - **Job 1 — js-action:** calls `./.github/actions/demo-js-action` with `message` and `uppercase` inputs, uses the output
     - **Job 2 — composite-action:** calls `./.github/actions/demo-composite-action` with `name` and `run-tests` inputs
     - **Job 3 — summary:** compares JS vs Composite vs Docker action types

2. **Open the JavaScript action**
   - Navigate to `.github/actions/demo-js-action/action.yml`
   - Show: `using: "node20"`, `main: "index.js"`, inputs (`message`, `uppercase`), output (`result`)
   - Open `.github/actions/demo-js-action/index.js`
   - Point out: uses `@actions/core` for `getInput()`, `setOutput()`, `info()`, `warning()`

3. **Open the Composite action**
   - Navigate to `.github/actions/demo-composite-action/action.yml`
   - Show: `using: "composite"`, steps are plain YAML with `shell: bash`
   - Point out: no code, no `node_modules`, just shell steps — easy to get started

4. **Compare the two side by side**
   - JS: full Node.js power, native annotations/summaries, cross-platform
   - Composite: zero build, just YAML, but limited to shell commands

5. **Trigger the workflow — make a small edit**
   - Edit `demos/demo4/demo4.md` on GitHub
   - Add a comment line like `<!-- demo run 1 -->`
   - Commit directly to `main`

6. **Show the workflow run**
   - Go to the **Actions** tab
   - Click on `Demo 4 — Custom Actions`
   - Expand **js-action** job → show:
     - The action running twice (normal + uppercase)
     - The output values printed in the "Compare outputs" step
   - Expand **composite-action** job → show the report output
   - Click the **Summary** tab → show the comparison table

7. **Key callouts**
   - `uses: ./.github/actions/<folder>` references a local action (no need to publish)
   - JS actions need `node_modules` committed or bundled (use `@vercel/ncc` to bundle)
   - Composite actions are great for wrapping a sequence of shell steps into a reusable unit
   - Docker actions (Demo 4b) are a third option — any language, pinned toolchain, but Linux-only

---

## Demo 4b — Custom Docker Action

**Time:** ~5 min

### Talk Track

- Docker actions are the third type of custom action — alongside JavaScript and Composite
- They package a Dockerfile + entrypoint script, giving you a fully controlled toolchain
- Inputs arrive as `INPUT_<NAME>` environment variables; outputs use `$GITHUB_OUTPUT` (same as always)
- Tradeoff: Docker build overhead on every run, and Linux-only

### Steps

1. **Open the workflow file**
   - Navigate to `.github/workflows/04b-docker-action.yml`
   - Walk through:
     - Calls `./.github/actions/demo-docker-action` with a `name` input
     - Uses the output in a later step

2. **Open the Docker action files**
   - Navigate to `.github/actions/demo-docker-action/action.yml`
   - Show: `runs: using: "docker"`, `image: "Dockerfile"` — this tells GitHub to build the image
   - Open `Dockerfile` — simple Alpine image that copies and runs `entrypoint.sh`
   - Open `entrypoint.sh` — reads `INPUT_NAME` from the environment, writes output via `$GITHUB_OUTPUT`

3. **Trigger the workflow — make a small edit**
   - Edit `demos/demo4b/demo4b.md` on GitHub
   - Add a comment like `<!-- demo run 1 -->`
   - Commit directly to `main`

4. **Show the workflow run**
   - Go to the **Actions** tab → click `Demo 4b — Docker Action`
   - Expand the job logs → find the **"Build container"** step — this is the Docker build overhead
   - Show the action output with the greeting
   - Compare the total run time to the JS action from Demo 4

5. **Key callouts**
   - Docker build happens every run — visible overhead in the logs
   - Inputs are automatically mapped to `INPUT_<NAME>` (uppercased)
   - Docker actions only work on Linux runners
   - Use cases: pinned toolchains, non-Node languages (Python, Go, Rust), licensed CLIs

---

## Demo 5 — Runners (GitHub-hosted) and Workflow Logs

**Time:** ~10 min

### Talk Track

- `runs-on:` selects the runner — GitHub provides Ubuntu, Windows, and macOS
- Workflow commands (`::group::`, `::notice::`, `::warning::`, `::error::`) make logs readable
- `$GITHUB_STEP_SUMMARY` turns your workflow into a reporting tool
- Artifacts persist files after the run — test reports, build outputs, debug info
- `if: failure()` captures debug state only when something breaks

### Steps

1. **Open the workflow file**
   - Navigate to `.github/workflows/05-runners-logs.yml`
   - Walk through:
     - **Job 1 — explore-runner:** log groups, annotations, runner hardware details
     - **Job 2 — multi-os:** matrix with `ubuntu-latest` + `windows-latest`
     - **Job 3 — test-and-artifacts:** runs tests, uploads report artifact; on failure, captures debug info

2. **Show the test report script**
   - Navigate to `demos/demo5/generate-report.sh`
   - Point out it can run in pass or fail mode

3. **Trigger a passing run**
   - Edit `demos/demo5/demo5.md` on GitHub → add `<!-- demo run -->` → commit
   - Show the run:
     - Expand **explore-runner** → show foldable log groups and colored annotations
     - Click the **Summary** tab → show the rendered Markdown table
     - Show the **Artifacts** section → download `test-report`

4. **(Optional) Trigger a failing run**
   - Run manually with `should-fail: true`
   - Show: `if: failure()` steps run, debug-info artifact is uploaded
   - Download both artifacts and compare

5. **Show "Re-run failed jobs"**
   - After a failure, click **"Re-run failed jobs"** — only the failed job reruns

6. **Key callouts**
   - Log groups create foldable sections — great for noisy output
   - Annotations show as colored bars and can link to specific files/lines
   - Artifacts are your "black box recorder" — always upload test results
   - `if: failure()` avoids wasting time on debug capture during passing runs

---

## Demo 6 — Actions Runner Controller (ARC)

**Time:** ~10 min | **Note:** This is primarily a talk-track demo — ARC requires a Kubernetes cluster

### Talk Track

- GitHub-hosted runners cover most use cases, but sometimes you need private network access, custom toolchains, compliance, or cost control at scale
- ARC (Actions Runner Controller) is a Kubernetes operator that manages ephemeral runner pods
- From the workflow author's perspective, the only change is the `runs-on:` label
- Everything else — checkout, caching, artifacts, secrets — works identically

### Steps

1. **Open the workflow file**
   - Navigate to `.github/workflows/06-arc.yml`
   - Walk through:
     - **`workflow_dispatch`** with an input to choose the runner label
     - **`self-hosted-job`** — targets `runs-on: arc-runners`, logs runner info, writes a step summary
     - **`github-hosted-job`** — same steps on `ubuntu-latest` for comparison
   - Highlight: the steps are identical, only `runs-on` differs

2. **Show the ARC architecture (talk track with diagram)**
   - Explain the flow: workflow queues job → ARC controller sees queued job → scales up a runner pod → pod picks up the job → completes → pod is destroyed
   - Key point: the cluster reaches *out* to GitHub (no inbound firewall rules)
   - Ephemeral = clean environment every time

3. **Show the installation overview**
   - Two Helm commands: one for the controller, one for a runner scale set
   - `minRunners: 0` means no cost when idle; `maxRunners` caps resources
   - Point out: GitHub App auth is preferred over PATs for production

4. **Run the github-hosted-job for comparison**
   - From the Actions tab → **"Run workflow"** → use `ubuntu-latest`
   - Show the run — same steps, same output as if it were on ARC

5. **Key callouts**
   - Self-hosted runners solve: private networks, custom tools, compliance, cost at scale
   - ARC automates the lifecycle — no VMs to babysit
   - Ephemeral runners = no leftover state between jobs
   - Runner groups let you organize by team, environment, or workload

---

## Demo 7 — Full Python CI/CD Pipeline

**Time:** ~10 min

### Talk Track

- This demo ties everything together: triggers, caching, matrix, environments, artifacts, and step summaries
- It's the pattern teams replicate and scale — lint → test → build → deploy through environments
- "Build once, deploy many" — the same artifact flows from staging to production with no rebuild

### Prerequisites (do before the session)

- Create environments: Settings → Environments → `staging` and `production` (if not done in Demo 2)
- Optional: enable "Required reviewers" on `production` for an approval gate

### Steps

1. **Open the workflow file**
   - Navigate to `.github/workflows/07-python-cicd.yml`
   - Walk through the 5-stage pipeline:
     - **Lint** — Ruff linter + formatter check (fast feedback)
     - **Test** — Matrix: Python 3.11 + 3.12 in parallel, pytest with JUnit XML output, pip caching
     - **Build** — `needs: [lint, test]`, packages app + metadata, uploads artifact
     - **Deploy Staging** — `environment: staging`, downloads artifact, simulates deployment
     - **Deploy Production** — `environment: production`, same artifact, approval gate (if configured)

2. **Show the app code**
   - Navigate to `demos/demo7/app.py` — simple math functions
   - Navigate to `demos/demo7/test_app.py` — pytest tests
   - Navigate to `demos/demo7/requirements.txt` — dependencies

3. **Point out concepts from previous demos**
   - Path-filtered triggers (Demo 1)
   - Environments + approval gates (Demo 2)
   - Caching (Demo 3)
   - Artifacts (Demo 5)
   - Step summaries (Demo 5)

4. **Trigger the workflow — make a small edit**
   - Edit `demos/demo7/app.py` on GitHub → add a comment → commit
   - Or run manually from the Actions tab

5. **Show the workflow run**
   - Go to the **Actions** tab → click `Demo 7 — Python CI/CD`
   - Show lint and test jobs running in parallel
   - After they pass, build runs → uploads artifact
   - Staging deploys automatically
   - Production waits for approval (if configured) — click "Review deployments" to approve
   - Click **Summary** → show the status cards each job writes

6. **Download the test artifacts**
   - Show the test-results artifacts (one per Python version)
   - Open the JUnit XML — point out this integrates with CI dashboards in real projects

7. **Key callouts**
   - This is the standard CI/CD pattern — everything before this was a building block
   - Build once, deploy many — no rebuild between environments
   - If any gate fails (lint, test), downstream jobs are skipped automatically
   - The same workflow handles both push and pull_request triggers

---

## Demo 8 — Using GitHub Copilot to Create a Workflow (from scratch)

**Time:** ~15 min | **Tool:** VS Code + Copilot Chat (ask mode)

> **Format:** This demo is different — instead of walking through pre-written YAML, you ask Copilot Chat to generate the workflow live. Start with a simple prompt, then iterate with 3 follow-ups to add complexity. The audience watches the YAML get built in real-time.

### Prerequisites

- VS Code open with the repo
- Copilot Chat panel open (ask mode)
- `demos/demo8/` folder already exists with `package.json`, `index.js`, `index.test.js`, `.eslintrc.js`
- No workflow file exists yet — you create it live

---

### Step 1 — Basic CI (bare minimum)

**Copilot Chat prompt:**
> _"Create a GitHub Actions workflow file called 08-copilot-ci.yml that runs on push to main. It should checkout the code, install Node.js 20, run npm install, and run npm test. The working directory is demos/demo8."_

**What to show:**
1. Paste the prompt into Copilot Chat
2. Copilot generates a clean workflow: `on: push`, one job, 4 steps
3. Accept the suggestion → file is created at `.github/workflows/08-copilot-ci.yml`
4. Walk through the generated YAML briefly:
   - "This is the same structure we saw in Demos 1a and 1b — trigger, job, steps"
   - Point out `actions/checkout@v4`, `actions/setup-node@v4`, `npm install`, `npm test`

**Callout:** _"One sentence describing what you want → a working workflow. You don't need to memorize YAML syntax."_

---

### Step 2 — Add linting before tests

**Copilot Chat prompt:**
> _"Add a linting step that runs npm run lint before the test step."_

**What to show:**
1. Copilot inserts an `npm run lint` step between install and test
2. Point out the step ordering: lint runs first, and if it fails, tests don't run (steps are sequential)
3. Accept the change

**Callout:** _"Copilot keeps context from the previous prompt — it knows what workflow we're editing."_

---

### Step 3 — Add dependency caching

**Copilot Chat prompt:**
> _"Add npm dependency caching using actions/cache so npm install is skipped when package-lock.json hasn't changed."_

**What to show:**
1. Copilot adds `actions/cache@v4` with:
   - `path: demos/demo8/node_modules`
   - `key` using `hashFiles('**/package-lock.json')`
2. May also add a conditional on the install step (`if: steps.cache.outputs.cache-hit != 'true'`)
3. Accept the change
4. Point out: "This is the exact same caching pattern we walked through in Demo 3 — Copilot knows the best practice"

**Callout:** _"Copilot isn't just autocompleting — it's applying the same patterns the community uses."_

---

### Step 4 — Add matrix strategy for multiple Node versions

**Copilot Chat prompt:**
> _"Run this workflow on both Node 20 and Node 22 using a matrix strategy."_

**What to show:**
1. Copilot adds `strategy.matrix.node-version: [20, 22]` and parameterizes the `setup-node` step
2. The job name may update to include the matrix variable
3. Accept the change
4. Point out: two parallel jobs will run — same concept from Demo 1c, generated from one sentence

**Callout:** _"Four prompts, and we have a production-quality CI pipeline with linting, caching, and multi-version testing."_

---

### Wrap-up — Push and watch it run

1. **Review the final workflow** — scroll through the complete YAML one more time
2. **Commit and push** from VS Code terminal:
   ```
   git add .github/workflows/08-copilot-ci.yml demos/demo8/
   git commit -m "Demo 8: Copilot-generated CI workflow"
   git push
   ```
3. **Switch to GitHub.com** → Actions tab → watch `Demo 8` trigger
4. Show: two matrix jobs (Node 20 + Node 22), lint step, cache step, tests passing

**Final callout:** _"We went from zero to a multi-version CI pipeline in 4 prompts. Copilot doesn't replace understanding — that's why we did Demos 1–4 first — but it dramatically speeds up the creation process."_

---

## Demo 9 — Service Containers (PostgreSQL sidecar for integration tests)

**Time:** ~10 min

### Talk Track

- Sometimes unit tests aren't enough — you need a real database, cache, or message queue
- GitHub Actions can spin up Docker containers alongside your job using `services:`
- Health checks ensure the service is ready before your tests start
- The containers are ephemeral — created fresh per job, torn down automatically

### Steps

1. **Open the workflow file**
   - Navigate to `.github/workflows/09-service-containers.yml`
   - Walk through:
     - **Triggers:** `push` with path filter (`demos/demo9/**`) + `workflow_dispatch`
     - **`services:` block:** spins up `postgres:16` as a sidecar container
     - **`env:` on the container:** `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` — Postgres uses these to create the database on startup
     - **`ports: 5432:5432`** — maps container port to the runner's `localhost`
     - **`options:` with health check** — `pg_isready` runs every 10 seconds until Postgres is accepting connections
     - **Job-level `env:`** — connection config (`PGHOST`, `PGPORT`, etc.) passed to the test process
     - **Steps:** checkout → setup Node 20 → npm install → npm test

2. **Show the app code**
   - Navigate to `demos/demo9/index.js`
   - Walk through: simple user CRUD module using the `pg` library — `addUser`, `getUser`, `listUsers`, `deleteUser`
   - Point out: the code connects to `localhost:5432` — it doesn't know it's in CI

3. **Show the tests**
   - Navigate to `demos/demo9/index.test.js`
   - Walk through: `beforeAll` creates the table, `beforeEach` truncates it, tests run CRUD operations against real Postgres
   - Highlight: these are *integration tests* — no mocking, real SQL, real constraints (duplicate email rejection)

4. **Trigger the workflow — make a small edit**
   - Edit `demos/demo9/demo9.md` on GitHub
   - Add a comment like `<!-- demo run 1 -->`
   - Commit directly to `main`

5. **Show the workflow run**
   - Go to the **Actions** tab → click `Service Containers`
   - Show the **Initialize containers** step — Postgres image is pulled and started
   - Show the health check passing in the logs
   - Expand the **npm test** step → show all 4 tests passing against real Postgres
   - Show the **Stop containers** step at the end — automatic cleanup

6. **Key callouts**
   - `services:` works with any Docker image — Postgres, MySQL, Redis, RabbitMQ, etc.
   - Health checks prevent the "connection refused" flakiness you'd get without them
   - No external database needed — everything runs inside the GitHub Actions runner
   - The same pattern works for multi-service setups (e.g., app + database + cache)
