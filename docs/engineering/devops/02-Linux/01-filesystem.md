---
title: The Filesystem
sidebar_position: 2
description: "Where everything lives on a Linux server — directory layout, navigation, and finding what you need"
---

# The Filesystem

You SSH into a production server. An app is broken. You need to find the config file. You need to check the logs. You need to see what is installed.

On Linux, everything is a file. There is a defined layout, and if you know the layout you always know where to look.

---

## The layout

Linux follows the Filesystem Hierarchy Standard. Every directory has a purpose.

| Directory | What lives there |
|-----------|-----------------|
| `/etc` | System and application config files |
| `/var/log` | Log files |
| `/home/<user>` | User home directories |
| `/root` | Root user's home |
| `/bin`, `/usr/bin` | Executable programs |
| `/sbin`, `/usr/sbin` | Admin executables (require root) |
| `/tmp` | Temporary files — cleared on reboot |
| `/opt` | Third-party software installed outside the package manager |
| `/proc` | Virtual filesystem — live kernel and process info |

The rule: **config is in `/etc`**, **logs are in `/var/log`**, **programs are in `/usr/bin`**.

---

## Hands-on

### Navigate the filesystem

```bash
# Where am I?
pwd

# What is at the root?
ls /

# Long format — permissions, owner, size, timestamp
ls -la /etc

# Change directory
cd /var/log

# Go back one level
cd ..

# Return home
cd ~
```

### Find config files

```bash
# List nginx config (if installed)
ls /etc/nginx/

# View SSH server config
cat /etc/ssh/sshd_config | head -30

# Find all .conf files under /etc
find /etc -name "*.conf" -type f | head -20

# Files in /etc modified in the last day
find /etc -mtime -1 -type f
```

### Explore logs

```bash
# What logs exist?
ls /var/log/

# Last 50 lines of syslog
tail -50 /var/log/syslog

# Follow a log in real time
tail -f /var/log/syslog

# Search for errors
grep -i "error" /var/log/syslog | tail -20
```

### Check disk space

```bash
# Disk usage per filesystem
df -h

# What is consuming space in /var/log?
du -sh /var/log/*

# Largest files in current directory
find . -type f -printf '%s %p\n' | sort -rn | head -10
```

### Understand what is installed

```bash
# Where is a binary?
which nginx
which python3

# Full path + symlink resolution
type -a python3

# What package owns this file?
dpkg -S /usr/bin/curl        # Debian/Ubuntu
rpm -qf /usr/bin/curl        # RHEL/CentOS
```

---

## Quick reference

```bash
pwd                          # current directory
ls -la <dir>                 # list with details
cd <dir>                     # change directory
find /etc -name "*.conf"     # find config files
tail -f /var/log/syslog      # follow log live
grep "pattern" <file>        # search in file
df -h                        # disk space
du -sh <dir>                 # directory size
which <program>              # locate executable
```
