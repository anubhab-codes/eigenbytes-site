---
title: User Access
sidebar_position: 5
description: "Users, groups, sudo, and how to give people access without giving everyone root"
---

# User Access

You need to give a teammate access to a production server. You could add them to root. You won't do that, because then they can delete everything.

Access control on Linux is built around users, groups, and sudo rules. The goal: every person and every application has only the access it needs, and no more.

---

## Users and groups

Every process runs as a user. Every file has an owner. Permissions are enforced based on who you are.

There are two kinds of users:
- **Human users** — people who SSH in (`ubuntu`, `deploy`, `alice`)
- **Service accounts** — created for applications, never log in (`nginx`, `postgres`, `www-data`)

Groups let you assign the same permissions to multiple users. Add a user to a group and they inherit the group's access.

```bash
# Who am I?
whoami
id                           # full user + group info

# All users on the system
cat /etc/passwd

# All groups
cat /etc/group

# Groups for a specific user
groups alice
```

---

## Creating users

```bash
# Create a user with a home directory
useradd -m -s /bin/bash alice

# Set their password
passwd alice

# Create a service account (no home, no login shell)
useradd --system --no-create-home --shell /bin/false appservice

# Delete a user (keep home directory)
userdel alice

# Delete a user and their home directory
userdel -r alice
```

---

## Groups and permissions

```bash
# Create a group
groupadd developers

# Add a user to a group
usermod -aG developers alice   # -a means append, not replace

# Remove from a group
gpasswd -d alice developers

# Change file ownership
chown alice:developers /app/config.txt

# Make a directory writable by a group
chmod 775 /app/
chown root:developers /app/
```

---

## sudo — controlled privilege escalation

`sudo` lets a user run specific commands as root without being root. The policy is in `/etc/sudoers`.

Never edit `/etc/sudoers` directly. Use `visudo` — it validates syntax before saving.

```bash
# Allow alice to run any command as root
# In /etc/sudoers:
alice ALL=(ALL:ALL) ALL

# Allow developers group to restart nginx
%developers ALL=(ALL) /bin/systemctl restart nginx

# Allow a deploy user to run deploy scripts without a password
deploy ALL=(ALL) NOPASSWD: /opt/scripts/deploy.sh
```

```bash
# Run a command as root
sudo systemctl restart nginx

# Switch to root shell
sudo -i

# Run as a different user
sudo -u appservice /opt/app/start.sh
```

---

## Hands-on

### Create a user and test access

```bash
# Create a test user
sudo useradd -m -s /bin/bash testuser
sudo passwd testuser

# Switch to that user
sudo su - testuser

# Try to read a root-owned file
cat /etc/shadow         # Permission denied

# Exit back
exit
```

### Set up group-based access

```bash
# Create a group and directory
sudo groupadd webteam
sudo mkdir /var/www/myapp
sudo chown root:webteam /var/www/myapp
sudo chmod 775 /var/www/myapp

# Add testuser to the group
sudo usermod -aG webteam testuser

# Switch to testuser and test
sudo su - testuser
ls /var/www/myapp               # should work
touch /var/www/myapp/index.html # should work
cat /etc/shadow                 # still blocked
exit
```

### Grant limited sudo

```bash
# Open sudoers safely
sudo visudo

# Add this line to allow testuser to restart a service
# testuser ALL=(ALL) NOPASSWD: /bin/systemctl restart nginx

# Test it
sudo su - testuser
sudo systemctl restart nginx     # works
sudo systemctl stop nginx        # works
sudo cat /etc/shadow             # blocked (not in the rule)
exit
```

### Cleanup

```bash
sudo userdel -r testuser
sudo groupdel webteam
sudo rm -rf /var/www/myapp
```

---

## Quick reference

```bash
whoami / id                      # current user info
useradd -m -s /bin/bash <user>   # create user with home
passwd <user>                    # set password
usermod -aG <group> <user>       # add to group
userdel -r <user>                # delete user + home
groupadd <group>                 # create group
chown user:group <file>          # change ownership
sudo visudo                      # edit sudoers safely
sudo -u <user> <command>         # run as another user
```
