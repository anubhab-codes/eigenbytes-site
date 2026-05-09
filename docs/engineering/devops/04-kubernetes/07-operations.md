---
title: Operations
sidebar_position: 8
description: "CrashLoopBackOff, Pending pods, service not routing — how to diagnose and fix the most common Kubernetes failures"
---

# Operations

Something is broken. The pod is not running. Traffic is not reaching your service. You don't know where to start.

This page is a diagnostic guide for the most common failures. Every section follows the same pattern: what you see → why it happens → how to find the cause → how to fix it.

---

## CrashLoopBackOff

**What you see:**

```
NAME        READY   STATUS             RESTARTS   AGE
my-app      0/1     CrashLoopBackOff   5          3m
```

**What it means:** The container starts, crashes, Kubernetes restarts it, it crashes again. The `BackOff` part means Kubernetes is increasing the delay between restarts to avoid hammering a broken container.

**How to diagnose:**

```bash
kubectl logs my-app
kubectl logs my-app --previous          # logs from last crash
kubectl describe pod my-app | grep -A 10 "Last State"
```

**Common causes:**

| Exit code | Likely cause |
|-----------|-------------|
| 1 | Application error — check logs for stack trace |
| 137 | OOMKilled — container exceeded memory limit |
| 139 | Segfault |
| 1 with "can't open file" | Wrong entrypoint or missing file in image |

**Fixes:**
- Application crash: fix the bug shown in logs
- OOMKilled: increase memory limit
- Missing env var or config: verify ConfigMap/Secret is mounted correctly

---

## Pod stuck in Pending

**What you see:**

```
NAME        READY   STATUS    RESTARTS   AGE
my-app      0/1     Pending   0          5m
```

**What it means:** The scheduler cannot find a node to place this pod.

**How to diagnose:**

```bash
kubectl describe pod my-app
```

Look at the **Events** section at the bottom. It will tell you exactly why scheduling failed.

**Common causes and fixes:**

| Event message | Cause | Fix |
|--------------|-------|-----|
| `Insufficient cpu` | No node has enough CPU | Reduce cpu request, or add nodes |
| `Insufficient memory` | No node has enough memory | Reduce memory request, or add nodes |
| `0/1 nodes are available: 1 node has taints` | Node taint blocks scheduling | Add toleration or use different node |
| `no PersistentVolumes available` | PVC can't bind | Check `kubectl get pv` and `kubectl get pvc` |

---

## Pod stuck in ImagePullBackOff

**What you see:**

```
NAME        READY   STATUS             RESTARTS   AGE
my-app      0/1     ImagePullBackOff   0          2m
```

**How to diagnose:**

```bash
kubectl describe pod my-app | grep -A 5 Events
```

**Common causes and fixes:**
- Image does not exist: fix the image name and tag
- Private registry without credentials: create an `imagePullSecret`
- Typo in tag: `nginx:lates` fails; `nginx:latest` works
- Registry rate limited: Docker Hub has pull limits; authenticate or use a mirror

---

## Service not routing traffic

**How to diagnose:**

```bash
kubectl get service my-service
kubectl get endpoints my-service
```

If `ENDPOINTS` shows `<none>`, the service selector does not match any pod labels.

```bash
kubectl describe service my-service | grep Selector
kubectl get pods --show-labels
```

**Fix:** Make the pod labels match the service selector exactly. Labels are case-sensitive.

---

## Container running but app not responding

Pod is `Running`, readiness probe is failing, service has no endpoints.

```bash
# Test the app from inside the container
kubectl exec -it my-app -- sh
# Inside: curl localhost:8080
```

If the app responds locally but not via the service: service port or selector is wrong.
If the app does not respond locally: it has not started or is listening on the wrong port.

---

## Diagnostic flow

```mermaid
graph TD
    Start[Pod not working] --> Status{kubectl get pod}
    Status -->|Pending| Pending[kubectl describe pod\ncheck Events]
    Status -->|CrashLoop| Crash[kubectl logs --previous\ncheck exit code]
    Status -->|Running, no traffic| Endpoints{kubectl get endpoints}
    Endpoints -->|none| Labels[kubectl get pods --show-labels\nfix selector mismatch]
    Endpoints -->|has IPs| Exec[kubectl exec -- sh\ncurl localhost:PORT]
```

---

## Quick reference

```bash
# Three commands that solve 80% of problems
kubectl describe pod <name>                       # events, config, state
kubectl logs <name> --previous                    # last crash logs
kubectl get endpoints <service>                   # is traffic routing?

# Additional tools
kubectl get events --sort-by='.lastTimestamp'     # cluster-wide event log
kubectl top pods                                   # CPU/memory usage
kubectl exec -it <name> -- sh                     # shell into container
kubectl port-forward pod/<name> 8080:8080         # test without a service
kubectl get pod <name> -o yaml                    # full spec as applied
```
