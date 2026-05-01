---
title: Docker Internals
toc:
  max_depth: 2
---

# Docker Internals (Namespaces, Cgroups, and Layers)

This article explains why containers behave the way they do.
You do not need kernel-level depth.
You need correct mental models.

---

## Container = process + isolation

A container is a normal Linux process.
Docker applies isolation features around it.

When the process stops, the container stops.

This explains:
- fast start/stop
- why logs are stdout/stderr
- why containers are not “servers”

---

## Namespaces (isolation)

Linux namespaces isolate what a process can see.

Namespaces Docker uses:

- PID namespace: process IDs look separate
- NET namespace: networking looks separate
- MNT namespace: filesystem mount points look separate
- UTS namespace: hostname looks separate
- IPC namespace: shared memory segments are separate
- USER namespace (optional): user IDs can be mapped

What students can observe:

```bash
docker run --rm -it alpine:latest sh
```

Inside container:

```sh
ps
hostname
ip a
exit
```

You will see:
- fewer processes
- different hostname
- different network interfaces

That is namespaces in action.

---

## Cgroups (resource control)

Namespaces isolate.
Cgroups limit.

Cgroups control:
- CPU usage
- memory usage
- IO limits

Example: limit memory to 100MB:

```bash
docker run --rm -m 100m alpine:latest sh -c 'echo hello'
```

If an app exceeds memory limit, it can be killed (OOM).
This is why memory limits matter in production.

---

## Image layers and copy-on-write

Images are built from layers.
Each layer is read-only.

A container adds a writable layer on top.
Changes go into the writable layer.

Diagram:

```
Container writable layer (changes)
└─ Image layers (read-only)
   ├─ Layer: app
   ├─ Layer: runtime
   └─ Layer: base OS
```

This is why containers are cheap.
Many containers can share the same image layers.

---

## Storage drivers (high level)

Docker uses a storage driver to manage layers.
Common on Linux: `overlay2`.

Check:

```bash
docker info | grep -i 'Storage Driver'
```

Sample output:
```text
Storage Driver: overlay2
```

You do not need deep driver details for normal usage.
Just remember: layers are shared and cached.

---

## Why Docker builds can be slow

Common reasons:
- big base image
- copying huge build context
- bad layer ordering (cache misses)
- installing packages after copying app (rebuilds too much)

Fix pattern:
- install dependencies first
- copy app last
- use `.dockerignore`

---

## `.dockerignore` (build context control)

Docker build sends a “context” to the engine.
If you send your whole repo, builds slow down.

Create `.dockerignore`:

```text
.git
node_modules
target
dist
*.log
```

Then rebuild.
Build becomes faster and images become smaller.

---

## Why internals matter

Internals explain Docker behavior:
- containers stop when the process stops
- file changes disappear without volumes
- networking is separate per container
- CPU/memory limits are enforceable

Docker is not magic.
It is Linux isolation packaged as a tool.
