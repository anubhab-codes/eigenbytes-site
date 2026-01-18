---

title: Pod vs Deployment
toc:
max_depth: 2
------------

## Short theory

A Pod runs containers but has no self-healing.
A Deployment manages Pods using a controller.
If a Pod dies, Kubernetes does nothing.
If a Deployment-managed Pod dies, Kubernetes recreates it.

---

## Hands-on example

Assume:

* A working Kubernetes cluster
* `kubectl` is configured

---

### Initial state

No resources exist.

```
kubectl get pods
kubectl get deployments
```

```
No resources found in default namespace.
No resources found in default namespace.
```

---

### Step 1: Create a Pod directly

```
kubectl run demo-pod --image=nginx --restart=Never
```

```
pod/demo-pod created
```

Verify.

```
kubectl get pods
```

```
NAME       READY   STATUS    RESTARTS   AGE
demo-pod   1/1     Running   0          5s
```

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

* The Pod is permanently gone

What did not change:

* Nothing recreated it

---

### Step 3: Create a Deployment

```
kubectl create deployment demo-deploy --image=nginx
```

```
deployment.apps/demo-deploy created
```

Verify.

```
kubectl get pods
```

```
NAME                           READY   STATUS    RESTARTS   AGE
demo-deploy-6f7c8d9f6b-abcde   1/1     Running   0          5s
```

---

### Step 4: Delete the Deployment Pod

Delete the Pod created by the Deployment.

```
kubectl delete pod demo-deploy-6f7c8d9f6b-abcde
```

```
pod "demo-deploy-6f7c8d9f6b-abcde" deleted
```

Check Pods again.

```
kubectl get pods
```

```
NAME                           READY   STATUS    RESTARTS   AGE
demo-deploy-6f7c8d9f6b-fghij   1/1     Running   0          5s
```

What changed:

* The original Pod was deleted
* A new Pod was created automatically

What did not change:

* The Deployment stayed the same

---

## Key observation

* Use Pods only for debugging or one-off tasks
* Use Deployments for anything that must stay running