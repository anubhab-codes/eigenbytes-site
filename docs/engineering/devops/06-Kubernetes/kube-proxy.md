# Kube-Proxy

Kube-proxy manages Kubernetes Service networking on each node.

## What it does

It watches Service objects and routes traffic from a Service IP to pod IPs.

## Diagram

```mermaid
flowchart LR
  Client --> ServiceIP
  ServiceIP --> KubeProxy
  KubeProxy --> PodIP
```
