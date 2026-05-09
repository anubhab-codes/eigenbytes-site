---
title: Essential Commands
sidebar_position: 3
description: "The Linux commands you will use every day — files, permissions, packages, services"
---

# Essential Commands

Linux rewards people who know the tools. Most DevOps work on a server comes down to a small set of commands used repeatedly. Learn these and you can operate any Linux system.

---

## File operations

```bash
# Create files and directories
touch config.txt
mkdir -p app/config/env

# Copy, move, delete
cp config.txt config.bak
mv config.txt /etc/app/config.txt
rm config.txt
rm -rf old-directory/       # force delete directory

# View file content
cat /etc/os-release          # full file
less /var/log/syslog         # paginated view (q to exit)
head -20 access.log          # first 20 lines
tail -20 access.log          # last 20 lines
tail -f access.log           # follow live updates
```

## Searching

```bash
# Search file content
grep "ERROR" app.log
grep -r "database" /etc/     # recursive
grep -i "error" app.log      # case insensitive
grep -n "error" app.log      # show line numbers

# Find files by name
find /var/log -name "*.log"
find /etc -name "nginx.conf" -type f

# Find files by size
find /var -size +100M

# Find and act on results
find /tmp -name "*.tmp" -delete
```

## Permissions

Every file has an owner (user + group) and three permission sets: owner, group, everyone.

```
-rw-r--r--  1  ubuntu  ubuntu  4096  May 9  config.txt
```

Read this as: `owner=rw`, `group=r`, `others=r`.

```bash
# Change owner
chown ubuntu:ubuntu config.txt
chown -R ubuntu:ubuntu /app/   # recursive

# Change permissions
chmod 644 config.txt           # owner=rw, group=r, others=r
chmod 755 start.sh             # owner=rwx, group=rx, others=rx
chmod +x start.sh              # add execute for all

# View current permissions
ls -la
stat config.txt
```

Common patterns:
- `644` — config files (readable by all, writable by owner)
- `755` — scripts and directories
- `600` — private keys (owner only)

## Packages

```bash
# Debian/Ubuntu
apt update                        # update package index
apt install nginx                 # install
apt remove nginx                  # remove
apt list --installed | grep nginx # check if installed

# RHEL/CentOS
yum install nginx                 # install
yum remove nginx                  # remove
rpm -qa | grep nginx              # check if installed
```

## Services (systemd)

Every long-running process on a modern Linux server is managed by systemd.

```bash
# Check service status
systemctl status nginx

# Start, stop, restart
systemctl start nginx
systemctl stop nginx
systemctl restart nginx
systemctl reload nginx      # reload config without full restart

# Enable to start on boot
systemctl enable nginx
systemctl disable nginx

# View all running services
systemctl list-units --type=service --state=running

# View service logs
journalctl -u nginx -n 50         # last 50 lines
journalctl -u nginx -f            # follow live
journalctl -u nginx --since today
```

---

## Hands-on

### File operations practice

```bash
# Create a working directory
mkdir ~/practice && cd ~/practice

# Create and populate files
echo "line one" > file1.txt
echo "line two" >> file1.txt       # append
cat file1.txt

# Make a copy and compare
cp file1.txt file2.txt
diff file1.txt file2.txt

# Search in files
grep "line" file1.txt
grep -n "one" file1.txt
```

### Permissions exercise

```bash
# Create a script
echo '#!/bin/bash
echo "Hello from script"' > hello.sh

# Try to run it — fails
./hello.sh    # Permission denied

# Add execute permission
chmod +x hello.sh
./hello.sh    # Works

# Check current permissions
ls -la hello.sh
# -rwxr-xr-x  1  you  you  hello.sh
```

### Service investigation

```bash
# Is ssh running?
systemctl status sshd

# What services are enabled at boot?
systemctl list-unit-files --type=service --state=enabled | head -20

# Check what port a service is listening on
ss -tlnp | grep sshd
```

---

## Cleanup

```bash
rm -rf ~/practice
```

---

## Quick reference

```bash
# Files
cat / less / head / tail          # view content
grep "pattern" file               # search content
find /path -name "*.conf"         # find files

# Permissions
chmod 755 file                    # set permissions
chown user:group file             # set owner
ls -la                            # view permissions

# Packages
apt install / remove <pkg>        # Debian/Ubuntu
yum install / remove <pkg>        # RHEL

# Services
systemctl status <svc>            # check
systemctl start / stop <svc>      # control
journalctl -u <svc> -f            # follow logs
```
