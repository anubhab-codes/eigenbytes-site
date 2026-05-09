---
title: Labels and Selectors
sidebar_position: 4
description: "How Kubernetes connects objects using labels — the mechanism behind Services, Deployments, and scheduling"
---

# Labels and Selectors

## Prerequisites

- [Services and Networking](./services-and-networking.md) complete
- `kubectl` connected to `docker-desktop`

---

## What you will build

A running Deployment with labels applied at multiple levels. You will observe how a Service uses labels (not IPs) to route traffic, and what happens when you remove a label from a pod.

---

## Setup

```bash
kubectl create deployment demo --image=nginx
kubectl expose deployment demo --type=NodePort --port=80
```

---

## Step 1 — View existing labels

**Why** — Labels are the mechanism Kubernetes uses to connect objects. The Deployment, its pods, and the Service are all wired together by labels.

**Do**

```bash
kubectl get pods --show-labels
```

**Expected**

```
NAME                    READY   STATUS    LABELS
demo-xxxxxxxxxx-xxxxx   1/1     Running   app=demo,...
```

---

## Step 2 — Add a label to the Deployment object

**Do**

```bash
kubectl label deployment demo team=devops
kubectl get deployment demo --show-labels
```

**Understand** — This labels the Deployment object itself. It does not affect the pods it manages.

---

## Step 3 — Add a label to the pod template (permanent)

**Why** — To label all current and future pods managed by this Deployment, edit the pod template spec — not the pods directly.

**Do**

```bash
kubectl edit deployment demo
```

Find this section:

```yaml
spec:
  template:
    metadata:
      labels:
```

Add under labels:

```yaml
env: training
```

Save and exit.

**Check**

```bash
kubectl get pods --show-labels
```

**Expected**

New pods appear with `env=training`.

**Understand** — Kubernetes rolled out new pods with the updated template. The old pods were replaced. This is how label changes propagate.

---

## Step 4 — Filter with a selector

**Do**

```bash
kubectl get pods -l env=training
```

Only pods matching that label are shown. This is exactly how Services route traffic — using label selectors, not hardcoded IPs.

---

## Step 5 — Remove a label from a single pod

**Why** — When you remove the label the Service selector matches, that pod is no longer reachable via the Service. This is useful for debugging a single pod in isolation.

**Do**

```bash
kubectl label pod <pod-name> env-
```

Check:

```bash
kubectl get pods --show-labels
kubectl get endpoints demo
```

**Expected**

The endpoints list now has one fewer entry. Traffic no longer routes to the unlabeled pod.

**Understand** — The pod is still running. The Service simply cannot find it anymore because the selector no longer matches. The Deployment will eventually replace it with a correctly labeled pod.

---

## Cleanup

```bash
kubectl delete service demo
kubectl delete deployment demo
kubectl get all  # verify cluster is clean
```

---

## Summary

| Concept  | How it works |
|----------|-------------|
| Label | Key-value pair attached to any Kubernetes object |
| Selector | Filter that matches objects by label |
| Service → Pod | Service selects pods by label, not by IP |
| Template label | Changing labels in the pod template rolls out new pods |
