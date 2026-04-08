# Demo 4 — Custom Actions (JavaScript + Composite)

**Theme:** "When workflows get messy, package logic as an action."

## Goal

Understand when and how to create custom actions — both JavaScript and composite — with inputs, outputs, and log annotations.

## Key Concepts

- **Custom actions** package reusable steps so you stop copy/pasting across workflows
- **JavaScript actions** use Node.js + `@actions/core` for inputs, outputs, annotations, and summaries
- **Composite actions** are pure YAML — just a sequence of steps bundled as a reusable unit
- Both types define an **interface** (`action.yml`) with `inputs` and `outputs`
- You reference local actions with `uses: ./.github/actions/<name>`

## What's in This Demo

| File | Purpose |
|------|---------|
| `.github/actions/demo-js-action/action.yml` | JS action interface — inputs, outputs, runtime |
| `.github/actions/demo-js-action/index.js` | JS action logic — reads input, formats output, adds annotation |
| `.github/actions/demo-composite-action/action.yml` | Composite action — pure YAML steps |
| `.github/workflows/04-custom-actions.yml` | Workflow that uses both actions |

## JavaScript Action — How It Works

**Interface** (`action.yml`):
```yaml
inputs:
  message:
    description: "The greeting message"
    required: true
  uppercase:
    description: "Whether to uppercase the result"
    default: "false"
outputs:
  result:
    description: "The formatted greeting result"
runs:
  using: "node20"
  main: "index.js"
```

**Implementation** (`index.js`):
```javascript
const core = require('@actions/core');
const message = core.getInput('message');
core.setOutput('result', `🎉 ${message}`);
core.notice(`Greeting generated: ${message}`);  // log annotation!
```

**Usage in workflow:**
```yaml
- uses: ./.github/actions/demo-js-action
  id: greet
  with:
    message: "Hello!"
- run: echo "${{ steps.greet.outputs.result }}"
```

## Composite Action — How It Works

No JavaScript, no Docker — just steps in YAML:

```yaml
runs:
  using: "composite"
  steps:
    - name: Generate report
      id: generate
      shell: bash
      run: |
        REPORT="📋 Report for ${{ inputs.name }}"
        echo "report=${REPORT}" >> "$GITHUB_OUTPUT"
```

Same `inputs`/`outputs` interface, same `uses:` syntax in the caller.

## Comparison

| Type | Pros | Cons |
|------|------|------|
| **Composite** | Pure YAML, no build step, easy to start | No native annotation API, limited logic |
| **JavaScript** | Full Node.js, `@actions/core` annotations + summaries | Must commit `node_modules` or bundle |
| **Docker** *(optional talk track)* | Any language, pinned toolchain | Linux-only, image build/pull overhead |

## Try It

1. Push a change to `demos/demo4/`, `.github/actions/`, or the workflow file
2. Or run manually from the Actions tab
3. Check the JS action job — notice the **annotation** in the Actions UI (yellow notice bar)
4. Check the composite action job — simpler, but same input/output pattern
5. Look at the summary job for a side-by-side comparison

## Docker Actions (Talk Track)

> No Docker action is included to keep demo time short. Mention verbally:

- `runs: using: docker` in `action.yml` + a `Dockerfile`
- Pros: pinned toolchain, any language
- Cons: image build or pull on every run, Linux runners only

## Takeaways

1. Start with **composite actions** for simple multi-step reuse
2. Move to **JS actions** when you need logic, annotations, or cross-platform
3. Custom actions have the same `inputs`/`outputs` interface regardless of type
