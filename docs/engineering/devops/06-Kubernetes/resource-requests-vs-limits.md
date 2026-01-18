---

title: Resource Requests vs Limits
toc:
max_depth: 2
------------

## Short theory

Resource requests reserve CPU and memory for a Pod.
Resource limits cap how much CPU or memory a Pod can use.
Scheduling uses requests, not limits.
Exceeding limits has runtime consequences.

---

## Hands-on example

Assume:

* A working Kubernetes cluster
* `kubectl` is configured

---

### Initial state

No Pods exist.

```
kubectl get pods
```

```
No resources found in default namespace.
```

---

### Step 1: Create a Pod with requests and limits

```
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: resource-demo
spec:
  containers:
  - name: app
    image: busybox
    command: ["sh", "-c", "sleep 3600"]
    resources:
      requests:
        memory: "64Mi"
        cpu: "100m"
      limits:
        memory: "128Mi"
        cpu: "200m"
EOF
```

```
pod/resource-demo created
```

Check the Pod.

```
kubectl get pod resource-demo
```

```
NAME            READY   STATUS    RESTARTS   AGE
resource-demo   1/1     Running   0          5s
```

Check allocated resources.

```
kubectl describe pod resource-demo | grep -A5 Limits
```

```
Limits:
  cpu:     200m
  memory:  128Mi
Requests:
  cpu:        100m
  memory:     64Mi
```

What changed:

* Scheduler reserved requested resources on a node

What did not change:

* Limits did not affect scheduling

---

### Step 2: Exceed the memory limit

Force the container to allocate memory.

```
kubectl exec resource-demo -- sh -c 'dd if=/dev/zero of=/tmp/mem bs=1M count=200'
```

```
Killed
```

Check Pod status.

```
kubectl get pod resource-demo
```

```
NAME            READY   STATUS      RESTARTS   AGE
resource-demo   0/1     OOMKilled   1          30s
```

What changed:

* Container was killed due to memory limit

What did not change:

* Pod was not rescheduled to another node

---

## Key observation

* Requests affect placement
* Limits affect runtime behavior