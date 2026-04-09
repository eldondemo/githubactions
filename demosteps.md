# Demo Steps — Demos 1–4 (GitHub.com walkthrough)

> **Format:** For each demo, open the workflow YAML on GitHub, walk through it, make a small edit to trigger the workflow, then show the run in the Actions tab.

---

## Demo 1 — Workflows (Triggers, Jobs, Steps, Marketplace Actions)

**Time:** ~10 min

### Talk Track

- A workflow is a YAML file in `.github/workflows/`
- Every workflow has: `name`, `on` (trigger), and `jobs`
- Each job has `steps` — either `uses:` (marketplace action) or `run:` (shell command)

### Steps

1. **Open the workflow file**
   - Navigate to `.github/workflows/01-workflows.yml`
   - Walk through the structure top to bottom:
     - **Triggers:** `push` to `main` with path filters + `workflow_dispatch` with a `greeting` input
     - **Matrix strategy:** runs on both `ubuntu-latest` and `windows-latest`
     - **Step 1 — `uses:`**: `actions/checkout@v4` (marketplace action)
     - **Step 2 — `run:`**: executes `greet.sh` (shell command)
     - **Step 3:** prints environment details using `${{ github }}` context
     - **Step 4:** writes a job summary using `GITHUB_STEP_SUMMARY`

2. **Show the greeting script**
   - Navigate to `demos/demo1/greet.sh`
   - Point out it's a plain bash script — nothing special

3. **Trigger the workflow — make a small edit**
   - Edit `demos/demo1/greet.sh` on GitHub (pencil icon)
   - Change the greeting, e.g. `"Hello, ${NAME}! 👋"` → `"Hey there, ${NAME}! 🎉"`
   - Commit directly to `main`

4. **Show the workflow run**
   - Go to the **Actions** tab
   - Click on the `Demo 1 — Workflows` run that just triggered
   - Point out: **two jobs** running (one per matrix OS)
   - Expand a job → walk through the step logs
   - Click the **Summary** tab → show the `GITHUB_STEP_SUMMARY` markdown table

5. **Key callouts**
   - `uses:` = reusable action from the marketplace (or a local path)
   - `run:` = inline shell command
   - Matrix strategy runs the same job across multiple configurations
   - `GITHUB_STEP_SUMMARY` gives you rich markdown output in the run summary

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
