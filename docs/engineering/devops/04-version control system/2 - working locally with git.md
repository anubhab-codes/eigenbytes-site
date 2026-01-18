---
title: Working locally with git
toc:
  max_depth: 2
---

# Working Locally with Git

This article is a hands-on guide to using Git locally.
All commands work without internet or GitHub.

---

## Create a repository

```bash
mkdir git-local-demo
cd git-local-demo
git init
```

What you see:
- confirmation that the repository was initialized
- a `.git` directory created

This directory contains the entire Git database.

---

## Check repository status

```bash
git status
```

What you see:
- current branch
- working tree status

This command shows where you are at all times.

---

## Create and track a file

```bash
echo "first line" > file.txt
git status
```

What you see:
- file listed as untracked

Stage the file:

```bash
git add file.txt
git status
```

What you see:
- file under "Changes to be committed"

---

## Commit changes

```bash
git commit -m "add first file"
```

What you see:
- commit hash
- summary of changes

This snapshot is now part of history.

---

## View history

```bash
git log --oneline
```

What you see:
- list of commits
- newest commit first

---

## Modify a file

```bash
echo "second line" >> file.txt
git status
```

What you see:
- file marked as modified

View changes:

```bash
git diff
```

---

## Commit modifications

```bash
git add file.txt
git commit -m "add second line"
```

History now contains two snapshots.

---

## Branching locally

```bash
git branch feature
git checkout feature
```

What you see:
- branch switch confirmation

Commits now belong to this branch.

---

## Merge and rebase

Merge:

```bash
git checkout main
git merge feature
```

Rebase:

```bash
git checkout feature
git rebase main
```

Merge preserves history.
Rebase rewrites history.

---

## View history graph

```bash
git log --oneline --graph --all
```

This command shows the real shape of history.
