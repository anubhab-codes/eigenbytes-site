---
title: Access and Security
sidebar_position: 3
description: "Users, groups, file permissions, sudo, and SSH key authentication — controlling who can do what on a server"
---

# Access and Security

You need to give a teammate access to a production server. You could add them to root. You will not do that. Root can delete everything, install backdoors, and read every credential on the machine.

Linux access control is built around users, groups, file permissions, and sudo rules. The goal is the same everywhere: every person and every application has only the access it needs, and nothing more.

---

## Users and groups

Every process runs as a user. Every file has an owner. Access is enforced based on who you are.

Two kinds of users:
- **Human users** — people who SSH in (`ubuntu`, `alice`, `deploy`)
- **Service accounts** — created for applications, never log in interactively (`nginx`, `postgres`, `www-data`)

Groups let you assign permissions to multiple users at once.

```bash
# Who am I?
whoami
id                            # shows user ID, group IDs

# All users on the system
cat /etc/passwd               # format: username:x:uid:gid:comment:home:shell

# All groups
cat /etc/group

# What groups is alice in?
groups alice
```

---

## File permissions

Every file has three permission sets: **owner**, **group**, **everyone else**. Each set has read (r), write (w), and execute (x).

```
-rw-r--r--  1  ubuntu  ubuntu  4096  May 9  config.txt
```

Read this as: `owner=rw`, `group=r`, `others=r`. The first character is the type: `-` for file, `d` for directory.

```bash
# View permissions
ls -la

# Change permissions (numeric)
chmod 644 config.txt          # owner=rw, group=r, others=r
chmod 755 deploy.sh           # owner=rwx, group=rx, others=rx
chmod 600 id_rsa              # owner=rw only (required for SSH keys)

# Change permissions (symbolic)
chmod +x deploy.sh            # add execute for all
chmod o-r secrets.env         # remove read from others

# Change owner
chown ubuntu:ubuntu config.txt
chown -R deploy:deploy /app/  # recursive
```

Common patterns:
| Mode | Octal | Use case |
|------|-------|---------|
| `rw-r--r--` | 644 | Config files |
| `rwxr-xr-x` | 755 | Scripts, directories |
| `rw-------` | 600 | Private keys, secrets |
| `rwx------` | 700 | Private directories |

---

## Creating users

```bash
# Create a user with home directory and bash shell
useradd -m -s /bin/bash alice
passwd alice                  # set password

# Create a service account (no home, no login)
useradd --system --no-create-home --shell /bin/false appservice

# Add to a group
usermod -aG developers alice  # -a means append, not replace

# Delete user (keep home)
userdel alice

# Delete user and home directory
userdel -r alice
```

---

## sudo — controlled privilege escalation

`sudo` lets a user run specific commands as root without being root. The policy lives in `/etc/sudoers`. Always edit it with `visudo` — it validates syntax before saving. A typo in sudoers can lock you out.

```bash
sudo visudo
```

Common sudoers patterns:

```
# Alice can run any command as root (broad — use carefully)
alice ALL=(ALL:ALL) ALL

# Developers group can restart nginx
%developers ALL=(ALL) NOPASSWD: /bin/systemctl restart nginx

# deploy user can run deploy script without password prompt
deploy ALL=(ALL) NOPASSWD: /opt/scripts/deploy.sh
```

```bash
# Run a command as root
sudo systemctl restart nginx

# Run as a specific user
sudo -u postgres psql

# Switch to root shell
sudo -i
```

---

## SSH key authentication

Passwords for SSH are a bad idea. They can be brute-forced and they require someone to remember them. SSH keys are cryptographically strong and can be managed at scale.

**How it works:** You have a private key (never leaves your machine) and a public key (added to the server). The server challenges you to prove you hold the private key. You do. You're in.

```bash
# Generate a key pair (on your local machine)
ssh-keygen -t ed25519 -C "alice@company.com"
# Creates: ~/.ssh/id_ed25519 (private) and ~/.ssh/id_ed25519.pub (public)

# Copy your public key to a server
ssh-copy-id alice@192.168.1.10

# What this does: appends your public key to ~/.ssh/authorized_keys on the server

# Manual equivalent
cat ~/.ssh/id_ed25519.pub | ssh alice@192.168.1.10 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

# Connect
ssh alice@192.168.1.10

# Connect with a specific key
ssh -i ~/.ssh/deploy_key deploy@prod-server
```

Required permissions (SSH will refuse to work if these are wrong):

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

---

## Hands-on: access control walkthrough

```bash
# 1. Create a test user
sudo useradd -m -s /bin/bash testuser
sudo passwd testuser

# 2. Switch to that user
sudo su - testuser

# 3. Try to read a root-only file
cat /etc/shadow             # Permission denied — correct

# 4. Exit back to your user
exit

# 5. Create a group and shared directory
sudo groupadd webteam
sudo mkdir -p /var/www/myapp
sudo chown root:webteam /var/www/myapp
sudo chmod 775 /var/www/myapp

# 6. Add testuser to the group
sudo usermod -aG webteam testuser

# 7. Switch back to testuser (re-login for group to take effect)
sudo su - testuser
touch /var/www/myapp/index.html   # works
cat /etc/shadow                    # still blocked
exit

# 8. Cleanup
sudo userdel -r testuser
sudo groupdel webteam
sudo rm -rf /var/www/myapp
```

---

## Quick reference

```bash
whoami / id                       # current user and groups
useradd -m -s /bin/bash <user>    # create user
passwd <user>                     # set password
usermod -aG <group> <user>        # add to group
userdel -r <user>                 # delete user + home
groupadd <group>                  # create group
chown user:group <file>           # change ownership
chmod 755 <file>                  # set permissions
sudo visudo                       # edit sudoers safely
ssh-keygen -t ed25519             # generate SSH key pair
ssh-copy-id user@host             # install public key on server
```
