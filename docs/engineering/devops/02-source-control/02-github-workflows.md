---
title: GitHub Workflows
sidebar_position: 3
description: "Remote repositories, pull requests, code review, branch protection, and how teams collaborate with Git"
---

# GitHub Workflows

Git manages local history. GitHub manages collaboration.

You have a complete repository on your machine. Your teammate has a complete repository on theirs. GitHub is a shared remote that both of you push to and pull from. Pull requests are the mechanism for proposing and reviewing changes before they reach the main branch.

---

## Remote repositories

A **remote** is a repository stored elsewhere. When you clone a repository, Git creates a remote called `origin` pointing to where you cloned from.

```bash
# Clone a repository
git clone https://github.com/org/repo.git
cd repo

# View configured remotes
git remote -v

# Add a remote manually
git remote add origin https://github.com/org/repo.git
```

### Fetch, pull, push

**Fetch** downloads remote changes without touching your working directory. It is always safe.

**Pull** fetches and immediately merges into your current branch. It can create conflicts.

**Push** uploads your local commits to the remote.

```bash
# Download remote changes (safe, no merge)
git fetch origin

# See what changed on main
git log HEAD..origin/main --oneline

# Merge the fetched changes
git merge origin/main

# Fetch + merge in one step
git pull

# Push your branch
git push origin feature/auth

# Push and set upstream tracking
git push -u origin feature/auth    # first time
git push                            # subsequent pushes
```

The recommended workflow is `git fetch` followed by `git merge` rather than `git pull`. It lets you see what changed before integrating.

---

## Pull requests

A pull request is a request to merge one branch into another. It creates a space for review, discussion, and automated checks before code reaches main.

**The workflow:**

1. Create a branch locally
2. Commit your changes
3. Push the branch to GitHub
4. Open a pull request from that branch to `main`
5. Reviewers leave comments, request changes, approve
6. All checks pass (CI, linting, tests)
7. Merge

```bash
# Local work
git switch -c feature/user-auth
# ... make changes ...
git add . && git commit -m "Add user authentication"
git push -u origin feature/user-auth

# Open a PR from GitHub UI
# Or via GitHub CLI:
gh pr create --title "Add user authentication" --body "Implements JWT-based auth"

# Check PR status
gh pr status
```

---

## Branch protection

Branch protection rules prevent direct pushes to important branches. They enforce code review and passing checks.

Common rules for `main`:
- Require pull request before merging
- Require 1+ approving reviews
- Require status checks to pass (CI pipeline)
- Require branches to be up to date before merging
- Do not allow force pushes

This means nobody — including admins — can bypass review. CI must pass. History is linear and auditable.

---

## Merge strategies

GitHub offers three merge options when closing a PR:

| Strategy | What it does | When to use |
|----------|-------------|-------------|
| **Merge commit** | Creates a merge commit preserving full branch history | When branch history is meaningful |
| **Squash and merge** | Flattens all commits into one | When branch has many WIP commits, clean main history preferred |
| **Rebase and merge** | Replays commits onto main without merge commit | When you want linear history without squashing |

Most teams pick one strategy and stick to it. Squash-and-merge is common for feature branches — it keeps `main` history clean and readable.

---

## Keeping a branch up to date

Long-running branches diverge from main. Before merging, you need to incorporate the latest changes.

```bash
# Option 1: Merge main into your branch (preserves history)
git switch feature/auth
git fetch origin
git merge origin/main

# Option 2: Rebase your branch onto main (cleaner history)
git switch feature/auth
git fetch origin
git rebase origin/main

# If conflicts occur during rebase:
# 1. Fix the conflict in the file
# 2. git add <file>
# 3. git rebase --continue
# Or abort: git rebase --abort
```

---

## GitHub Actions triggers

Pull requests trigger CI automatically when branch protection requires status checks. The typical setup:

```yaml
# .github/workflows/ci.yml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

Every PR runs the CI pipeline. Only if it passes can the PR be merged. This is the enforcement layer that makes branch protection meaningful.

---

## Hands-on: full PR workflow with GitHub CLI

```bash
# 1. Clone a repo (use your own GitHub repo)
git clone https://github.com/<you>/practice.git
cd practice

# 2. Create a branch
git switch -c feature/readme-update

# 3. Make a change
echo "## Updated" >> README.md
git add . && git commit -m "Update README"

# 4. Push
git push -u origin feature/readme-update

# 5. Create PR
gh pr create --title "Update README" --body "Minor update to README"

# 6. View PR
gh pr view --web

# 7. After approval, merge
gh pr merge --squash

# 8. Clean up local branch
git switch main
git pull
git branch -d feature/readme-update
```

---

## Quick reference

```bash
git remote -v                         # list remotes
git clone <url>                       # clone repository
git fetch origin                      # download remote changes
git pull                              # fetch + merge
git push -u origin <branch>          # push and set upstream

gh pr create                          # open pull request (GitHub CLI)
gh pr status                          # PR status
gh pr review --approve                # approve PR
gh pr merge --squash                  # merge with squash

# Resolving conflicts
git fetch origin
git merge origin/main                 # or: git rebase origin/main
# fix conflicts in editor
git add <resolved-file>
git commit                            # or: git rebase --continue
```
