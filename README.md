# GitHub Actions Workshop

A hands-on workshop repo for learning GitHub Actions — from basic workflows to full CI/CD pipelines.

## Repository Structure

```
├── .github/workflows/       # All workflow YAML files
├── demos/
│   ├── demo1/               # Demo 1 files + docs
│   ├── demo2/               # Demo 2 files + docs
│   ├── demo3/               # Demo 3 files + docs
│   ├── demo4/               # Demo 4 files + docs
│   └── ...
└── README.md
```

## Demos

| Demo | Topic | Workflow | Docs |
|------|-------|----------|------|
| 1 | Workflows (Triggers, Jobs, Steps, Marketplace Actions) | `01-workflows.yml` | [demo1.md](demos/demo1/demo1.md) |
| 2 | Environments, Secrets & GITHUB_TOKEN Permissions | `02-env-secrets-permissions.yml` | [demo2.md](demos/demo2/demo2.md) |
| 3 | Policies, Reusable Workflows & Caching | `03-reuse-cache.yml` + `_reusable-test.yml` | [demo3.md](demos/demo3/demo3.md) |
| 4 | Custom Actions (JavaScript + Composite) | `04-custom-actions.yml` | [demo4.md](demos/demo4/demo4.md) |

> Each workflow only triggers on changes to its own demo folder or workflow file. Push safely without running everything.

## How to Run

1. Push a change to a specific `demos/demoN/` folder to trigger that demo's workflow
2. Or use **Actions → Run workflow** for manual dispatch
