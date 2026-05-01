---

title: "ReplicaSet: Why You Rarely Create It Directly"
toc:
max_depth: 2
------------

## Short theory

A ReplicaSet ensures a fixed number of identical Pods are running.
It replaces Pods when they are deleted or crash.
A Deployment manages ReplicaSets for you.
You usually do not create ReplicaSets directly because they lack rollout control.

---

## Hands-on example

Assume:

* A working Kubernetes cluster
* `kubectl` is configured

---

### Initial state

No ReplicaSets or Pods exist.

```
kubectl get rs
kubectl get pods
```

```
No resources found in default namespace.
No resources found in default namespace.
```

---

### Step 1: Create a ReplicaSet directly

Create a ReplicaSet using `kubectl create`.

```
kubectl create rs demo-rs --image=nginx --replicas=1
```

```
replicaset.apps/demo-rs created
```

Check resources.

```
kubectl get rs
kubectl get pods
```

```
NAME      DESIRED   CURRENT   READY   AGE
demo-rs   1         1         1       5s
```

```
NAME            READY   STATUS    RESTARTS   AGE
demo-rs-abcde   1/1     Running   0          5s
```

What changed:

* One ReplicaSet exists
* One Pod was created by the ReplicaSet

What did not change:

* No Deployment exists

---

### Step 2: Delete the Pod

```
kubectl delete pod demo-rs-abcde
```

```
pod "demo-rs-abcde" deleted
```

Check Pods again.

```
kubectl get pods
```

```
NAME            READY   STATUS    RESTARTS   AGE
demo-rs-fghij   1/1     Running   0          5s
```

What changed:

* The original Pod was deleted
* A new Pod was created automatically

What did not change:

* The ReplicaSet configuration stayed the same

---

## Key observation

* ReplicaSets self-heal Pods but cannot do rolling updates
* Use Deployments instead of creating ReplicaSets directly
