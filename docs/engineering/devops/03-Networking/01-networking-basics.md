---
title: Networking Basics
sidebar_position: 2
description: "How machines communicate — IP addresses, interfaces, routing, and how to diagnose connectivity"
---

# Networking Basics

Your app can't reach the database. The database can't reach the cache. A request is going to the wrong server.

Networking problems are some of the most common failures in production, and most engineers try to fix them without understanding what's actually happening. This page builds the mental model so you can reason about connectivity instead of guessing.

---

## IP addresses and interfaces

Every machine on a network has at least one network interface. Each interface has an IP address. The IP address is how other machines reach you.

```bash
# View all interfaces and their addresses
ip addr show
ip a                          # shorthand

# View a specific interface
ip addr show eth0
```

Output:
```
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP>
    inet 192.168.1.10/24 brd 192.168.1.255 scope global eth0
```

`192.168.1.10` is the IP address. `/24` is the subnet mask — it means the first 24 bits identify the network, so this machine is on the `192.168.1.0` network.

---

## Routing

When your machine sends a packet, it needs to know where to send it. It checks the routing table.

```bash
# View the routing table
ip route show
ip r                          # shorthand
```

Output:
```
default via 192.168.1.1 dev eth0       # default gateway — send unknown traffic here
192.168.1.0/24 dev eth0                # this network — deliver directly
```

Packets destined for `192.168.1.x` are delivered directly. Everything else goes to the gateway (`192.168.1.1`), which decides the next hop.

---

## Hands-on

### Test connectivity

```bash
# Is a host reachable?
ping 8.8.8.8                  # Google DNS — tests internet access
ping 192.168.1.1              # test gateway
ping -c 4 8.8.8.8             # 4 packets then stop

# Trace the path packets take
traceroute 8.8.8.8
tracepath 8.8.8.8             # no root needed
```

### Check if a service is reachable

```bash
# Test a specific port (TCP)
nc -zv 192.168.1.10 80        # is port 80 open?
nc -zv google.com 443         # is port 443 open?

# Quick HTTP check
curl -I http://192.168.1.10   # HTTP headers only
```

`nc -zv` output on success:
```
Connection to 192.168.1.10 80 port [tcp/http] succeeded!
```

### Diagnose a connectivity problem

```bash
# Step 1: Can I reach myself?
ping 127.0.0.1                # loopback — always works if networking is up

# Step 2: Can I reach my gateway?
ip route show | grep default
ping <gateway-ip>

# Step 3: Can I reach a public IP?
ping 8.8.8.8

# Step 4: Can I resolve DNS?
nslookup google.com
dig google.com

# If Step 3 works but Step 4 fails, it's a DNS issue.
# If Step 2 fails, your gateway or interface is down.
# If Step 1 fails, network stack is broken.
```

### View active connections

```bash
# All established TCP connections
ss -tnp

# All listening ports
ss -tlnp

# Connections to a specific host
ss -tnp | grep 192.168.1.10
```

---

## Quick reference

```bash
ip addr show                  # network interfaces and IPs
ip route show                 # routing table
ping <host>                   # test reachability
traceroute <host>             # trace path
nc -zv <host> <port>          # test port connectivity
ss -tlnp                      # listening ports
ss -tnp                       # active connections
curl -I http://<host>         # test HTTP
```
