# GitHub Actions Workshop

A hands-on workshop repo for learning GitHub Actions — from basic workflows to full CI/CD pipelines.

**Presenter Guide:** See [demosteps.md](demosteps.md) for detailed walkthrough instructions.

## Repository Structure

```
├── .github/workflows/       # All workflow YAML files
├── .github/actions/         # Custom actions (JS, Composite, Docker)
├── demos/
│   ├── demo1a/              # Demo 1a files + docs
│   ├── demo1b/              # Demo 1b files + docs
│   ├── demo1c/              # Demo 1c files + docs
│   ├── demo2/               # Demo 2 files + docs
│   ├── ...
│   └── demo9/               # Demo 9 files + docs
└── README.md
```

## Demos

| Demo | Topic | Workflow | Docs | Time |
|------|-------|----------|------|------|
| 1a | Hello World — Simplest Workflow | `01a-hello-world.yml` | [demo1a.md](demos/demo1a/demo1a.md) | ~5 min |
| 1b | Checkout, Scripts & Manual Triggers | `01b-checkout-and-scripts.yml` | [demo1b.md](demos/demo1b/demo1b.md) | ~5 min |
| 1c | Context Variables, Summaries & Matrix | `01c-summaries-and-matrix.yml` | [demo1c.md](demos/demo1c/demo1c.md) | ~5 min |
| 2 | Environments, Secrets & GITHUB_TOKEN Permissions | `02-env-secrets-permissions.yml` | [demo2.md](demos/demo2/demo2.md) | ~10 min |
| 3 | Reusable Workflows & Caching | `03-reuse-cache.yml` + `_reusable-test.yml` | [demo3.md](demos/demo3/demo3.md) | ~10 min |
| 4 | Custom Actions (JavaScript + Composite) | `04-custom-actions.yml` | [demo4.md](demos/demo4/demo4.md) | ~10 min |
| 4b | Custom Docker Action | `04b-docker-action.yml` | [demo4b.md](demos/demo4b/demo4b.md) | ~5 min |
| 5 | Runners (GitHub-hosted) & Workflow Logs | `05-runners-logs.yml` | [demo5.md](demos/demo5/demo5.md) | ~10 min |
| 6 | Actions Runner Controller (ARC) | `06-arc.yml` | [demo6.md](demos/demo6/demo6.md) | ~10 min |
| 7 | Full Python CI/CD Pipeline | `07-python-cicd.yml` | [demo7.md](demos/demo7/demo7.md) | ~10 min |
| 8 | Copilot-Generated CI Workflow | `08-copilot-ci.yml` | [demo8.md](demos/demo8/demo8.md) | ~15 min |
| 9 | Service Containers (PostgreSQL sidecar) | `09-service-containers.yml` | [demo9.md](demos/demo9/demo9.md) | ~10 min |

> Each workflow only triggers on changes to its own demo folder or workflow file. Push safely without running everything.

## How to Run

1. Push a change to a specific `demos/demoN/` folder to trigger that demo's workflow
2. Or use **Actions → Run workflow** for manual dispatch
