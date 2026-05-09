---
title: Setup Local Cluster
sidebar_position: 1
description: "Get a Kubernetes cluster running on your laptop using Docker Desktop"
---

# Setup Local Cluster

## Prerequisites

- Docker Desktop installed
- Windows, macOS, or Linux

---

## What you will build

A single-node Kubernetes cluster running on your laptop. By the end of this lab, `kubectl` will be connected and your node will show as `Ready`.

---

## Step 1 — Start Docker Desktop

**Why** — Kubernetes in this lab runs inside Docker Desktop. If Docker is not running, Kubernetes will not work.

**Do**

Open Docker Desktop and wait for the dashboard to load.

**Expected**

Dashboard loads normally with no error banners.

---

## Step 2 — Enable Kubernetes

**Why** — Kubernetes must be enabled before `kubectl` can connect to it.

**Do**

1. Docker Desktop → Settings
2. Kubernetes tab
3. Enable Kubernetes
4. Apply & Restart
5. Wait until the status shows **Running**

**Expected**

Green status indicator showing **Running**.

**Understand** — You now have a single-node Kubernetes cluster on your laptop. Docker Desktop provisions the control plane and worker components inside a VM.

---

## Step 3 — Verify kubectl

**Why** — `kubectl` is the command-line tool for talking to Kubernetes. It must be installed and accessible.

**Do**

```bash
kubectl version --client
```

**Expected**

```
Client Version: v1.xx.x
```

---

## Step 4 — Check cluster connection

**Why** — `kubectl` can be configured to talk to multiple clusters. Confirm it is pointed at your local Docker Desktop cluster.

**Do**

```bash
kubectl config current-context
```

**Expected**

```
docker-desktop
```

---

## Step 5 — Check the node

**Why** — A node is the machine where pods run. Verify your cluster has one healthy node before proceeding.

**Do**

```bash
kubectl get nodes
```

**Expected**

```
NAME             STATUS   ROLES           AGE   VERSION
docker-desktop   Ready    control-plane   Xm    v1.xx.x
```

**Understand** — Your laptop is acting as the Kubernetes node. The `Ready` status means it can schedule and run pods.

---

## Verification

Run all three checks. All three should succeed before moving to the next lab.

```bash
kubectl config current-context   # should print docker-desktop
kubectl get nodes                # should show 1 node, STATUS=Ready
kubectl get pods --all-namespaces # should show system pods running
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `kubectl: command not found` | Install kubectl or reinstall Docker Desktop |
| Context not `docker-desktop` | Run `kubectl config use-context docker-desktop` |
| Node shows `NotReady` | Wait 2 minutes, then restart Docker Desktop |
| Dashboard shows error | Disable and re-enable Kubernetes in settings |
