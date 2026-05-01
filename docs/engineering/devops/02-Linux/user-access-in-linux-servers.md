---
layout: post
title: "User Management in Linux Servers"
subtitle: "Access in Linux Servers"
categories: [devops]
tags: [devops]
topic: linux
---

# How Linux Server Access Is Set Up in Enterprises

When an enterprise sets up its first Linux server, access control usually starts in the simplest possible way. The server runs Red Hat Enterprise Linux, the `root` user exists, and an administrator logs in directly to perform all tasks. At this stage, nothing feels wrong because only one person is using the system.

---

## John joins the company

John joins the company as an application developer. To work on his application, he needs access to the Linux server. John raises an access request using the company’s access management tool, such as SailPoint, Saviynt, or an in-house system.

The Linux administrator creates a local user account for John and sets a password.

```bash
useradd -m john
passwd john
```

This updates the standard Linux account files: `/etc/passwd` stores the user entry, `/etc/shadow` stores the password hash, and `/etc/group` records group membership. John is given the server address, a username, and a temporary password. He can now log in using SSH.

```bash
ssh john@server
```

John can access his home directory, but he cannot read system directories such as `/root`. This is expected and correct.

---

## The first mistake: giving everyone sudo

Very soon, John needs to start the application, run scripts, and check logs. The quickest solution seems to be adding John to sudo.

```bash
usermod -aG wheel john
```

Now John can become root using `sudo`. This works, but it introduces a serious problem. John is no longer just an application developer; he now has full control of the operating system. When a second developer joins, the same access is given again. At this point, multiple developers can act as root, and the server becomes fragile and unsafe.

---

## Introducing an application service account

The first real application is deployed, and a new question appears: who should own the application and run it? The answer is neither a human user nor root. Applications should run under their own service accounts.

The administrator creates a dedicated application user.

```bash
useradd -r -m -d /opt/app -s /sbin/nologin appsvc
passwd -l appsvc
```

This account exists only to run the application. No one logs in as this user. Application files and logs are owned by `appsvc`, which cleanly separates application activity from human activity.

---

## Giving developers the right access

Developers like John need to manage the application, but they do not need root access. This is solved by using groups and sudo rules instead of direct privileges.

A group is created for application administrators, and developers are added to it.

```bash
groupadd app-admin
usermod -aG app-admin john
```

A sudo rule is then defined.

File: `/etc/sudoers.d/app-admin`

```text
%app-admin ALL=(appsvc) ALL
```

Now John can run application commands as the application user without becoming root.

```bash
sudo -u appsvc ./start.sh
```

The boundary is clear: developers manage the application, and the operating system remains protected.

---

## Production servers and operations access

When a production server is introduced, an operations team is responsible for system stability. These users need higher privileges than developers, but they still should not log in as root.

An operations group is created, and sudo access is granted through that group.

```bash
groupadd linux-admin
usermod -aG linux-admin ops1
```

File: `/etc/sudoers.d/linux-admin`

```text
%linux-admin ALL=(ALL) ALL
```

At the same time, direct root login is disabled in `/etc/ssh/sshd_config`. Root exists, but it is accessed only through sudo, ensuring every action is logged.

---

## Scaling the model

As the company grows, manually creating users on every server becomes unmanageable. At this point, the enterprise integrates Linux servers with a central directory such as LDAP or Active Directory and connects it to an IGA tool.

Linux no longer manages users directly. It trusts directory users and groups, configured through files like `/etc/sssd/sssd.conf` and `/etc/nsswitch.conf`. Access is now granted by adding a user to the correct group in the directory, and the change applies consistently across all servers.

---

## Final state

In the final, stable setup, people log in using personal accounts, applications run as service users, and root access is available only through sudo. Groups define what users can do, and all access is auditable through logs such as `/var/log/secure` and `journalctl`.

This structure exists because enterprises had to move from “just give root” to a model that scales safely, supports audits, and clearly separates human access from application execution.

---
