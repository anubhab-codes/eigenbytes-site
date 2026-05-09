---
title: Kubernetes
sidebar_position: 1
description: "Container orchestration — running containers at scale in production"
---

Docker solved packaging. Kubernetes solves operations.

You have 50 containers running across 20 servers. One crashes. You need three copies of your API running at all times. Traffic spikes and you need to scale. A deployment goes wrong and you need to roll back.

Docker cannot manage any of this. Kubernetes can.

Kubernetes is a container orchestration platform. It manages where containers run, how many copies exist, how they talk to each other, how they get configuration, and how they recover from failure.

This section covers Kubernetes end-to-end. Each topic integrates the concept and the hands-on lab — read it and run it.

| # | Topic | What you learn |
|---|-------|---------------|
| 1 | Pods | The smallest unit; how containers run in Kubernetes |
| 2 | Deployments | Self-healing, scaling, rollouts, rollbacks |
| 3 | Services | Stable networking, load balancing, Ingress |
| 4 | Configuration | ConfigMaps, Secrets, env vars, volume mounts |
| 5 | Resource Management | CPU/memory limits, liveness and readiness probes |
| 6 | Storage | emptyDir vs PersistentVolumeClaim |
| 7 | Workload Types | StatefulSets, Jobs, CronJobs |
| 8 | Troubleshooting | CrashLoopBackOff, Pending, service routing failures |

You need Docker Desktop with Kubernetes enabled before starting. See the [Pods](./01-pods.md) page for setup instructions.
