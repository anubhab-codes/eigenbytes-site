# Linux Filesystem

The Linux filesystem is a map of system state and configuration.

## Core folders

- `/etc` ? configuration files.
- `/var` ? changing data like logs.
- `/home` ? user files.
- `/proc` ? process and kernel information.

## Example inspection

```bash
cat /etc/os-release
```

Expected result:

```text
NAME="Ubuntu"
VERSION="22.04 LTS (Jammy Jellyfish)"
```

This tells you the operating system before you install packages or use distro-specific commands.

## Mental model

Think of the filesystem as a structured database. The directories organize what changes often and what stays stable.
