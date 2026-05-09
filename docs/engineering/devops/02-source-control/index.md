---
title: Source Control
sidebar_position: 1
description: "How teams manage code changes — Git's distributed model, branching, and GitHub collaboration workflows"
---

# Source Control

Before version control, teams shared code by copying folders: `project`, `project_final`, `project_final_v2`. Files got overwritten. Parallel work was impossible. Changes disappeared.

Git solved this in 2005 and became the universal standard. Every modern engineering workflow is built on it.

---

## What this section covers

**Git** — How the distributed model works, what commits actually are, how branching enables parallel work, and what is happening under the hood when you run `git commit`.

**GitHub workflows** — How teams use Git collaboratively: remote repositories, pull requests, code review, branch protection, and merge strategies.

---

## Why the mental model matters

Most engineers learn Git by memorizing commands. They `git add`, `git commit`, `git push` without understanding what they're doing. Then something goes wrong — a merge conflict, a detached HEAD, a rebase gone wrong — and they have no way to reason about it.

Git has a simple, elegant data model. Once you understand it, the commands make sense. Merge vs rebase is obvious. Why rebase rewrites history is obvious. Why `git reflog` can recover lost commits is obvious.

Learn the model, not just the commands.
