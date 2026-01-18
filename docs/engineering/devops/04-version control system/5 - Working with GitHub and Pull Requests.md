---
title: Working with GitHub and Pull Requests
toc:
  max_depth: 2
---

# Working with GitHub and Pull Requests

This article explains how GitHub is used in real team workflows.
It focuses on pull requests and collaboration practices.

GitHub builds on top of Git.
It does not replace Git.

---

## Why GitHub is used

GitHub provides:
- a central place to share code
- visibility into changes
- collaboration tools

GitHub does not change how commits work.
It adds review and coordination.

---

## Protected branches

Most teams protect the `main` branch.

Protection usually means:
- no direct pushes to `main`
- changes must come via pull requests
- checks must pass before merge

This prevents accidental breakage.

---

## Creating a pull request

Typical flow:

1. create a feature branch locally
2. commit changes
3. push branch to GitHub
4. open a pull request

Command example:

```bash
git push -u origin feature-login
```

GitHub detects the new branch
and suggests creating a pull request.

---

## What a pull request really is

A pull request is a request to merge one branch into another.

It shows:
- commits
- file changes
- discussion
- review comments

A pull request does not modify code by itself.

---

## Reviewing a pull request

During review, teammates can:
- comment on lines
- request changes
- approve changes

This process catches bugs early.
It also spreads knowledge across the team.

---

## Keeping a pull request updated

If `main` moves forward, your branch may become outdated.

You can update it by:

```bash
git fetch origin
git rebase origin/main
```

or

```bash
git fetch origin
git merge origin/main
```

Which one to use depends on team rules.

---

## Merge strategies on GitHub

GitHub usually offers:
- merge commit
- squash merge
- rebase merge

Merge commit:
- preserves history
- shows parallel work

Squash merge:
- combines all commits into one
- creates clean history

Rebase merge:
- linear history
- rewrites commits

Teams must choose one and stick to it.

---

## After merge

Once merged:
- feature branch is no longer needed
- branch should be deleted

GitHub usually offers a delete button.
This keeps the repository clean.

---

## Common GitHub mistakes

- large pull requests
- mixing unrelated changes
- rebasing shared branches
- ignoring review comments

Small, focused pull requests work best.

---

GitHub is a collaboration layer.
Git remains the source of truth.
