---
title: DNS Basics
toc:
  max_depth: 2
---

# DNS Basics
## How names become IP addresses

John now has machines talking to each other across networks.  
Networking works.

But there is still a problem.

Communicating using **IP addresses** is painful.  
IPs are hard to remember and do not explain what a machine actually does.

This is where **DNS** comes in.

---

## The problem (why DNS exists)

John has a database server with this IP:

```

192.168.1.1

```

He can reach it, but:

- The IP does not say what the machine is
- Humans do not remember IPs easily
- IPs can change

John wants to say:
> “Connect to the database server”

not:
> “Connect to 192.168.1.1”

---

## Name resolution (the basic idea)

**Name resolution** means:
> Converting a name into an IP address

Example:
```

db  →  192.168.1.1

````

Linux always performs name resolution before connecting to a host.

---

## `/etc/hosts` (local name resolution)

John starts with the simplest method.

He edits:

```bash
/etc/hosts
````

Adds:

```text
192.168.1.1 db
```

Now he runs:

```bash
ping db
```

It works.

Linux replaced `db` with `192.168.1.1`.

---

## Why `/etc/hosts` does not scale

`/etc/hosts` works, but it has serious limitations.

* It is **local** to one system
* Another system may use a different name for the same IP
* IP changes require updating every machine
* Wrong entries can silently break communication

This approach works only for:

* Very small setups
* Temporary test systems

For large environments, this **does not scale**.

---

## DNS server (central source of truth)

Instead of every machine maintaining its own mapping, John introduces a **DNS server**.

Now:

* One system stores name → IP mappings
* All hosts query it
* Changes are made in one place

This becomes the **source of truth**.

---

## `/etc/resolv.conf` (where Linux looks for DNS)

Each Linux host must know **which DNS server to ask**.

John checks:

```bash
cat /etc/resolv.conf
```

He adds:

```text
nameserver 192.168.1.53
```

Now:

* Every hostname lookup goes to the DNS server
* `/etc/hosts` is no longer the only source

---

## Local override still exists

Even with DNS configured, `/etc/hosts` still works.

John can add temporary entries:

```text
192.168.1.100 temp-db
```

No DNS change required.

This is useful for:

* Testing
* Temporary servers
* Debugging

---

## Resolution order (who is asked first)

Linux follows an **order** when resolving names.

That order is defined in:

```bash
/etc/nsswitch.conf
```

John checks the `hosts` line:

```text
hosts: files dns
```

Meaning:

1. Check `/etc/hosts`
2. If not found, query DNS

This order can be changed, but the default is sensible.

---

## DNS for the internet

Internal DNS servers cannot resolve internet domains by themselves.

To fix this, John configures DNS forwarding.

The DNS server forwards unknown requests to public DNS servers like:

```
8.8.8.8
8.8.4.4
```

Now:

* Internal names resolve internally
* External names resolve via the internet

---

## Domain names (how names are structured)

DNS names are hierarchical.

Example:

```
apps.google.com
```

Breakdown:

* `.com` → top-level domain
* `google` → domain
* `apps` → subdomain

Other top-level domains:

* `.com` → commercial
* `.net` → network
* `.org` → organization
* `.edu` → education
* `.io` → Indian Ocean territory (popular in tech)

---

## How DNS resolution actually happens

When John accesses:

```
apps.google.com
```

Resolution flow:

1. Organization DNS checks cache
2. If not found, asks root DNS
3. Root DNS points to `.com` DNS
4. `.com` DNS points to Google DNS
5. Google DNS returns IP for `apps.google.com`

The result is cached so the next request is faster.

---

## Search domains (short names inside organizations)

Inside John’s company, the database server is named:

```
db.mycompany.com
```

John wants to type:

```bash
ping db
```

Linux supports this using **search domains**.

In `/etc/resolv.conf`:

```text
search mycompany.com
```

Now:

* `db` automatically expands to `db.mycompany.com`
* Multiple search domains can be configured

---

## DNS record types (what DNS stores)

DNS does not store just one type of record.

### A record

Maps hostname to IPv4 address.

```
db.mycompany.com → 192.168.1.1
```

---

### AAAA record

Maps hostname to IPv6 address.

```
db.mycompany.com → fe80::1
```

---

### CNAME record

Creates an alias.

```
web.mycompany.com → app.mycompany.com
```

Used when:

* One service has multiple names
* Backends change, names do not

---

## Testing DNS resolution

John tests DNS directly.

### `nslookup`

```bash
nslookup db.mycompany.com
```

This queries DNS servers directly.
It **ignores `/etc/hosts`**.

---

### `dig`

```bash
dig db.mycompany.com
```

This provides:

* Full DNS response
* Useful debugging details

Preferred tool for troubleshooting.

---

## What John understands now

* IPs are hard to use directly
* Name resolution converts names to IPs
* `/etc/hosts` is local and limited
* DNS is centralized and scalable
* Resolution order matters
* DNS caching improves performance
* Search domains simplify internal usage

DNS works because **everyone agrees on where truth lives**.

---

## Quick cheat sheet

```bash
# Local name mapping
/etc/hosts

# DNS server config
/etc/resolv.conf

# Resolution order
/etc/nsswitch.conf

# Test DNS
nslookup hostname
dig hostname
```
