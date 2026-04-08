# Demo 5 — Runners (GitHub-hosted) and Workflow Logs

**Theme:** "Where does this run, and how do I debug it?"

## Goal

Choose the right runner, use log features effectively, upload artifacts, and debug failed workflows.

## Key Concepts

- **`runs-on:`** selects the runner — `ubuntu-latest`, `windows-latest`, `macos-latest`
- **Log groups** (`::group::` / `::endgroup::`) create foldable sections in the Actions UI
- **Annotations** (`::notice::`, `::warning::`, `::error::`) highlight important info with colored bars
- **`$GITHUB_STEP_SUMMARY`** writes Markdown to the run's Summary tab
- **Artifacts** (`actions/upload-artifact`) persist files after the run (test reports, logs, build output)
- **`if: failure()`** runs a step only when something failed — perfect for capturing debug state

## What's in This Demo

| File | Purpose |
|------|---------|
| `.github/workflows/05-runners-logs.yml` | The workflow — 3 jobs covering runners, logs, and artifacts |
| `demos/demo5/generate-report.sh` | Script that generates a test report (pass or fail mode) |

## Workflow Structure

```
explore-runner         ← Log groups, annotations, runner details (ubuntu)

multi-os               ← Matrix: ubuntu + windows side-by-side

test-and-artifacts     ← Run tests, upload report artifact
                         If fail → capture debug info + upload debug artifact
```

## Log Features Demonstrated

### Log Groups (foldable)
```bash
echo "::group::🖥️ Runner Hardware"
echo "CPUs: $(nproc)"
echo "::endgroup::"
```
Creates a collapsible section in the log viewer.

### Annotations
```bash
echo "::notice file=path/to/file.sh,line=5::This is an info annotation"
echo "::warning::This is a warning"
echo "::error::This is an error"
```
These show as colored bars in the Actions UI and can link to specific files/lines.

### Step Summary
```bash
cat >> "$GITHUB_STEP_SUMMARY" <<EOF
## Results
| Test | Status |
|------|--------|
| Build | ✅ Pass |
EOF
```

## Artifacts

The workflow uploads:
- **`test-report`** — always uploaded (pass or fail)
- **`debug-info`** — uploaded only on failure (environment, processes, disk usage)

Download artifacts from the run's **Summary** page or the **Artifacts** section.

## Try It

1. Push a change to `demos/demo5/` or run manually from the Actions tab
2. **Passing run:** See log groups, annotations, and the test-report artifact
3. **Failing run:** Trigger manually with `should-fail: true`
   - Watch the `if: failure()` steps capture debug info
   - Download both artifacts and compare
4. After a failure, try **"Re-run failed jobs"** — only the failed job reruns

## "Small Upgrade" — Conditional Steps

```yaml
- name: Capture debug info (only on failure)
  if: failure() || steps.tests.outcome == 'failure'
  run: |
    env | sort > debug-info/environment.txt
    ps aux > debug-info/processes.txt
```

This pattern avoids wasting time on debug capture during passing runs, but ensures you always have the data when things break.

## Takeaways

1. Better logs = faster debugging and less fear of CI
2. Artifacts are your "black box recorder" — always upload test results
3. `if: failure()` lets you capture state only when you need it
