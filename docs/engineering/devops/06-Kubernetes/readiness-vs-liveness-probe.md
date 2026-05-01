# Readiness vs Liveness Probe

Readiness probes control traffic to a pod. Liveness probes restart unhealthy pods.

## Example

```yaml
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 10
```
