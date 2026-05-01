# CrashLoopBackOff

`CrashLoopBackOff` means a pod starts, fails, and Kubernetes retries.

## Inspect

```bash
kubectl describe pod my-pod
kubectl logs my-pod
```

## Common causes

- The container process exits immediately.
- A missing configuration file.
- A failing readiness check.

## Result

Fix the startup command or configuration so the pod stays alive.
