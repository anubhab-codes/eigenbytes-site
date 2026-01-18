---
layout: post
title: "Linux File system"
subtitle: "Linux File system Guide"
categories: [devops]
tags: [devops]
topic: linux
---

# Linux Filesystem Layout

## How John Learns Why Everything Lives Where It Does

John is now comfortable logging into Linux. He can run commands, edit files, and start services.
But one question keeps coming up:

> “Where should things actually go?”

Linux does not place files randomly. The filesystem layout exists to solve real operational problems.

---

## John explores the root of the filesystem

John starts at the top:

```bash
ls /
```

He sees directories like `/bin`, `/etc`, `/var`, `/opt`, `/home`, `/tmp`.

At first, this looks arbitrary. It is not.

Linux follows a standard layout so that:

* admins know where to look
* tools know where to read from
* automation behaves consistently across systems

---

## `/home`: where humans live

John checks:

```bash
ls /home
```

He sees his own directory:

```text
/home/john
```

This directory exists because:

* each user needs a private workspace
* permissions isolate users from each other
* backups can target user data easily

John creates a file:

```bash
touch /home/john/test.txt
```

Linux allows this because John owns his home directory.

---

## `/root`: why John was denied earlier

Earlier, John tried:

```bash
ls /root
```

and got “permission denied”.

Now it makes sense.

`/root` is:

* the home directory of the `root` user
* intentionally separate from `/home`
* protected from regular users

Root is a user, not magic. It just has a different home.

---

## `/bin` and `/sbin`: basic commands live here

John wonders where commands like `ls` actually come from.

He checks:

```bash
which ls
```

Output:

```text
/bin/ls
```

This tells him:

* `/bin` contains essential user commands
* these commands must be available even in recovery mode

Similarly:

```bash
which ip
```

might point to:

```text
/sbin/ip
```

`/sbin` contains system-level commands meant for administrators.

---

## `/etc`: configuration lives here (and only here)

John edits a service file earlier in `/etc/systemd/system`.
Now he understands why.

`/etc` exists for **configuration only**.

John lists it:

```bash
ls /etc
```

He sees:

* service configs
* user configs
* network configs

Important rule:

> Executables do not live in `/etc`.
> Data does not live in `/etc`.
> Only configuration.

This separation allows:

* safe upgrades
* easy backups
* predictable automation

---

## `/var`: data that changes while the system runs

John notices logs are not in `/etc`.

He checks:

```bash
ls /var
```

He sees directories like:

* `/var/log`
* `/var/lib`
* `/var/tmp`

He opens logs:

```bash
ls /var/log
```

This explains why:

* logs grow over time
* disk-full issues often come from `/var`
* `/var` is monitored closely in production

Applications write changing data here, not in `/etc`.

---

## `/tmp`: temporary means temporary

John creates a file:

```bash
touch /tmp/test.tmp
```

It works.
But after a reboot, the file is gone.

This teaches an important rule:

> `/tmp` is for short-lived files only.

System cleanups and reboots can wipe it at any time.

---

## `/opt`: where applications belong

John earlier placed his app in `/opt/my_app`.

Now he understands why.

`/opt` exists for:

* optional software
* third-party applications
* custom deployments

This keeps applications separate from:

* OS binaries (`/bin`)
* configs (`/etc`)
* logs (`/var/log`)

In production systems, this separation prevents accidental overwrites during OS upgrades.

---

## `/usr`: OS-installed software

John installs a package:

```bash
yum install python3
```

He checks:

```bash
which python3
```

Output:

```text
/usr/bin/python3
```

This tells him:

* `/usr` holds OS-managed software
* package managers control this space
* admins should not manually edit files here

---

## Why this layout matters in real systems

Later, John joins a production incident call.

The service is down.

The team asks:

* “Check logs” → `/var/log`
* “Check config” → `/etc`
* “Check app binaries” → `/opt`
* “Check user scripts” → `/home`

No guessing. Everyone knows where to look.

That is the real value of the filesystem layout.

---

## John’s final mental model

John now thinks about Linux like this:

* `/home` → humans
* `/root` → superuser
* `/bin`, `/sbin` → core commands
* `/etc` → configuration
* `/var` → changing data
* `/opt` → applications
* `/tmp` → temporary files
* `/usr` → OS-managed software

Linux did not choose this structure randomly.
It chose it so **humans and automation could work together without confusion**.

---

## Final takeaway

Understanding the Linux filesystem is not about memorizing directories.
It is about knowing **where responsibility lives**.

Once John understands this, production systems stop feeling chaotic and start feeling organized.
