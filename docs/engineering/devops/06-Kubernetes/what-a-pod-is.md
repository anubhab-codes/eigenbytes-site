---

title: What a Pod Is (and Is Not)
sidebar_position: 1
toc:
max_depth: 2
------------

## Short theory

A Pod is the smallest deployable unit in Kubernetes.
It runs one or more containers that share the same network and filesystem namespace.
A Pod is not self-healing and is not meant to be managed directly.
Deployments and Jobs create and replace Pods for you.

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

### Step 1: Create a Pod directly

Create a Pod from an inline manifest.

```
kubectl run demo-pod --image=nginx --restart=Never
```

```
pod/demo-pod created
```

Check the Pod.

```
kubectl get pods
```

```
NAME       READY   STATUS    RESTARTS   AGE
demo-pod   1/1     Running   0          5s
```

What changed:

* A single Pod exists and is running

What did not change:

* No controller is managing this Pod

---

### Step 2: Delete the Pod

```
kubectl delete pod demo-pod
```

```
pod "demo-pod" deleted
```

Check again.

```
kubectl get pods
```

```
No resources found in default namespace.
```

What changed:

* The Pod is gone

What did not change:

* Nothing recreated it

---

## Key observation

* A Pod does not come back once deleted
* If you need automatic restarts or scaling, do not create Pods directly