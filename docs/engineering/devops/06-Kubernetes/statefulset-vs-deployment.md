---

title: StatefulSet vs Deployment
toc:
max_depth: 2
------------

## Short theory

A Deployment manages interchangeable Pods.
A StatefulSet manages Pods with stable identities.
Deployment Pods can be replaced in any order.
StatefulSet Pods have fixed names and ordered lifecycle.

---

## Hands-on example

Assume:

* A working Kubernetes cluster
* `kubectl` is configured

---

### Initial state

No workloads exist.

```
kubectl get deployments
kubectl get statefulsets
kubectl get pods
```

```
No resources found in default namespace.
No resources found in default namespace.
No resources found in default namespace.
```

---

### Step 1: Create a Deployment

```
kubectl create deployment web --image=nginx --replicas=2
```

```
deployment.apps/web created
```

Check Pods.

```
kubectl get pods
```

```
web-6f7c8d9f6b-abcde   1/1   Running   0   5s
web-6f7c8d9f6b-fghij   1/1   Running   0   5s
```

Delete one Pod.

```
kubectl delete pod web-6f7c8d9f6b-abcde
```

```
pod "web-6f7c8d9f6b-abcde" deleted
```

Check again.

```
kubectl get pods
```

```
web-6f7c8d9f6b-klmno   1/1   Running   0   5s
web-6f7c8d9f6b-fghij   1/1   Running   0   20s
```

What changed:

* Pod name changed
* A new Pod replaced the deleted one

What did not change:

* No identity was preserved

---

### Step 2: Create a StatefulSet

Create a headless Service first.

```
kubectl create service clusterip db --tcp=80:80 --dry-run=client -o yaml | sed 's/ClusterIP/None/' | kubectl apply -f -
```

```
service/db created
```

Create the StatefulSet.

```
kubectl create statefulset db --image=nginx --replicas=2 --service-name=db
```

```
statefulset.apps/db created
```

Check Pods.

```
kubectl get pods
```

```
db-0   1/1   Running   0   5s
db-1   1/1   Running   0   3s
```

Delete `db-0`.

```
kubectl delete pod db-0
```

```
pod "db-0" deleted
```

Check again.

```
kubectl get pods
```

```
db-0   1/1   Running   0   5s
db-1   1/1   Running   0   30s
```

What changed:

* `db-0` was recreated

What did not change:

* Pod name and identity stayed the same

---

## Key observation

* Use Deployments for stateless workloads
* Use StatefulSets when Pod identity must be stable
