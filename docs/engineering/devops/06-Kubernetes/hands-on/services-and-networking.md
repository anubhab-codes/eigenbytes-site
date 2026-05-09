---
title: Services and Networking
sidebar_position: 3
description: "Expose a Deployment and reach it from your browser using a Service"
---

# Services and Networking

## Prerequisites

- [Pods and Deployments](./pods-and-deployments.md) complete
- `kubectl` connected to `docker-desktop`

---

## What you will build

A running Deployment exposed via a NodePort Service. You will open it in a browser from your laptop.

---

## Step 1 — Create a Deployment

**Do**

```bash
kubectl create deployment demo --image=nginx
kubectl scale deployment demo --replicas=3
```

**Expected**

3 pods running.

---

## Step 2 — Expose the Deployment

**Why** — Pods have unstable IPs. They change every time a pod restarts. A Service provides a stable address that always finds the right pods using labels.

**Do**

```bash
kubectl expose deployment demo --type=NodePort --port=80
```

**Expected**

```
service/demo exposed
```

---

## Step 3 — Find the port

**Do**

```bash
kubectl get services
```

**Expected**

```
NAME         TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
demo         NodePort   10.xxx.xxx.xxx  <none>        80:3xxxx/TCP   5s
kubernetes   ClusterIP  10.96.0.1       <none>        443/TCP        1d
```

Note the `3xxxx` value — that is your NodePort.

---

## Step 4 — Open in browser

**Do**

```
http://localhost:<NodePort>
```

**Expected**

The nginx welcome page loads.

**Understand** — The Service has a stable ClusterIP that acts as a single entry point. Traffic coming in gets load-balanced across all 3 pods automatically. Pods can restart and get new IPs — the Service does not care, it finds them by label.

---

## Verification

```bash
kubectl get services demo      # should show NodePort assigned
kubectl get endpoints demo     # should list 3 pod IPs
```

---

## Cleanup

```bash
kubectl delete service demo
kubectl delete deployment demo
kubectl get all  # should show only the kubernetes service
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Browser shows nothing | Confirm you are using the correct NodePort from `kubectl get services` |
| NodePort not accessible | On Linux hosts, use the node IP instead of `localhost` |
