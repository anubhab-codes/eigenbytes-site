---
layout: post
title: "Functional use cases"
subtitle: "Useful Linux Commands"
categories: [devops]
tags: [devops]
topic: linux
---

# Introduction to Linux (How to Think)

This document introduces Linux by explaining **how to reason about a Linux system**, not just which commands exist.
The goal is to help understand *why* Linux behaves the way it does, so later topics (DevOps, containers, automation) feel natural.

## How Linux is different from Windows (the core idea)

Linux and Windows solve different problems.

Windows was designed for **individual desktop users**:

* Strong focus on GUI
* System internals are intentionally hidden
* Manual interaction is the default

Linux was designed for **multi-user systems and servers**:

* System internals are visible
* Everything is controlled using files and processes
* Automation is expected, not optional

A useful mental model:

* Windows is like **ready-made furniture**: polished and convenient, but hard to modify internally.
* Linux is like **Lego bricks in a workshop**: smaller pieces, fully visible, and easy to assemble differently.

This single difference explains why Linux dominates servers and DevOps.

## Why Linux became the base for DevOps and cloud

Linux exposes low-level system behavior in a way automation tools can directly control.

### Containers (why Linux is required)

Containers are not a generic technology; they depend on Linux kernel features:

* **Namespaces** isolate processes, networks, and filesystems.
* **cgroups** control CPU and memory usage.
* **chroot** limits filesystem visibility.

Because of this:

* A container is a restricted Linux process.
* It is not a virtual machine.
* On Windows or macOS, Docker runs a small Linux VM in the background.
* Containers still execute on a Linux kernel.

This is a technical dependency, not a preference.

### Configuration management (Ansible)

Ansible assumes Linux-style systems:

* SSH-based remote execution
* Text configuration files
* Linux users, permissions, and package managers

Windows support exists, but:

* Requires WinRM
* Uses separate modules
* Adds complexity

Linux aligns naturally with automation, so it remains the default.

## What “Linux” actually means (distributions)

Linux itself is only the **kernel**.
A usable system is created by combining the kernel with tools, libraries, and defaults. This is called a **distribution**.

Example:

* RHEL = enterprise Linux with paid support
* CentOS = community rebuild of RHEL (same structure, no support)

Different distributions exist, but the core concepts do not change.

## How you interact with Linux (CLI-first thinking)

Linux provides both GUI and CLI, but servers are **CLI-only**.

This matters because:

* Scripts run CLI commands
* Automation uses CLI commands
* Troubleshooting happens via CLI

Learning Linux means learning to **reason through commands**.

---

## Shells: how Linux interprets commands

A shell is the program that reads your command and decides **what to execute**.

Common shells:

* `sh` – original Bourne shell
* `csh` / `tcsh` – C-style syntax
* `zsh` – modern interactive shell
* `bash` – default on most enterprise systems

`bash` is important because it supports:

* Variables
* Arithmetic
* Conditions
* Loops
* Scripts

Check which shell you are using:

```bash
echo $SHELL
```

Interpretation:

* `/bin/bash` means Bash is processing your commands
* Scripts will behave according to Bash rules

---

## Understanding the operating system (thinking, not guessing)

Before running commands or installing software, you must know **what OS you are on**.
Different OS versions mean different package managers, paths, and defaults.

### Method 1: Distribution identity (most common)

```bash
cat /etc/os-release
```

This tells you:

* Distribution name
* Version
* Vendor

Use this when deciding:

* Which package manager to use
* Which documentation applies

---

### Method 2: Compatibility check (practical admin view)

```bash
ls /etc/*release*
```

Why this exists:

* Many tools and scripts only check for file presence
* Legacy systems may not have `os-release`

This helps you reason about **backward compatibility**.

---

### Method 3: Kernel vs OS distinction (advanced thinking)

```bash
uname -a
```

This tells you:

* Kernel version
* Architecture

Important insight:

* Two systems can run the same kernel
* But behave differently due to distribution-level tools

Kernel ≠ distribution.

---

## Core Linux commands (mental model first)

Linux commands are intentionally small and focused.

Examples:

```bash
echo Hi        # print output
ls             # list files
cd /path       # move in filesystem
pwd            # show current location
mkdir test     # create directory
```

Key idea:

* Commands do one thing
* You combine them to do complex tasks

---

### Files and directories

Create nested paths:

```bash
mkdir -p /tmp/asia/india/bangalore
```

Remove recursively:

```bash
rm -r old_dir
```

Copy directories:

```bash
cp -r src dest
```

Create files:

```bash
touch file.txt
```

Write content:

```bash
cat > file.txt
```

Read content:

```bash
cat file.txt
```

Linux treats **everything as files**, including configuration and devices.

---

## Editing files with vi (why it still exists)

`vi` is always available, even on minimal servers.

Understanding vi is about **survivability**, not preference.

Basic flow:

* Open file → command mode
* Press `i` → insert mode
* Press `Esc` → command mode

Common actions:

* Save: `:w`
* Quit: `:q`
* Save and quit: `:wq`
* Search: `/word`

You do not need speed. You need reliability.

---

## Users and permissions (how Linux thinks about access)

Linux separates **identity** from **privilege**.

Check identity:

```bash
whoami
id
```

Switch users:

```bash
su
```

Remote login:

```bash
ssh user@host
```

`root` is the superuser.
Regular users are restricted by default.

Example:

```bash
ls /root
```

Result:

```text
Permission denied
```

With controlled privilege:

```bash
sudo ls /root
```

Sudo:

* Temporarily elevates privilege
* Requires user authentication
* Logs every action

---

## Downloading files (automation-friendly)

Using curl:

```bash
curl <url> -O
```

Using wget:

```bash
wget <url> -O file_name
```

Both are commonly used in scripts and pipelines.

---

## Installing software (how Linux decides dependencies)

### rpm (low-level)

```bash
rpm -i ansible.rpm
```

* Installs one package
* Does not resolve dependencies

Use when:

* Offline installs
* Controlled environments

---

### yum (high-level)

```bash
yum install ansible
```

* Resolves dependencies
* Uses repositories

Repositories live in:

```text
/etc/yum.repos.d/
```

Yum:

* Compares available versions
* Selects compatible packages
* Avoids conflicts

Other systems use:

* `apt`
* `dnf`
* `zypper`

The idea is the same everywhere.

---

## Services and systemd (process thinking)

Modern Linux uses **systemd** to manage services.

Check service state:

```bash
systemctl status my_app
```

Start service:

```bash
systemctl start my_app
```

Older `service` command still exists but wraps `systemctl`.

---

## Creating a simple service (reasoning example)

You have:

```text
/opt/my_app/my_app.py
```

Create:

```text
/etc/systemd/system/my_app.service
```

```ini
[Unit]
Description=My Sample App

[Service]
ExecStart=/usr/bin/python3 /opt/my_app/my_app.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Reload systemd:

```bash
systemctl daemon-reload
```

Enable and start:

```bash
systemctl enable my_app
systemctl start my_app
```
Thinking model:

* `[Unit]` explains *what*
* `[Service]` explains *how*
* `[Install]` explains *when*
---

Linux is powerful because it exposes its internals in a consistent, scriptable way.
Once you understand how Linux thinks about identity, files, processes, and services, DevOps and cloud concepts stop feeling magical and start feeling logical.
