---

title: Deployment Rollout and Rollback
toc:
max_depth: 2
------------

## Short theory

A Deployment rollout replaces Pods when the Pod template changes.
Kubernetes creates a new ReplicaSet and gradually shifts traffic.
Rollback switches the Deployment back to a previous ReplicaSet.
This is not possible with Pods or ReplicaSets alone.

---

## Hands-on example

Assume:

* A working Kubernetes cluster
* `kubectl` is configured

---

### Initial state

No Deployments exist.

```
kubectl get deployments
```

```
No resources found in default namespace.
```

---

### Step 1: Create a Deployment

```
kubectl create deployment demo-deploy --image=nginx:1.25
```

```
deployment.apps/demo-deploy created
```

Check status.

```
kubectl get deployments
```

```
NAME          READY   UP-TO-DATE   AVAILABLE   AGE
demo-deploy   1/1     1            1           5s
```

Check ReplicaSets.

```
kubectl get rs
```

```
NAME                     DESIRED   CURRENT   READY   AGE
demo-deploy-6f7c8d9f6b   1         1         1       5s
```

What changed:

* One Deployment and one ReplicaSet exist

What did not change:

* Only one Pod version is running

---

### Step 2: Update the image (trigger a rollout)

```
kubectl set image deployment/demo-deploy nginx=nginx:1.26
```

```
deployment.apps/demo-deploy image updated
```

Watch the rollout.

```
kubectl rollout status deployment/demo-deploy
```

```
deployment "demo-deploy" successfully rolled out
```

Check ReplicaSets again.

```
kubectl get rs
```

```
NAME                     DESIRED   CURRENT   READY   AGE
demo-deploy-7a8b9c0d1e   1         1         1       10s
demo-deploy-6f7c8d9f6b   0         0         0       1m
```

What changed:

* A new ReplicaSet was created
* Old ReplicaSet was scaled down

What did not change:

* Deployment name and selector

---

### Step 3: Roll back to the previous version

```
kubectl rollout undo deployment/demo-deploy
```

```
deployment.apps/demo-deploy rolled back
```

Verify.

```
kubectl get rs
```

```
NAME                     DESIRED   CURRENT   READY   AGE
demo-deploy-6f7c8d9f6b   1         1         1       2m
demo-deploy-7a8b9c0d1e   0         0         0       1m
```

What changed:

* The previous ReplicaSet is active again

What did not change:

* No Pods were manually deleted

---

## Key observation

* Rollouts and rollbacks work only through Deployments
* Deleting Pods manually bypasses rollout control
