---

title: How kube-proxy Routes Traffic
toc:
max_depth: 2
------------

## Short theory

kube-proxy programs network rules so Service IPs route to Pod IPs.
It watches Services and Endpoints and updates node-level routing.
Pods never know about Services.
Without kube-proxy, Service IPs do nothing.

---

## Hands-on example

Assume:

* A working Kubernetes cluster
* `kubectl` is configured

---

### Initial state

No Services or Deployments exist.

```
kubectl get svc
kubectl get pods
```

```
No resources found in default namespace.
No resources found in default namespace.
```

---

### Step 1: Create a Deployment

```
kubectl create deployment demo --image=nginx
```

```
deployment.apps/demo created
```

Verify Pod IP.

```
kubectl get pod -o wide
```

```
NAME                    READY   STATUS    IP            NODE
demo-6f7c8d9f6b-abcde   1/1     Running   10.244.0.12   node1
```

---

### Step 2: Expose it as a Service

```
kubectl expose deployment demo --port=80
```

```
service/demo exposed
```

Check Service and Endpoints.

```
kubectl get svc demo
kubectl get endpoints demo
```

```
NAME   TYPE        CLUSTER-IP     PORT(S)
demo   ClusterIP   10.96.88.21    80/TCP
```

```
NAME   ENDPOINTS        AGE
demo   10.244.0.12:80   10s
```

What changed:

* A virtual Service IP exists
* Endpoint points to the Pod IP

What did not change:

* Pod IP stayed the same

---

### Step 3: Access Pod IP directly

Run a temporary Pod.

```
kubectl run curl --image=curlimages/curl -it --rm --restart=Never -- sh
```

Inside the Pod:

```
curl http://10.244.0.12
```

```
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
...
```

Exit the Pod.

---

### Step 4: Access Service IP

Run the same Pod again.

```
kubectl run curl --image=curlimages/curl -it --rm --restart=Never -- sh
```

Inside the Pod:

```
curl http://10.96.88.21
```

```
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
...
```

What changed:

* Traffic went through the Service IP

What did not change:

* Nginx Pod handled the request directly

---

## Key observation

* kube-proxy maps Service IPs to Pod IPs
* Services are routing rules, not processes
