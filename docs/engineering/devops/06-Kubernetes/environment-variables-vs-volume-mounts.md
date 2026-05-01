---

title: Environment Variables vs Volume Mounts
toc:
max_depth: 2
------------

## Short theory

Environment variables inject configuration at Pod startup.
Volume mounts expose configuration as files inside the container.
Environment variables are static for the Pod lifetime.
Volume-mounted data can change without restarting the Pod.

---

## Hands-on example

Assume:

* A working Kubernetes cluster
* `kubectl` is configured

---

### Initial state

No Pods or ConfigMaps exist.

```
kubectl get pods
kubectl get configmaps
```

```
No resources found in default namespace.
No resources found in default namespace.
```

---

### Step 1: Create a ConfigMap

```
kubectl create configmap demo-config --from-literal=MODE=debug
```

```
configmap/demo-config created
```

---

### Step 2: Consume ConfigMap as environment variable

```
kubectl run env-demo \
  --image=busybox \
  --restart=Never \
  --env-from=configmap/demo-config \
  -- sh -c 'echo $MODE'
```

```
debug
```

Check the Pod.

```
kubectl get pod env-demo
```

```
NAME       READY   STATUS      RESTARTS   AGE
env-demo   0/1     Completed   0          5s
```

---

### Step 3: Consume the same ConfigMap as a volume

```
kubectl run vol-demo \
  --image=busybox \
  --restart=Never \
  --overrides='
{
  "spec": {
    "containers": [{
      "name": "vol-demo",
      "image": "busybox",
      "command": ["sh", "-c", "cat /config/MODE"],
      "volumeMounts": [{
        "name": "cfg",
        "mountPath": "/config"
      }]
    }],
    "volumes": [{
      "name": "cfg",
      "configMap": {
        "name": "demo-config"
      }
    }]
  }
}'
```

```
pod/vol-demo created
```

Check output.

```
kubectl logs vol-demo
```

```
debug
```

---

### Step 4: Update the ConfigMap

```
kubectl patch configmap demo-config -p '{"data":{"MODE":"prod"}}'
```

```
configmap/demo-config patched
```

Re-read the file from the running Pod.

```
kubectl exec vol-demo -- cat /config/MODE
```

```
prod
```

What changed:

* File content updated inside the Pod

What did not change:

* Environment variables were not updated

---

## Key observation

* Environment variables require Pod restart to change
* Volume mounts reflect ConfigMap updates automatically
