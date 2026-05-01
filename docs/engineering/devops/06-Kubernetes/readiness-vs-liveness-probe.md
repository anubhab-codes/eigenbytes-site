---

title: Readiness Probe vs Liveness Probe
toc:
max_depth: 2
------------

## Short theory

A liveness probe decides when a container should be restarted.
A readiness probe decides when a Pod should receive traffic.
Failing liveness restarts the container.
Failing readiness only removes the Pod from Service endpoints.

---

## Hands-on example

Assume:

* A working Kubernetes cluster
* `kubectl` is configured

---

### Initial state

No Pods or Services exist.

```
kubectl get pods
kubectl get svc
```

```
No resources found in default namespace.
No resources found in default namespace.
```

---

### Step 1: Create a Pod with a readiness probe

```
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: ready-demo
  labels:
    app: ready-demo
spec:
  containers:
  - name: app
    image: nginx
    readinessProbe:
      httpGet:
        path: /
        port: 80
      initialDelaySeconds: 5
EOF
```

```
pod/ready-demo created
```

Expose it.

```
kubectl expose pod ready-demo --port=80
```

```
service/ready-demo exposed
```

Check endpoints.

```
kubectl get endpoints ready-demo
```

```
NAME         ENDPOINTS           AGE
ready-demo   10.244.0.15:80      10s
```

---

### Step 2: Break readiness without killing the container

Delete the nginx index file.

```
kubectl exec ready-demo -- rm /usr/share/nginx/html/index.html
```

Check Pod status.

```
kubectl get pod ready-demo
```

```
NAME         READY   STATUS    RESTARTS   AGE
ready-demo   0/1     Running   0          30s
```

Check endpoints again.

```
kubectl get endpoints ready-demo
```

```
NAME         ENDPOINTS   AGE
ready-demo   <none>     30s
```

What changed:

* Pod is removed from Service endpoints

What did not change:

* Container is still running

---

### Step 3: Create a Pod with a liveness probe

```
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: live-demo
spec:
  containers:
  - name: app
    image: nginx
    livenessProbe:
      httpGet:
        path: /
        port: 80
      initialDelaySeconds: 5
EOF
```

```
pod/live-demo created
```

Delete the same file.

```
kubectl exec live-demo -- rm /usr/share/nginx/html/index.html
```

Wait and check.

```
kubectl get pod live-demo
```

```
NAME        READY   STATUS    RESTARTS   AGE
live-demo   1/1     Running   1          40s
```

What changed:

* Container was restarted

What did not change:

* Pod identity stayed the same

---

## Key observation

* Readiness controls traffic
* Liveness controls restarts
