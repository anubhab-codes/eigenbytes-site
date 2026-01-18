---
title: What is Docker?
toc:
  max_depth: 2
---

# Docker Introduction

Docker is a container runtime.
It runs applications in isolated environments called containers.

Docker solves a simple problem.
Apps break when environments differ.

Different machines have different:
- OS packages
- library versions
- configs
- runtime paths

Docker packages the app and its dependencies into an image.
You run the image as a container.
You get the same runtime behavior across machines.

---

## Docker vs Virtual Machines

A VM includes a full guest OS.
A container shares the host OS kernel.

VMs:
- boot a full OS
- are heavier
- start slower

Containers:
- run as isolated processes
- are lighter
- start fast

Diagram:

```
Virtual Machines
----------------
Hardware
└─ Host OS
   └─ Hypervisor
      ├─ VM1 (Guest OS + App)
      ├─ VM2 (Guest OS + App)
      └─ VM3 (Guest OS + App)

Containers
----------
Hardware
└─ Host OS (Kernel)
   └─ Container Runtime (Docker)
      ├─ Container1 (App + libs)
      ├─ Container2 (App + libs)
      └─ Container3 (App + libs)
```

Containers are not “mini VMs”.
They are processes with isolation.

---

## Image vs Container

Image:
- read-only template
- built once
- shared across machines

Container:
- running instance of an image
- has a small writable layer
- can be started/stopped/deleted

Diagram:

```
Image (read-only)
└─ Layers: base OS + runtime + app

Container (running)
└─ Image layers (read-only)
└─ Writable layer (container changes)
```

Key point:
- You build images.
- You run containers.

---

## Docker vs Kubernetes

Docker runs containers on one machine.
Kubernetes runs containers across many machines.

Docker answers:
- how to build an image
- how to run a container

Kubernetes answers:
- where to run it
- how many to run
- how to restart/scale
- how to do rolling updates

Learn Docker first.
Then Kubernetes becomes easier.

---

## Docker’s main moving parts

- Docker Engine: the background service that runs containers
- Docker CLI: the `docker` command you type
- Registry: where images are stored (Docker Hub, ECR, ACR, etc.)

Diagram:

```
You (CLI)  ->  Docker Engine  ->  Images/Containers
                      |
                      └-> Registry (pull/push images)
```

---

## Quick sanity checks

These commands confirm Docker is installed and reachable.

```bash
docker version
```

Sample output (short):
```text
Client: Docker Engine
 Version: 27.0.0

Server: Docker Engine
 Version: 27.0.0
```

```bash
docker info
```

Sample output (short):
```text
Server Version: 27.0.0
Containers: 0
Images: 0
Storage Driver: overlay2
```

If `docker version` shows both Client and Server, you are ready for hands-on.
