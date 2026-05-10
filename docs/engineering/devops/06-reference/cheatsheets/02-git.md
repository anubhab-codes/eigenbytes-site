---
title: Git
sidebar_position: 3
description: "Git command cheatsheet — track changes, branches, sync with remote, and undo mistakes"
---

# Git Cheatsheet

---

## Set up git (first time only)

```bash
git config --global user.name "Your Name"     # set your name on commits
git config --global user.email "you@email.com" # set your email on commits
git config --global core.editor "vim"          # set default editor

git config --list                              # show all current config
```

---

## Start a repo

```bash
git init                       # turn the current folder into a git repo
git clone <url>                # download a remote repo to your machine
git clone <url> my-folder      # clone into a specific folder name
```

---

## Check what changed

```bash
git status                     # what files have changed, what is staged?
git diff                       # show unstaged changes (what you changed but not added)
git diff --staged              # show staged changes (what will be in the next commit)
git diff main..feature         # compare two branches
```

---

## Stage and commit

```bash
git add file.txt               # stage one file for commit
git add .                      # stage everything in the current directory
git add -p                     # interactively choose which changes to stage (hunk by hunk)

git commit -m "your message"   # commit staged changes with a message
git commit -am "your message"  # stage all tracked files and commit in one step
git commit --amend             # edit the last commit message (or add forgotten files)
```

---

## Sync with remote

```bash
git remote -v                  # show what remotes are configured
git remote add origin <url>    # connect your local repo to a remote

git fetch                      # download remote changes without merging them
git pull                       # fetch + merge remote changes into current branch
git pull --rebase              # fetch + rebase instead of merge (cleaner history)

git push                       # push current branch to remote
git push -u origin main        # push and set the upstream (first push to a branch)
git push --force-with-lease    # force push but refuse if remote changed (safer)
```

---

## Branches

```bash
git branch                     # list all local branches
git branch -a                  # list all branches including remote
git branch feature-x           # create a new branch (stay on current branch)
git switch feature-x           # switch to a branch
git switch -c feature-x        # create a new branch and switch to it
git checkout -b feature-x      # older syntax for: create + switch

git merge feature-x            # merge feature-x into current branch
git rebase main                # replay your commits on top of main (cleaner than merge)

git branch -d feature-x        # delete a branch (safe: won't delete unmerged)
git branch -D feature-x        # force delete a branch
git push origin --delete feature-x   # delete branch on remote
```

---

## Undo mistakes

```bash
git restore file.txt           # discard unstaged changes to a file (undo edits)
git restore --staged file.txt  # unstage a file (keep the changes, just remove from staging)

git revert <commit-hash>       # create a new commit that undoes a specific commit (safe)
git reset --soft HEAD~1        # undo last commit, keep changes staged
git reset --mixed HEAD~1       # undo last commit, keep changes but unstage them
git reset --hard HEAD~1        # undo last commit and throw away all changes (destructive)

git stash                      # temporarily shelve your changes (clean working tree)
git stash pop                  # bring back shelved changes
git stash list                 # show all stashed changes
git stash drop                 # delete the most recent stash
```

---

## Inspect history

```bash
git log                        # show commit history
git log --oneline              # one line per commit (compact)
git log --oneline --graph      # visual branch graph
git log --oneline -20          # last 20 commits
git log -- file.txt            # history of a specific file

git show <commit-hash>         # show what changed in a specific commit
git blame file.txt             # who changed each line of a file and when
git reflog                     # history of everything HEAD has pointed to (your safety net)
```

---

## Tags

```bash
git tag                        # list all tags
git tag v1.0.0                 # create a lightweight tag at current commit
git tag -a v1.0.0 -m "Release" # create an annotated tag with a message
git push origin v1.0.0         # push a specific tag to remote
git push origin --tags         # push all tags to remote
git tag -d v1.0.0              # delete a tag locally
```

---

## Common patterns

```bash
# Start a new feature
git switch main && git pull
git switch -c feature/my-feature

# Sync a feature branch with latest main
git switch main && git pull
git switch feature/my-feature
git rebase main

# Undo a bad push (creates a reverting commit, does not rewrite history)
git revert <commit-hash>
git push
```
