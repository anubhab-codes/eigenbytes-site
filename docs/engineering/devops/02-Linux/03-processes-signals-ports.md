---
title: Processes, Signals, and Ports
sidebar_position: 4
description: "What is running, how to control it, and what it is listening on"
---

# Processes, Signals, and Ports

Something is using port 8080. Your app won't start because something else already has it. Or a process is hung and not responding to Ctrl+C. Or you need to kill the right process without taking down the wrong one.

These three concepts — processes, signals, and ports — are how Linux manages running programs. Know them and you can find anything running on a server and control it.

---

## Processes

Every running program is a process with a unique PID (process ID). Processes are organized in a tree: every process has a parent. The root of the tree is PID 1 — `systemd` on modern Linux systems.

```bash
# All running processes
ps aux

# Interactive process viewer (q to exit)
top

# Better interactive viewer
htop        # may need to install: apt install htop

# Process tree — see parent-child relationships
pstree -p
```

`ps aux` output:
```
USER       PID  %CPU  %MEM  COMMAND
root         1   0.0   0.1  /lib/systemd/systemd
root       812   0.0   0.2  /usr/sbin/sshd
ubuntu    4502   0.1   0.5  nginx: master process
```

Find a specific process:

```bash
ps aux | grep nginx
pgrep nginx           # just the PID
pgrep -a nginx        # PID + full command
```

---

## Signals

A signal is a message the OS sends to a process. Most processes handle signals to start graceful shutdown or reload config.

| Signal | Number | Meaning |
|--------|--------|---------|
| SIGTERM | 15 | Please shut down cleanly |
| SIGKILL | 9 | Terminate immediately — cannot be caught or ignored |
| SIGHUP | 1 | Reload config (many daemons respond to this) |

Always try SIGTERM first. SIGKILL is the last resort — it leaves no chance for cleanup, open files flushing, or connection draining.

```bash
# Graceful stop
kill <PID>                   # sends SIGTERM by default
kill -15 <PID>               # explicit SIGTERM

# Force kill
kill -9 <PID>                # SIGKILL

# Kill by name
pkill nginx                  # sends SIGTERM to all nginx processes
pkill -9 nginx               # SIGKILL all nginx processes

# Reload config without restart
kill -HUP <PID>
```

---

## Ports

A port is a number the kernel uses to route incoming network traffic to the right process. A process **binds** to a port — it registers ownership of that port with the kernel.

Ports 1–1023 are privileged — only root can bind to them. Ports 1024–65535 are unprivileged — any user can bind to them.

Common ports:
| Port | Service |
|------|---------|
| 22 | SSH |
| 80 | HTTP |
| 443 | HTTPS |
| 3306 | MySQL |
| 5432 | PostgreSQL |
| 6379 | Redis |

---

## Hands-on

### Find what is running and on which port

```bash
# Show all listening TCP ports and which process owns them
ss -tlnp

# Same but with UDP
ss -ulnp

# Old-school equivalent
netstat -tlnp          # if netstat is installed

# Find what is on port 8080
ss -tlnp | grep :8080
lsof -i :8080          # shows PID + process name
```

### Start an HTTP server and observe it

```bash
# Start a Python HTTP server on port 8080
python3 -m http.server 8080 &

# Find its PID
pgrep -a python3

# Confirm it is listening
ss -tlnp | grep 8080

# Check what else is on the same port (should be empty)
lsof -i :8080
```

Expected output from `ss -tlnp | grep 8080`:
```
LISTEN  0  5  *:8080  *:*  users:(("python3",pid=4892,fd=3))
```

### Stop the process

```bash
# Graceful stop
kill $(pgrep python3)

# Confirm it stopped
ss -tlnp | grep 8080    # should be empty
```

### Investigate a stuck process

```bash
# See all processes by memory usage
ps aux --sort=-%mem | head -10

# See all processes by CPU usage
ps aux --sort=-%cpu | head -10

# Detailed info about a specific PID
cat /proc/<PID>/status | head -20
ls -la /proc/<PID>/fd/   # open file descriptors
```

---

## Quick reference

```bash
ps aux                       # all processes
ps aux | grep <name>         # find process
pgrep <name>                 # PID of named process
top / htop                   # interactive viewer

kill <PID>                   # graceful stop
kill -9 <PID>                # force kill
pkill <name>                 # kill by name

ss -tlnp                     # listening TCP ports
lsof -i :<port>              # what is on a port
```
