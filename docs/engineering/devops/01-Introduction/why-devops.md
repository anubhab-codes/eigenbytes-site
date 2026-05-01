---
layout: post
title: "Why DevOps?"
subtitle: "A simple, real example (no buzzwords)"
categories: [devops]
tags: [devops]
---

# Why DevOps?

## A simple starting point

A developer writes some code.

The code works on the developer’s laptop.  
Now it needs to run on a server so users can use it.

This step _moving code from a laptop to a server_ is where problems usually start.

---

## What was the problem?

Earlier, deployments followed a **documented checklist**.

A typical checklist looked like this:

1. Download the build  
2. Unzip it  
3. Copy files to the application directory  
4. Ensure correct file ownership and permissions  
5. Restart the application  

The issue was **not lack of documentation**.

The issue was **how the same steps were executed**.

---

## A realistic example of variation

Consider this checklist step:

> “Ensure correct file ownership and permissions”

The document also stated:
- Files should be owned by `appuser`
- Permissions should match the existing release

Now two engineers follow this.

### Engineer A
- Copies the new files **over the existing directory**
- Old files that no longer exist in the new build are left behind
- Existing ownership and permissions are preserved

### Engineer B
- Removes the old directory completely
- Copies the new files into a clean directory
- Applies ownership and permissions explicitly

Both approaches are **reasonable**.  
Both follow the document.

But the result is different.

---

## Why was this risky?

Because copying over an old directory can:

- Leave obsolete files on disk  
- Preserve permissions from a previous release  
- Apply unintended configuration  
- Make behavior depend on what was deployed earlier  

The application may start successfully  
and still behave incorrectly later.

---

## The simple idea behind DevOps

A small but important change:

> “Every deployment must create the same directory structure,  
> with the same files, ownership, and permissions —  
> regardless of what existed before.”

So instead of:
- Adjusting things based on the previous deployment

We move to:
- Recreating the application directory in a known way
- Applying ownership and permissions explicitly
- Making each deployment independent of history

This approach is called **DevOps**.

---

## What changed after this?

- Deployments behaved the same way every time  
- Permission issues stopped appearing unexpectedly  
- Old files stopped affecting new releases  
- Failures became easier to explain and reproduce  

Nothing became fancy.  
Things became **predictable**.

---

## One takeaway

DevOps exists because **relying on previous server state is risky**.

DevOps removes that risk by **recreating the application exactly as intended on every deployment**.
