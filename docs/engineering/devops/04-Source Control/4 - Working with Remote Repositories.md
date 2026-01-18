---
title: Working with Remote Repositories
toc:
  max_depth: 2
---

# Working with Remote Repositories

This article explains how Git works with remote repositories.
Remote repositories are used to share work between developers.

All commands here assume you already understand local Git basics.

---

## What a remote repository is

A remote repository is another copy of your Git repository.
It usually lives on a server, but technically it is just another Git repo.

Your local repository and the remote repository are independent.
Git only syncs them when you explicitly tell it to.

---

## Cloning a remote repository

```bash
git clone <repo-url>
```

Example:

```bash
git clone https://github.com/example/project.git
```

What you see:
- Git downloads all commits
- A new directory is created
- A remote named `origin` is added automatically

What this means:
- You now have a full local copy of the repository
- You have the entire history, not just the latest code

---

## Checking remote configuration

```bash
git remote -v
```

What you see:
- remote name (usually `origin`)
- fetch URL
- push URL

What this means:
- `origin` is just a name
- fetch and push URLs can be different

---

## Understanding fetch

```bash
git fetch origin
```

What you see:
- Git downloads new commits
- No files change in your working directory

What this means:
- Your local branches are unchanged
- Remote-tracking branches like `origin/main` are updated

Fetch is always safe.
It never modifies your code.

---

## Viewing remote changes after fetch

```bash
git log --oneline origin/main
```

What you see:
- commits that exist on the remote
- commits may not exist locally yet

This lets you inspect changes before merging them.

---

## Pulling changes from remote

```bash
git pull origin main
```

What happens:
- Git performs `fetch`
- Git then merges into your current branch

What you see:
- either a fast-forward
- or a merge commit
- or a conflict

Pull is convenient but risky.
It changes your working directory.

---

## Recommended workflow: fetch then merge

```bash
git fetch origin
git merge origin/main
```

Why this is better:
- you see changes before merging
- you control when merge happens
- easier to debug problems

---

## Pushing changes to remote

```bash
git push origin main
```

What you see:
- Git uploads commits
- Remote branch is updated

If push fails:
- remote has commits you do not have
- you must fetch first

---

## Pushing a new branch

```bash
git push -u origin feature-login
```

What this does:
- creates the branch on remote
- sets upstream tracking

After this, you can run:

```bash
git push
git pull
```

without specifying branch names.

---

## Understanding remote-tracking branches

Remote-tracking branches look like:

```text
origin/main
origin/feature-login
```

These are read-only references.
They show the last known state of the remote.

They are updated only by fetch or pull.

---

## Deleting remote branches

```bash
git push origin --delete feature-login
```

What this means:
- branch is removed from remote
- local branch is unaffected

---

## Common mistakes with remotes

- assuming pull is safe
- pushing without fetching
- working directly on `main`
- not checking `git status`

Always remember:
Git does nothing automatically.
Every network action is explicit.

---

Remote repositories enable collaboration,
but Git logic always starts locally.
