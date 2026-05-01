---
title: Branching in git
toc:
  max_depth: 2
---

# Branching in Git

Branching is how teams work in parallel without breaking each other’s code.
This article explains why branches exist and how they are used in real projects.

All examples are local. No GitHub yet.

---

## Why branches exist

In a real project, multiple people work at the same time.

If everyone commits directly to `main`, problems appear quickly:
- unfinished code gets mixed
- broken changes affect everyone
- testing becomes difficult

Branches solve this problem.

A branch is an isolated line of work.
It lets you make changes without affecting others.

---

## Understanding the `main` branch

The `main` branch represents stable code.

Good rules for `main`:
- it should always build
- it should always run
- it should be safe to release from

Branches exist to protect `main`.

---

## Creating a feature branch

Create a new branch:

```bash
git branch feature-login
```

Check available branches:

```bash
git branch
```

What you see:
- `main`
- `feature-login`

The `*` marks the current branch.

---

## Switching to a branch

```bash
git checkout feature-login
```

What you see:
- a message confirming the branch switch

What this means:
- new commits now belong to `feature-login`
- `main` remains unchanged

---

## Creating and switching in one step

```bash
git checkout -b feature-profile
```

This command:
- creates a new branch
- switches to it immediately

This is the most common way branches are created.

---

## Making commits on a branch

Create a file and commit it:

```bash
echo "profile code" > profile.txt
git add profile.txt
git commit -m "add profile feature"
```

What this means:
- the commit exists only on this branch
- `main` does not see this change

---

## Viewing branch history

```bash
git log --oneline --graph --all
```

What you see:
- separate lines for different branches
- commit order shown visually

This command is the best way to understand Git history.

---

## Merging a branch

Switch back to `main`:

```bash
git checkout main
```

Merge the feature branch:

```bash
git merge feature-profile
```

What you may see:
- a fast-forward merge
- or a merge commit

In both cases, feature changes are now part of `main`.

---

## Fast-forward merge

A fast-forward merge happens when:
- `main` has no new commits
- the feature branch is ahead

Git simply moves the `main` pointer forward.
No merge commit is created.

---

## Merge commit

A merge commit is created when:
- both branches have new commits
- Git needs to join two histories

The merge commit records that work happened in parallel.
Nothing is lost.

---

## Rebase as an alternative

Rebase is another way to integrate branches.

Switch to the feature branch:

```bash
git checkout feature-login
```

Rebase onto `main`:

```bash
git rebase main
```

What happens:
- Git reapplies feature commits on top of `main`
- commit hashes change

---

## What rebase actually does

Rebase rewrites history.

Git:
1. removes feature commits temporarily
2. moves the branch pointer to `main`
3. reapplies commits one by one

The final code is the same.
The commit history looks different.

---

## Merge vs rebase

Merge:
- preserves branch history
- shows parallel development
- safe for shared branches

Rebase:
- creates linear history
- rewrites commit hashes
- safe only for local branches

---

## The most important rebase rule

Never rebase a branch that others are using.

If a branch was pushed and pulled by someone else:
- do not rebase it
- use merge instead

Rebasing shared branches breaks history.

---

## Typical team workflow

A common workflow looks like this:
1. create a feature branch
2. make small commits
3. integrate with `main` (merge or rebase)
4. delete the feature branch

Branches are short-lived and focused.

---

## Deleting a merged branch

After merging, delete the branch:

```bash
git branch -d feature-profile
```

This removes the branch pointer.
The commits remain in history.

---

## Always check your current branch

```bash
git status
```

Many mistakes happen because commits are made on the wrong branch.
Always check before committing.

---

Branching is the foundation of safe team collaboration.
Understanding this makes remote repositories and pull requests much easier to learn.
