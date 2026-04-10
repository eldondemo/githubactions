# Demo 4b — Custom Docker Action

**Theme:** "Same action pattern, different packaging — Docker gives you a locked-down toolchain."

## Goal

Build a Docker-based custom action and see how it compares to the JS and composite actions from Demo 4. 

## When Would You Use a Docker Action?

1. **Pinned toolchain** — Your team needs a specific version of a CLI (e.g. Terraform 1.7.2, a custom scanner, or a legacy compiler). A Docker action bakes it into the image so every run uses the exact same version, regardless of what the runner has installed.
2. **Non-Node/non-shell logic** — Your action needs to run Python, Go, Rust, or any other language. Instead of installing it on the runner every time, package it in a container and it's ready instantly.

## Key Concepts

- A Docker action is a **Dockerfile + entrypoint script** wrapped with an `action.yml`
- Inputs arrive inside the container as **`INPUT_<NAME>`** environment variables (uppercased)
- Outputs are set via `echo "key=value" >> $GITHUB_OUTPUT` (same as other actions)
- GitHub **builds the Docker image on every run** — this is the visible overhead in the logs
- Docker actions only run on **Linux runners** (`ubuntu-latest`)

## What's in This Demo

| File | Purpose |
|------|---------|
| `.github/actions/demo-docker-action/action.yml` | Action interface — inputs, outputs, `using: docker` |
| `.github/actions/demo-docker-action/Dockerfile` | Alpine-based image, copies entrypoint |
| `.github/actions/demo-docker-action/entrypoint.sh` | Shell script that generates the greeting |
| `.github/workflows/04b-docker-action.yml` | Workflow that calls the Docker action |

## How It Works

**`action.yml`** — note `using: docker`:
```yaml
runs:
  using: "docker"
  image: "Dockerfile"
```

**`Dockerfile`** — simple Alpine image:
```dockerfile
FROM alpine:3.19
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
```

**`entrypoint.sh`** — inputs come from environment:
```bash
#!/bin/sh
NAME="${INPUT_NAME}"        # <-- GitHub sets this automatically
echo "greeting=Hello, ${NAME}!" >> "$GITHUB_OUTPUT"
```

## Try It

1. Push a change to `demos/demo4b/` or the workflow/action files
2. Or run manually from the Actions tab
3. In the logs, look for the **"Build container"** step — that's the Docker build overhead
4. Compare the total run time to the JS action from Demo 4

## What to Point Out During the Demo

- The **"Build container"** log group shows the `docker build` happening
- Inputs are mapped to `INPUT_NAME`, `INPUT_STYLE` (uppercased, prefixed)
- Output mechanism (`$GITHUB_OUTPUT`) is the same across all action types
- The container runs as an isolated process — nothing leaks to the runner

## Comparison (All Three Action Types)

| Type | Runtime | Cross-platform | Deps | Build step |
|------|---------|---------------|------|------------|
| **Composite** | Shell on runner | Yes | None | None |
| **JavaScript** | Node on runner | Yes | `node_modules` committed | None |
| **Docker** | Container | Linux only | Baked into image | Docker build on each run |

## Takeaways

1. Docker actions give you a **fully controlled environment** — any language, any tools
2. The tradeoff is **build time overhead** and **Linux-only**
3. All three action types share the same `inputs`/`outputs` interface
