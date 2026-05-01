---
title: Networking Basics
toc:
  max_depth: 2
---

# Networking Basics
## Switching, routing, and gateways (one idea at a time)

John now has multiple Linux systems.  
They all work individually, but real systems are useless unless they can talk to each other.

This page explains **how communication works**, step by step, without skipping logic.

---

## Switch (how two systems meet)

Two systems talk to each other by being part of the **same network**.

A **switch** creates that network between systems.

John connects:
- System A
- System B

to the same switch.

At this point, the switch only knows **how to pass packets**, not **who is who**.

---

## Network interface (how a system connects)

To connect to a switch, each system needs a **network interface**.

John checks available interfaces:

```bash
ip link
````

He sees:

```text
eth0
```

This interface represents the physical or virtual connection to the switch.

No interface means no network connectivity.

---

## IP address (identity on the network)

A switch alone is not enough.
Each system needs an **IP address**.

John chooses a network:

```
192.168.1.0/24
```

He assigns IPs.

### System A

```bash
ip addr add 192.168.1.10/24 dev eth0
```

### System B

```bash
ip addr add 192.168.1.11/24 dev eth0
```

Now:

* Both systems are on the same network
* Each has a unique identity
* They can talk to each other

---

## Route (how Linux decides where to send packets)

Linux does not guess.
It uses a **routing table**.

John checks it:

```bash
route
```

This shows the **kernel IP routing table**.

Every outgoing packet is matched against this table to decide:

* Where to send it
* Through which interface

If no route matches, the packet is dropped.

---

## Router (how networks talk to networks)

Now John has **two networks**:

```
192.168.1.0/24
192.168.2.0/24
```

A **router** connects networks.

A router is simply a system that:

* Has an IP in each network
* Can forward packets between them

Example router IPs:

* 192.168.1.11
* 192.168.2.11

---

## Gateway (how systems find the router)

The router is just another device.
How does a system know it should use it?

That device becomes the **gateway**.

A gateway is:

* The next hop for another network
* The “door” out of the current network

John adds a route:

```bash
ip route add 192.168.2.0/24 via 192.168.1.11
```

Meaning:

> “To reach 192.168.2.0, send packets to 192.168.1.11”

This must be added on every system that needs access to the other network.

---

## Default gateway (door to everything else)

The internet has **too many networks** to define routes for each.

So systems use a **default gateway**.

Default means:

* “If no route matches, send traffic here”

John adds:

```bash
ip route add default via 192.168.1.11
```

Now:

* Known networks use specific routes
* All other traffic goes to the gateway

This is how systems reach the internet.

---

## Linux as a router (packet forwarding)

John now wants his Linux system to act as a router.

By default, Linux **does not forward packets** between interfaces.

He checks:

```bash
cat /proc/sys/net/ipv4/ip_forward
```

Output:

```text
0
```

This means forwarding is disabled.

---

## Enabling forwarding (making Linux a router)

John enables forwarding temporarily:

```bash
echo 1 > /proc/sys/net/ipv4/ip_forward
```

To make it permanent, he updates:

```text
/etc/sysctl.conf
```

Adds:

```text
net.ipv4.ip_forward = 1
```

Applies it:

```bash
sysctl -p
```

Now Linux forwards packets between networks.

---

## What John understands now

* Switch connects systems in the same network
* Interfaces connect systems to the switch
* IP addresses identify systems
* Routes decide where packets go
* Gateways point to routers
* Default gateway handles unknown networks
* Linux can be a router, but only if forwarding is enabled

Networking works because **everything is explicit**.

---

## Quick cheat sheet

```bash
# Show interfaces
ip link

# Assign IP
ip addr add <ip>/<mask> dev <iface>

# Show routes
route

# Add route
ip route add <network> via <gateway>

# Add default gateway
ip route add default via <gateway>

# Enable forwarding
echo 1 > /proc/sys/net/ipv4/ip_forward
```
