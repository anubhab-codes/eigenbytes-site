# Engineering Portal Strategy

## Objective

Build a high-quality engineering knowledge portal focused on practical enterprise DevOps and platform engineering.

The portal should:
- teach concepts clearly
- provide hands-on implementation
- include architecture diagrams
- include local runnable examples
- include GitHub repositories
- include screenshots and troubleshooting
- progressively move from beginner to advanced

Audience:
- DevOps engineers
- IAM engineers
- Platform engineers
- Architects transitioning into cloud-native systems

---

# Current Focus

Focus ONLY on:

docs/engineering/devops

Do NOT modify:
- publications
- resume

unless explicitly instructed.

---

# Documentation Standards

Every topic must contain:

1. Introduction
2. Problem statement
3. Why this matters
4. Architecture explanation
5. Step-by-step implementation
6. Commands
7. Local testing
8. Verification
9. Troubleshooting
10. Cleanup
11. Screenshot placeholders
12. GitHub sample repository link

---

# Writing Style

- Clear and direct
- Architect-level clarity
- Beginner friendly
- No marketing language
- Use simple English
- Use real enterprise examples
- Explain WHY before HOW
- Use diagrams heavily

---

# Preferred Stack

- Docker Desktop
- Kubernetes
- GitHub Actions
- ArgoCD
- Helm
- Terraform
- AWS EKS
- Local-first setup when possible

---

# Content Strategy

Conceptual docs and hands-on labs must be separated.

Example:

docs/engineering/devops/concepts/gitops.md

docs/engineering/devops/hands-on/argocd-local-setup.md

---

# Tutorial Rules

Hands-on tutorials must:
- work locally
- use free tooling
- be reproducible
- avoid enterprise dependencies
- avoid hidden setup assumptions

---

# Repository Linking Model

Every major tutorial should link to:
- a dedicated GitHub example repo
- reusable manifests
- sample pipelines
- Helm charts
- Terraform templates

---

# AI Execution Rules

When restructuring:
- preserve existing navigation where possible
- improve hierarchy gradually
- do not mass delete content
- prefer incremental refactoring
- generate reusable markdown templates

Always propose major structural changes before implementing them.