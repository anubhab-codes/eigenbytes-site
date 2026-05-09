---
title: What is Git?
sidebar_position: 2
description: "How Git works, why it was built, and your first repository"
---

# What is Git?

Before version control, teams shared code by copying folders: `project`, `project_final`, `project_final_v2`. Files got overwritten, changes were lost, and parallel work was unsafe.

Git solves this. It tracks every change to every file, lets multiple people work on the same codebase simultaneously, and lets you go back to any previous state.

---

## How Git works

Git does not store diffs. It stores **snapshots**.

Each snapshot is called a **commit**. A commit contains the exact state of every tracked file, who made the change, when, and a pointer to the previous commit. Commits form a chain — that chain is the history.

```mermaid
graph LR
    C1[Commit A] --> C2[Commit B] --> C3[Commit C]
    C3 --> HEAD
```

**Git is not GitHub.** Git runs on your local machine and tracks history. GitHub is a service that hosts Git repositories and adds collaboration tools like pull requests and code review. You can use Git without GitHub.

---

## Hands-on

### Create your first repository

```bash
# Initialize a new git repository
mkdir my-project && cd my-project
git init

# Check the current state
git status
```

```
On branch main

No commits yet

nothing to commit (create/copy files and use "git add" to track)
```

### Make your first commit

```bash
# Create a file
echo "# My Project" > README.md

# Stage it (tell git to include it in the next snapshot)
git add README.md

# Commit — create the snapshot
git commit -m "Initial commit"

# View the history
git log
```

```
commit a3f9c1d... (HEAD -> main)
Author: You <you@example.com>
Date:   Fri May 9 10:00:00 2025

    Initial commit
```

### Modify and track a change

```bash
echo "This project does something." >> README.md

# See what changed
git diff

# Stage and commit
git add README.md
git commit -m "Add project description"

# View the two-commit history
git log --oneline
```

```
b7e2a4c (HEAD -> main) Add project description
a3f9c1d Initial commit
```

### Inspect a commit

```bash
# See what a specific commit changed
git show a3f9c1d

# Compare two commits
git diff a3f9c1d b7e2a4c
```

---

## Quick reference

```bash
git init                         # create a new repository
git status                       # what is staged / modified / untracked
git add <file>                   # stage a file
git add .                        # stage everything
git commit -m "message"          # create a snapshot
git log                          # full history
git log --oneline                # compact history
git diff                         # unstaged changes
git diff --staged                # staged changes
git show <commit>                # show a specific commit
```
