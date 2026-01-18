---
title: Git Internals
toc:
  max_depth: 2
---

# Git Internals (How Git Works Under the Hood)

This article explains Git internals with one goal:
make Git predictable.

You are not expected to memorize commands or file paths.
You are expected to understand how Git *thinks*.

Once this clicks, merge, rebase, reset, and recovery stop feeling scary.

---

## The `.git` directory

The `.git` directory is the Git repository.
Everything Git knows about your project lives here.

Your working directory contains files.
The `.git` directory contains *history*.

If `.git` is deleted:
- all commits are lost
- all branches are lost
- Git cannot recover history

Your files may still exist,
but Git tracking is permanently gone.

Important contents inside `.git`:
- `objects/` → actual data
- `refs/` → branch pointers
- `HEAD` → current position
- `index` → staging area

---

## Git objects: how Git stores data

Git stores everything as objects.
Objects are immutable.

This means:
- objects are never modified
- new objects are created instead

There are three core object types.

---

### Blob objects (file content)

A blob stores *only file content*.

It does not store:
- file name
- directory location
- permissions

If two files have identical content,
Git stores only one blob.

This is why Git is space efficient.

---

### Tree objects (directory structure)

A tree represents a directory.

A tree maps:
- file names → blob objects
- subdirectories → other tree objects

Trees describe *structure*.
Blobs describe *content*.

Together, they represent a snapshot.

---

### Commit objects (snapshots)

A commit object represents a snapshot in time.

A commit contains:
- a pointer to a tree (the snapshot)
- parent commit(s)
- author and committer information
- commit message

A commit does not store files.
It points to trees, which point to blobs.

This indirection is intentional.

---

## Why commits are immutable

Every Git object is identified by a hash.
The hash is calculated from the object content.

If anything inside the object changes:
- the hash changes
- Git treats it as a new object

This guarantees:
- history cannot be silently modified
- corruption is detectable
- commits are trustworthy

This is the foundation of Git safety.

---

## Branches: just pointers

A branch is *not* a copy of code.
A branch is a pointer to a commit.

When you create a branch:
- no files are duplicated
- no commits are copied
- only a pointer is created

When you commit:
- Git creates a new commit object
- the current branch pointer moves forward

Other branches are unaffected.

This is why branches are cheap and fast.

---

## HEAD: where you are right now

`HEAD` represents your current position.

Usually:
- `HEAD` → branch → commit

This means:
- commits move the branch
- HEAD follows the branch

---

## Detached HEAD explained

Detached HEAD means:
- HEAD points directly to a commit
- no branch points to that commit

You can:
- inspect files
- run builds
- experiment safely

But:
- new commits will be lost unless you create a branch

Detached HEAD is safe for inspection,
not for long-term work.

---

## The staging area (index)

The staging area is stored in `.git/index`.
It sits between working directory and repository.

The staging area decides:
- what goes into the next commit
- what stays out

This allows:
- partial commits
- clean commit history
- intentional changes

Only staged content is committed.
This is why `git add` exists.

---

## The three Git areas (important)

Git always works with three areas:

1. Working directory  
   Files you edit.

2. Staging area (index)  
   Files prepared for commit.

3. Repository  
   Committed history.

Commands move data between these areas.
Understanding this removes confusion.

---

## What `git commit` really does

When you run `git commit`:

1. Git reads the staging area
2. Git creates blob objects if needed
3. Git creates tree objects
4. Git creates a commit object
5. Git moves the branch pointer

Nothing is overwritten.
Everything is additive.

---

## Why rebase rewrites history

Rebase does *not* move commits.
It creates new commits.

During rebase:
- original commits are abandoned
- new commits are created with new hashes
- branch pointer moves to new commits

Old commits still exist temporarily,
but become unreachable.

This is why rebasing shared branches is dangerous.

---

## Why merge is safe

A merge commit has multiple parents.

This records:
- both histories
- where they joined

Nothing is rewritten.
No commit hashes change.

Merge preserves reality.
Rebase rewrites the story.

---

## Why Git can recover lost commits

Git does not immediately delete objects.

Unreachable commits remain until:
- garbage collection runs
- retention period expires

This is why:
- `git reflog` can recover mistakes
- accidental resets are often reversible

Git prefers safety over cleanup.

---

## Why Git is fast

Git is fast because:
- operations are local
- objects are content-addressed
- history is immutable

Most commands never touch the network.

This is why Git scales well.

---

## Why internals matter

Understanding internals helps you:
- predict Git behavior
- choose merge vs rebase correctly
- recover from mistakes calmly
- stop guessing

Git is not complex.
It is strict.

Once the model is clear,
Git becomes boring — and that is good.
