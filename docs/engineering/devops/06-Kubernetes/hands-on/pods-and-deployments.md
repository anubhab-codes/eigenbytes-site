---
title: Pods and Deployments
sidebar_position: 2
description: "Run your first pod, then learn why you almost never manage pods directly"
---

# Pods and Deployments

## Prerequisites

- [Setup Local Cluster](./setup-local-cluster.md) complete
- `kubectl` connected to `docker-desktop`

---

## What you will build

You will create a pod directly, observe that it does not self-heal, then create a Deployment and see that pods under a Deployment restart automatically and scale on demand.

---

## Part 1 — Pods

### Step 1 — Create a pod

**Why** — A pod is the smallest unit Kubernetes runs. Start here to understand the baseline before moving to Deployments.

**Do**

```bash
kubectl run nginx-pod --image=nginx
```

**Expected**

```
pod/nginx-pod created
```

---

### Step 2 — Check pod status

**Do**

```bash
kubectl get pods
```

**Expected**

```
NAME        READY   STATUS    RESTARTS   AGE
nginx-pod   1/1     Running   0          5s
```

**Understand** — Kubernetes pulled the nginx image, created a container, assigned it an IP, and started it.

---

### Step 3 — Inspect the pod

**Why** — `describe` gives you the full picture: image, node, events, and errors.

**Do**

```bash
kubectl describe pod nginx-pod
```

Look at: **Image**, **Status**, **Events** at the bottom.

---

### Step 4 — View logs

**Do**

```bash
kubectl logs nginx-pod
```

---

### Step 5 — Delete the pod and observe

**Why** — This is the critical lesson. A plain pod does not come back.

**Do**

```bash
kubectl delete pod nginx-pod
kubectl get pods
```

**Expected**

```
No resources found in default namespace.
```

**Understand** — The pod is gone permanently. Nobody recreated it. This is why you do not run production workloads as plain pods.

---

## Part 2 — Deployments

### Step 6 — Create a Deployment

**Why** — A Deployment manages pods. It enforces the desired state: *"I want N copies of this pod always running."*

**Do**

```bash
kubectl create deployment demo --image=nginx
```

---

### Step 7 — Verify

**Do**

```bash
kubectl get deployments
kubectl get pods
```

**Expected**

```
NAME   READY   UP-TO-DATE   AVAILABLE   AGE
demo   1/1     1            1           5s
```

One pod with a random generated name.

---

### Step 8 — Test self-healing

**Why** — This demonstrates the fundamental value of a Deployment.

**Do**

Delete the pod:

```bash
kubectl delete pod <pod-name-from-step-7>
```

Watch what happens:

```bash
kubectl get pods
```

**Expected**

A new pod appears automatically with a different name.

**Understand** — The Deployment noticed the desired count (1) did not match the actual count (0) and created a replacement.

---

### Step 9 — Scale

**Why** — Running multiple copies distributes load and prevents a single pod crash from causing downtime.

**Do**

```bash
kubectl scale deployment demo --replicas=3
kubectl get pods
```

**Expected**

```
NAME                    READY   STATUS    RESTARTS   AGE
demo-xxxxxxxxxx-xxxxx   1/1     Running   0          10s
demo-xxxxxxxxxx-yyyyy   1/1     Running   0          10s
demo-xxxxxxxxxx-zzzzz   1/1     Running   0          5s
```

---

## Cleanup

```bash
kubectl delete deployment demo
kubectl get pods  # verify all pods are gone
```

---

## What you should understand

- A plain pod is not self-healing. Delete it, it's gone.
- A Deployment watches pods and maintains the desired count.
- Scaling a Deployment is a single command.
