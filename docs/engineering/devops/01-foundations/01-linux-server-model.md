---
title: Linux Server Model
sidebar_position: 2
description: "How a Linux server is organized — the filesystem, processes, services, and the OS primitives containers are built on"
---

# Linux Server Model

You SSH into a production server. The app is down. You have a terminal prompt and nothing else.

Where are the config files? What processes are running? Why is the disk full? How do you restart the service?

Every DevOps engineer encounters this situation. This page builds the mental model you need to navigate it.

---

## Everything is a file

Linux organizes the entire system — hardware, processes, network interfaces, configuration — as files in a single directory tree. There is no `C:\` drive, no registry. One tree, everything in it.

The tree follows the Filesystem Hierarchy Standard. Every directory exists for a reason.

```
/
├── etc/          ← system and application config
├── var/
│   └── log/      ← log files
├── home/         ← user home directories
├── root/         ← root user home
├── bin/          ← essential executables
├── usr/bin/      ← user programs
├── sbin/         ← admin executables (require root)
├── tmp/          ← temporary files (cleared on reboot)
├── opt/          ← third-party software
└── proc/         ← virtual: live kernel and process data
```

The rule: **config lives in `/etc`**, **logs live in `/var/log`**, **programs live in `/usr/bin`**.

---

## Processes

Every running program is a process. Each has a unique PID. Processes form a tree — every process has a parent. PID 1 is `systemd`, the init system. Everything else is a child of it.

```bash
# All running processes
ps aux

# Interactive process viewer (press q to quit)
top

# Process tree showing parent-child relationships
pstree -p

# Find a specific process
pgrep -a nginx
ps aux | grep nginx
```

Processes consume CPU and memory. When a server is slow, the first thing you do is look at what is consuming resources.

```bash
# Sorted by memory usage
ps aux --sort=-%mem | head -10

# Sorted by CPU usage
ps aux --sort=-%cpu | head -10
```

---

## Services (systemd)

On modern Linux systems, every long-running process is managed by systemd. It starts processes, restarts them on failure, and logs their output.

```bash
# Is nginx running?
systemctl status nginx

# Start, stop, restart
systemctl start nginx
systemctl stop nginx
systemctl restart nginx

# Reload config without restart
systemctl reload nginx

# Start automatically on boot
systemctl enable nginx
systemctl disable nginx

# List all running services
systemctl list-units --type=service --state=running
```

Service logs go to the system journal. `journalctl` reads them.

```bash
# Last 50 lines from nginx
journalctl -u nginx -n 50

# Follow nginx logs live
journalctl -u nginx -f

# Logs since midnight
journalctl -u nginx --since today

# Logs from previous boot (when debugging crash on startup)
journalctl -u nginx -b -1
```

---

## The filesystem in practice

```bash
# Navigate
pwd                           # where am I?
ls -la /etc                   # list with permissions, owner, size
cd /var/log && ls -la         # change and list
find /etc -name "*.conf"      # find config files
find /var -size +100M         # find large files

# View file content
cat /etc/os-release           # what OS is this?
less /var/log/syslog          # paginated view (q to quit)
tail -f /var/log/syslog       # follow live
grep -i "error" /var/log/syslog | tail -20

# Disk usage
df -h                         # disk space per filesystem
du -sh /var/log/*             # what is consuming space in /var/log
```

---

## Signals: how you talk to processes

Signals are messages the OS sends to processes. SIGTERM asks a process to stop cleanly. SIGKILL forces it to stop immediately.

Always try SIGTERM first. SIGKILL leaves no chance for cleanup — open files may not flush, connections may not drain.

```bash
# Graceful stop
kill <PID>            # SIGTERM (default)
kill -15 <PID>        # explicit SIGTERM

# Force stop (last resort)
kill -9 <PID>         # SIGKILL — cannot be caught or ignored

# Reload config (many daemons handle this)
kill -HUP <PID>

# By name
pkill nginx           # SIGTERM to all nginx processes
pkill -9 nginx        # SIGKILL all nginx processes
```

---

## Hands-on: investigate a running server

Run these on any Linux machine (including inside a Docker container: `docker run -it ubuntu bash`).

```bash
# 1. What OS is this?
cat /etc/os-release

# 2. Who is running?
ps aux | head -15

# 3. What is using the most memory?
ps aux --sort=-%mem | head -5

# 4. What services are active?
systemctl list-units --type=service --state=running | head -10

# 5. What is in the logs right now?
journalctl -n 30

# 6. Is the disk full?
df -h

# 7. What is using the most space in /var?
du -sh /var/* 2>/dev/null | sort -rh | head -5

# 8. Start a background process and observe it
sleep 300 &
pgrep sleep            # find its PID
ps aux | grep sleep    # see its entry
kill $(pgrep sleep)    # stop it
```

---

## Quick reference

```bash
# Filesystem
ls -la <dir>                  # list with details
find /etc -name "*.conf"      # find files
tail -f /var/log/syslog       # follow log
df -h                         # disk space
du -sh <dir>                  # directory size

# Processes
ps aux                        # all processes
ps aux --sort=-%mem | head    # top memory consumers
pgrep -a <name>               # find PID by name
kill <PID>                    # graceful stop
kill -9 <PID>                 # force stop

# Services
systemctl status <svc>        # check
systemctl start/stop <svc>    # control
systemctl enable <svc>        # start on boot
journalctl -u <svc> -f        # follow logs
```
