---
title: Linux
sidebar_position: 2
description: "Linux command cheatsheet — filesystem, processes, networking, permissions, and system health"
---

# Linux Cheatsheet

---

## Explore the filesystem

```bash
pwd                            # show current directory (where am I?)
ls                             # list files in current directory
ls -la                         # list all files including hidden, with details
cd /path/to/dir                # go to a directory
cd ..                          # go up one level
cd ~                           # go to your home directory
find /etc -name "*.conf"       # find all .conf files under /etc
tree -L 2                      # show directory tree, 2 levels deep
du -sh /var/*                  # show disk size of each item in /var
du -sh * | sort -rh | head     # top 10 largest things in current directory
```

---

## View and search files

```bash
cat file.txt                   # print the whole file
less file.txt                  # scroll through a file (q to quit)
head -20 file.txt              # show first 20 lines
tail -20 file.txt              # show last 20 lines
tail -f /var/log/syslog        # watch a log file live as it grows

grep "error" file.txt          # find lines containing "error"
grep -r "timeout" /etc/        # search for "timeout" in all files under /etc
grep -i "error" file.txt       # case-insensitive search
grep -n "error" file.txt       # show line numbers too

wc -l file.txt                 # count number of lines in a file
```

---

## Manage files and directories

```bash
mkdir mydir                    # create a directory
mkdir -p a/b/c                 # create nested directories in one shot
cp file.txt /tmp/              # copy a file to /tmp
cp -r mydir/ /backup/          # copy a directory recursively
mv file.txt newname.txt        # rename a file
mv file.txt /tmp/              # move a file to /tmp
rm file.txt                    # delete a file
rm -rf mydir/                  # delete a directory and everything in it (careful)
ln -s /path/to/real /path/link # create a symlink
```

---

## Archive and compress

```bash
tar -czf archive.tar.gz dir/   # compress a directory into a .tar.gz
tar -xzf archive.tar.gz        # extract a .tar.gz archive
tar -tzf archive.tar.gz        # list contents of a .tar.gz without extracting
zip -r archive.zip dir/        # compress a directory into a .zip
unzip archive.zip              # extract a .zip
```

---

## Inspect processes

```bash
ps aux                         # list all running processes
ps aux | grep nginx            # find processes matching "nginx"
pgrep nginx                    # get PIDs of processes named nginx
top                            # live process monitor (CPU, memory) — q to quit
htop                           # nicer live monitor (if installed)

kill 1234                      # send stop signal to process with PID 1234
kill -9 1234                   # force-kill a process (use when kill alone fails)
pkill nginx                    # kill all processes named nginx
```

---

## Check system health

```bash
uptime                         # how long the system has been running + load average
df -h                          # show disk usage of all mounted filesystems
free -h                        # show RAM and swap usage
vmstat 1 5                     # CPU/memory stats, 5 samples every 1 second
iostat -x 1                    # disk I/O stats per second
dmesg | tail -20               # last 20 kernel messages (hardware errors, OOM)
```

---

## Manage services (systemd)

```bash
systemctl status nginx         # is this service running?
systemctl start nginx          # start a service
systemctl stop nginx           # stop a service
systemctl restart nginx        # stop then start
systemctl reload nginx         # reload config without full restart
systemctl enable nginx         # start this service automatically on boot
systemctl disable nginx        # remove from autostart

journalctl -u nginx -n 50      # last 50 log lines for nginx
journalctl -u nginx -f         # follow nginx logs live
journalctl -u nginx --since "10 minutes ago"   # logs from last 10 minutes
journalctl -b                  # all logs from current boot
```

---

## Users and permissions

```bash
whoami                         # show current user
id                             # show current user + groups
sudo command                   # run a command as root
su - username                  # switch to another user

chmod 644 file.txt             # owner: read+write, everyone else: read only
chmod 755 script.sh            # owner: full, everyone else: read+execute
chmod +x script.sh             # make a file executable
chown user:group file.txt      # change owner and group of a file
chown -R user:group dir/       # change ownership recursively

useradd username               # create a new user
passwd username                # set a password for a user
usermod -aG docker username    # add a user to the docker group
```

---

## Network and connectivity

```bash
ping google.com                # test if a host is reachable
curl -I https://example.com    # fetch just the HTTP headers
curl -o file.zip https://...   # download a file
wget https://example.com/file  # download a file (alternative to curl)

ss -tlnp                       # show all listening TCP ports and which process owns them
netstat -tlnp                  # same (older command, may need net-tools)
lsof -i :8080                  # what process is using port 8080?

dig example.com                # DNS lookup — what IP does this domain resolve to?
nslookup example.com           # alternative DNS lookup
ip addr                        # show network interfaces and their IPs
ip route                       # show routing table
```

---

## Text processing (quick transforms)

```bash
cat file.txt | sort            # sort lines alphabetically
cat file.txt | sort -r         # sort in reverse
cat file.txt | uniq            # remove duplicate consecutive lines
cut -d',' -f1 file.csv         # get the first column from a CSV

# replace "old" with "new" in a file (in-place)
sed -i 's/old/new/g' file.txt

# print the 3rd field from a space-delimited line
echo "a b c" | awk '{print $3}'
```

---

## Shortcuts worth remembering

| Shortcut | What it does |
|---|---|
| `Ctrl+C` | Kill the running command |
| `Ctrl+Z` | Pause (suspend) the running command |
| `Ctrl+D` | End of input / logout of shell |
| `Ctrl+L` | Clear the terminal screen |
| `!!` | Re-run the last command |
| `!$` | Last argument of the previous command |
| `Tab` | Autocomplete file or command name |
| `Up arrow` | Scroll through command history |
| `history` | Show all previous commands |
| `history | grep ssh` | Find past SSH commands |
