---

title: ConfigMap vs Secret
toc:
max_depth: 2
------------

## Short theory

A ConfigMap stores non-sensitive configuration data.
A Secret stores sensitive data encoded in base64.
Both are consumed by Pods the same way.
Secrets differ by intent and access controls, not by mechanics.

---

## Hands-on example

Assume:

* A working Kubernetes cluster
* `kubectl` is configured

---

### Initial state

No ConfigMaps, Secrets, or Pods exist.

```
kubectl get configmaps
kubectl get secrets
kubectl get pods
```

```
No resources found in default namespace.
No resources found in default namespace.
No resources found in default namespace.
```

---

### Step 1: Create a ConfigMap

```
kubectl create configmap app-config --from-literal=APP_MODE=debug
```

```
configmap/app-config created
```

Verify.

```
kubectl get configmap app-config -o yaml
```

```
data:
  APP_MODE: debug
```

---

### Step 2: Create a Secret

```
kubectl create secret generic app-secret --from-literal=DB_PASSWORD=admin123
```

```
secret/app-secret created
```

Verify.

```
kubectl get secret app-secret -o yaml
```

```
data:
  DB_PASSWORD: YWRtaW4xMjM=
```

What changed:

* Value is base64-encoded

What did not change:

* Data is not encrypted by default

---

### Step 3: Consume both in a Pod

```
kubectl run demo --image=busybox --restart=Never --env-from=configmap/app-config --env-from=secret/app-secret -- sh -c 'env | grep -E "APP_MODE|DB_PASSWORD"'
```

```
APP_MODE=debug
DB_PASSWORD=admin123
```

What changed:

* Both values are available as environment variables

What did not change:

* Pod cannot tell whether data came from a ConfigMap or Secret

---

## Key observation

* Secrets are for sensitive data by intent, not by stronger encoding
* Do not store passwords in ConfigMaps