---
title: Configuration
description: "ConfigMaps, Secrets, and how to inject configuration into pods without rebuilding images"
---

# Configuration

Your app needs a database URL. You hardcode it inside the image.

Wrong endpoint in staging. Wrong credentials in production. You rebuild the image every time config changes.

The image should not know which environment it runs in. Configuration belongs outside the container.

Kubernetes has two objects for this: ConfigMap and Secret.

---

## ConfigMap vs Secret

A **ConfigMap** stores non-sensitive configuration: feature flags, URLs, mode settings, log levels.

A **Secret** stores sensitive data: passwords, tokens, certificates. Values are base64-encoded in the API. Access is controlled separately from ConfigMaps.

The mechanics of using them are identical. The difference is intent and access control.

> Do not store passwords in ConfigMaps. Secrets can be encrypted at rest if your cluster is configured for it. ConfigMaps cannot.

---

## Two ways to inject configuration

**Environment variables** — values are injected at pod startup. Simple and visible via `env`. Cannot update without restarting the pod.

**Volume mounts** — the ConfigMap or Secret is mounted as files inside the container. Files update automatically when the ConfigMap changes, without restarting the pod.

Use environment variables for simple values that change infrequently.
Use volume mounts for config files or anything that needs live updates.

---

## Hands-on

### Create a ConfigMap

```bash
kubectl create configmap app-config \
  --from-literal=APP_MODE=debug \
  --from-literal=LOG_LEVEL=info
```

```bash
kubectl get configmap app-config -o yaml
```

```yaml
data:
  APP_MODE: debug
  LOG_LEVEL: info
```

### Create a Secret

```bash
kubectl create secret generic app-secret \
  --from-literal=DB_PASSWORD=admin123
```

```bash
kubectl get secret app-secret -o yaml
```

```yaml
data:
  DB_PASSWORD: YWRtaW4xMjM=    # base64-encoded
```

Decode it:

```bash
echo "YWRtaW4xMjM=" | base64 --decode
# admin123
```

### Inject as environment variables

```bash
kubectl run env-demo \
  --image=busybox \
  --restart=Never \
  --env-from=configmap/app-config \
  --env-from=secret/app-secret \
  -- sh -c 'env | grep -E "APP_MODE|LOG_LEVEL|DB_PASSWORD"'
```

```
APP_MODE=debug
LOG_LEVEL=info
DB_PASSWORD=admin123
```

### Inject as a volume mount

Save this as `vol-demo.yaml`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: vol-demo
spec:
  containers:
  - name: app
    image: busybox
    command: ["sh", "-c", "cat /config/APP_MODE; sleep 3600"]
    volumeMounts:
    - name: config-vol
      mountPath: /config
  volumes:
  - name: config-vol
    configMap:
      name: app-config
  restartPolicy: Never
```

```bash
kubectl apply -f vol-demo.yaml
kubectl logs vol-demo
# debug
```

### Watch the live update

```bash
kubectl patch configmap app-config -p '{"data":{"APP_MODE":"prod"}}'
kubectl exec vol-demo -- cat /config/APP_MODE
# prod
```

The file updated inside the running pod. No restart. No redeploy.

Now check the env-demo approach — those environment variables did not change. They are frozen from pod startup.

---

## Cleanup

```bash
kubectl delete pod env-demo vol-demo --ignore-not-found
kubectl delete configmap app-config
kubectl delete secret app-secret
```

---

## Quick reference

```bash
kubectl create configmap <name> --from-literal=KEY=VALUE
kubectl create configmap <name> --from-file=app.conf
kubectl create secret generic <name> --from-literal=KEY=VALUE
kubectl get configmaps
kubectl get secrets
kubectl describe configmap <name>
kubectl edit configmap <name>
kubectl delete configmap <name>
```
