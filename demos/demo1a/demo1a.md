# Demo 1a — Hello World

**Theme:** "The simplest possible workflow."

## Goal 

See the bare minimum: a YAML file that runs a shell command when you push code.

## Key Concepts

- Workflows live in `.github/workflows/` — GitHub automatically discovers them
- Every workflow needs: `name`, `on` (trigger), and `jobs`
- `run:` executes a shell command on the runner
- `runs-on:` picks the virtual machine (e.g., `ubuntu-latest`)

## Workflow Anatomy

```yaml
name: "..."                  # Display name in the Actions tab
on: push                     # When does this run?
jobs:
  my-job:
    runs-on: ubuntu-latest   # Which runner?
    steps:
      - run: echo "Hello"    # Shell command
```

## What's in This Demo

| File | Purpose |
|------|---------|
| `.github/workflows/01a-hello-world.yml` | The workflow — two steps, both `run:` |
| `demos/demo1a/` | Demo folder (changes here trigger the workflow) |

## Try It

- Edit any file in `demos/demo1a/` and push to `main`
- Go to the Actions tab → see the run → expand the steps

## Takeaways

1. A workflow is just a YAML file in `.github/workflows/`
2. `on: push` triggers it when code is pushed
3. `run:` is how you execute shell commands
4. That's it — you just automated something
