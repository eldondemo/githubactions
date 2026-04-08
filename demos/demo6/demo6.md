# Demo 6 — Actions Runner Controller (ARC)

**Theme:** "Self-hosted runners at scale on Kubernetes, without babysitting VMs."

## Goal

Understand why teams use self-hosted runners, how ARC automates them on Kubernetes, and what changes (and doesn't change) in your workflow YAML.

## Key Concepts

- **Self-hosted runners** let you control the execution environment — custom tools, network access, compliance requirements
- **ARC (Actions Runner Controller)** is a Kubernetes operator that manages runner pods automatically
- **Ephemeral runners** spin up per job and get destroyed after — clean environment every time
- **Runner scale sets** auto-scale based on workflow queue depth (min/max replicas)
- **`runs-on:` labels** are the only workflow-level change — everything else stays the same

## What's in This Demo

| File | Purpose |
|------|---------|
| `.github/workflows/06-arc.yml` | Workflow targeting self-hosted runners via ARC labels |
| `demos/demo6/demo6.md` | This guide |

## Why Self-Hosted Runners?

GitHub-hosted runners are great for most workloads, but sometimes you need:

| Need | Why GitHub-hosted won't work |
|------|------------------------------|
| **Private network access** | Jobs need to reach internal databases, APIs, or registries behind a firewall |
| **Custom toolchains** | Specialized build tools, licensed compilers, or GPU access |
| **Compliance** | Data residency or security policies that require compute in your own infrastructure |
| **Cost at scale** | High-volume CI can be cheaper on your own hardware or cloud VMs |

## ARC Architecture (High Level)

```
┌─────────────────────────────────────────────────┐
│  GitHub.com                                     │
│                                                 │
│  Workflow queues job ──► "runs-on: arc-runners"  │
└──────────────────┬──────────────────────────────┘
                   │  (outbound HTTPS from cluster)
                   ▼
┌─────────────────────────────────────────────────┐
│  Your Kubernetes Cluster                        │
│                                                 │
│  ┌──────────────────────────────────────────┐   │
│  │  ARC Controller (gha-runner-scale-set-   │   │
│  │  controller namespace)                   │   │
│  │                                          │   │
│  │  Watches GitHub for queued jobs          │   │
│  │  Scales runner pods up/down              │   │
│  └──────────────────────────────────────────┘   │
│                                                 │
│  ┌──────────────────────────────────────────┐   │
│  │  Runner Scale Set (arc-runners namespace)│   │
│  │                                          │   │
│  │  Pod 1 ── picks up Job A ── completes ── │   │
│  │           destroyed                      │   │
│  │  Pod 2 ── picks up Job B ── completes ── │   │
│  │           destroyed                      │   │
│  │  ...scales to 0 when idle                │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

**Key point:** The cluster reaches *out* to GitHub (no inbound firewall rules needed).

## What Changes for Developers?

Almost nothing. The only difference is the `runs-on:` label:

```yaml
# GitHub-hosted
runs-on: ubuntu-latest

# ARC self-hosted
runs-on: arc-runners        # ← matches the runner scale set name
```

Everything else — `actions/checkout`, caching, artifacts, secrets — works the same.

## ARC Installation (Overview Only)

You don't need to install ARC for this demo, but here's what it looks like:

```bash
# 1. Install the ARC controller (once per cluster)
helm install arc \
  --namespace arc-systems --create-namespace \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller

# 2. Create a runner scale set (once per runner group)
helm install arc-runners \
  --namespace arc-runners --create-namespace \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set \
  --set githubConfigUrl="https://github.com/<org>/<repo>" \
  --set githubConfigSecret.github_token="<PAT or GitHub App>" \
  --set minRunners=0 \
  --set maxRunners=5
```

That's it — two Helm commands and your cluster is ready to pick up jobs.

## Workflow Walkthrough

The demo workflow (`.github/workflows/06-arc.yml`) shows:

1. **`self-hosted-job`** — A job targeting `runs-on: arc-runners` that logs runner info, demonstrates the environment is ephemeral, and writes a step summary
2. **`github-hosted-job`** — The same steps on `ubuntu-latest` for comparison
3. **Manual trigger** with an input to choose the runner label — shows how teams can parameterize runner selection

## Operational Talking Points

### Runner Groups
- Organize runners by team, environment, or workload type
- Restrict which repos/workflows can use each group

### Scaling
- `minRunners: 0` means no cost when idle
- `maxRunners` caps resource usage
- ARC scales based on pending jobs in the queue

### Security
- Ephemeral runners = clean slate every job (no leftover state)
- Dedicate namespaces per runner scale set
- Use Kubernetes RBAC + network policies for isolation
- GitHub App auth is preferred over PATs for production

## Try It

> **Note:** This workflow won't actually run on ARC unless you have a cluster with ARC installed. The `github-hosted-job` will always work and demonstrates the same steps for comparison.

1. **Run from the Actions tab** using `workflow_dispatch`
2. Choose a runner label (`arc-runners` or `ubuntu-latest`)
3. Compare the two jobs — notice how the steps are identical, only `runs-on` differs
4. If you have ARC installed, watch pods scale up in your cluster:
   ```bash
   kubectl get pods -n arc-runners -w
   ```

## "Small Upgrade" — Parameterized Runner Selection

The workflow includes an input to select the runner:

```yaml
inputs:
  runner-label:
    description: "Runner label to use"
    default: "ubuntu-latest"
    type: choice
    options:
      - ubuntu-latest
      - arc-runners
```

This pattern lets teams gradually migrate workflows from GitHub-hosted to self-hosted by just changing the input default.

## Takeaways

1. ARC is the bridge between GitHub Actions and Kubernetes elasticity — self-hosted runners, managed like cloud infrastructure
2. For developers, only `runs-on:` changes — everything else works the same
3. Ephemeral runners + auto-scaling = clean environments with no idle cost
