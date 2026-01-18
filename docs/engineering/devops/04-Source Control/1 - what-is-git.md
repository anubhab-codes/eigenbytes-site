---
title: What is Git?
toc:
  max_depth: 2
---

# Git Introduction

Git is a version control system.
It tracks changes to files over time and records how a codebase evolves.

Instead of storing only the latest version of a file, Git keeps a full history.
This history allows teams to understand what changed, when it changed, and who changed it.

Before version control, teams shared code by copying folders like:
`project`, `project_final`, `project_final_v2`.

This approach breaks very quickly.
Files get overwritten, changes are lost, and parallel work becomes unsafe.

Git exists to solve this problem in a structured and reliable way.

---

## What Git actually tracks

Git does not track projects or folders as a single unit.
It tracks individual files and their state.

At specific points in time, Git takes a snapshot of files.
Each snapshot is called a commit.

A commit contains:
- the exact state of files
- the author of the change
- the time the change was recorded
- a reference to the previous commit

Commits are linked together.
This chain forms the history of the project.

---

## Git is not GitHub

Git and GitHub are often confused.
They are not the same thing.

Git is a tool.
GitHub is a service.

Git runs on your local machine.
GitHub runs on remote servers.

You can use Git without GitHub.
You cannot use GitHub without Git.

If GitHub is unavailable, your local Git repository still works.

---

## Why Git was needed

Before Git, centralized tools like SVN were common.

In centralized systems:
- one server stores the full history
- developers work with partial copies
- most actions require network access

If the server is slow or unavailable, work slows or stops.

Git removes this dependency.

---

## Distributed version control

Git is distributed because every clone is a full repository.

When you clone a repository, you receive:
- all commits
- all branches
- the complete history

Your local machine is not just a client.
It is a complete copy of the repository.

Remote repositories are just additional copies.

---

## Short history of Git

Git was created by Linus Torvalds in 2005 to manage the Linux kernel.

The kernel has thousands of contributors working in parallel.
Existing tools were too slow and fragile for this scale.

Git was designed to be fast, reliable, and safe for parallel work.
These design decisions still influence Git today.

---

## Git vs GitHub

Git:
- version control system
- runs locally
- tracks file history
- works offline

GitHub:
- hosts Git repositories
- provides collaboration tools
- enables pull requests and reviews

Git manages history.
GitHub manages collaboration.
