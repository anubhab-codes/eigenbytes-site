# Why DevOps

DevOps is the story of how software changes move safely from a laptop to a live system.

## The problem

When developers ship code without operations in mind, production becomes unstable. When operators control deployments without developer feedback, delivery becomes slow.

## The DevOps answer

DevOps creates a shared feedback loop:

- Developers write code and tests.
- Automation builds and verifies delivery artifacts.
- Operations deploy and monitor.
- The team learns from failures and improves.

## Example workflow

```bash
git checkout -b feature/login
# make changes
git add .
git commit -m "Add login flow"
git push origin feature/login
```

Result: the feature branch can now be reviewed, tested, and deployed.

## Mental model

Think of DevOps as a pipeline from idea to production. Each stage adds safety, visibility, and repeatability.

```mermaid
flowchart LR
  Dev[Developer] -->|push| Git[Source Control]
  Git -->|CI| Build[Build & Test]
  Build -->|Deploy| Prod[Production]
  Prod -->|monitor| Ops[Operations]
```
