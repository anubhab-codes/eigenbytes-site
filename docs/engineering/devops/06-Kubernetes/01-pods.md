---
title: Pods
description: "The smallest unit in Kubernetes — what it is, how it works, and why it is not enough on its own"
---

# Pods

## Before you start

You need a local Kubernetes cluster. Docker Desktop provides one.

1. Docker Desktop → Settings → Kubernetes → Enable Kubernetes → Apply & Restart
2. Wait for the green **Running** status indicator

Verify it works:

```bash
kubectl config current-context   # should print docker-desktop
kubectl get nodes                 # 1 node, STATUS = Ready
```

---

## What is a Pod

Your application runs inside a container. Kubernetes does not run containers directly. It wraps them in a Pod.

A Pod is the smallest unit Kubernetes manages. It holds one or more containers that share the same network namespace — same IP, same ports, same localhost. In practice, most pods run exactly one container.

Kubernetes schedules pods, tracks their health, and routes network traffic to them. It does not do any of this to raw containers.

---

## Hands-on

### Create a pod

```bash
kubectl run nginx-pod --image=nginx
```

Check it:

```bash
kubectl get pods
```

```
NAME        READY   STATUS    RESTARTS   AGE
nginx-pod   1/1     Running   0          5s
```

Inspect it:

```bash
kubectl describe pod nginx-pod
```

Look at **Image**, **Node**, and the **Events** section at the bottom. Events tell you exactly what Kubernetes did to start this pod: it pulled the image, created the container, assigned an IP, started it.

View logs:

```bash
kubectl logs nginx-pod
```

### Delete the pod and watch what happens

```bash
kubectl delete pod nginx-pod
kubectl get pods
```

```
No resources found in default namespace.
```

It is gone. Nothing brought it back.

This is the critical thing to understand about pods: **they are not self-healing**. Delete a pod and it stays deleted. The process crashes and it stays crashed (kubelet will restart the container on the same pod, but if the pod itself is deleted, nothing recreates it).

For anything that needs to keep running in production, you do not create pods directly. You use a Deployment.

---

## Quick reference

```bash
kubectl run <name> --image=<image>         # create a pod
kubectl get pods                            # list pods
kubectl get pods -o wide                    # with node and IP
kubectl describe pod <name>                 # full detail + events
kubectl logs <name>                         # container stdout
kubectl logs <name> --previous              # logs from last crash
kubectl exec -it <name> -- sh              # shell into container
kubectl delete pod <name>                   # delete pod
kubectl delete pod <name> --force --grace-period=0   # force delete stuck pod
```
