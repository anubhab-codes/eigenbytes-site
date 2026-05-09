---
title: Kubernetes
sidebar_position: 1
description: "The distributed operating system — running containers at scale in production"
---

# Kubernetes

Docker solved packaging. Kubernetes solves operations.

You have 50 containers running across 20 servers. One crashes. You need three copies of your API running at all times. Traffic spikes and you need to scale. A deployment goes wrong and you need to roll back. A node fails and its containers need to move to another node.

Docker cannot manage any of this. Kubernetes can.

---

## The architecture story

Kubernetes is a system for running containers at scale. Understanding it means understanding the progression of problems it solves.

You run your app as a **Pod**. It crashes. Nobody restarts it. So you use a **Deployment**. One pod dies and another comes back. You want 3 running, it keeps 3 running.

Every pod gets a new IP when it restarts. Another service needs to talk to your app but the IPs keep changing. So you use a **Service**. One stable virtual IP that always finds your pods using labels.

Ten services, ten load balancers. Your cloud bill doubles. So you use **Ingress**. One load balancer routes to all services by path or hostname.

Your app needs config. You hardcode it in the image. Wrong database in staging. So you use **ConfigMaps** and **Secrets**. Config lives outside the container and is injected at runtime.

One pod starts consuming all the memory on a node and takes everything else down. So you use **Resource Limits**. Your cluster runs predictably.

Each concept exists because the previous one was not enough.

---

## What this section covers

| Page | What you learn |
|------|---------------|
| [Architecture](./01-architecture.md) | What is actually running: control plane, nodes, etcd, kubelet |
| [Workloads](./02-workloads.md) | Pod → Deployment → StatefulSet → Job |
| [Networking](./03-networking.md) | Service → Ingress → Ingress Controller |
| [Configuration](./04-configuration.md) | ConfigMap, Secret, injection patterns |
| [Storage](./05-storage.md) | emptyDir, PersistentVolumeClaim |
| [Reliability](./06-reliability.md) | Resource limits, probes, HPA |
| [Operations](./07-operations.md) | Debugging, events, logs, common failures |

---

## Prerequisites

Docker Desktop with Kubernetes enabled.

```bash
# Enable: Docker Desktop → Settings → Kubernetes → Enable Kubernetes → Apply & Restart

kubectl config current-context   # should print: docker-desktop
kubectl get nodes                 # 1 node, STATUS = Ready
```
