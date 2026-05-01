---

title: Service vs Endpoint
toc:
max_depth: 2
------------

## Short theory

A Service defines how Pods should be reached.
An Endpoint lists the actual Pod IPs backing a Service.
Services do not discover Pods themselves.
Controllers update Endpoints when Pods become ready or unready.

---

## Hands-on example

Assume:

* A working Kubernetes cluster
* `kubectl` is configured

---

### Initial state

No Pods, Services, or Endpoints exist.

```
kubectl get pods
kubectl get svc
kubectl get endpoints
```

```
No resources found in default namespace.
No resources found in default namespace.
No resources found in default namespace.
```

---

### Step 1: Create a Pod

```
kubectl run demo --image=nginx --labels=app=demo
```

```
pod/demo created
```

Check Pod IP.

```
kubectl get pod demo -o wide
```

```
NAME   READY   STATUS    IP            NODE
demo   1/1     Running   10.244.0.10   node1
```

---

### Step 2: Create a Service

```
kubectl expose pod demo --port=80
```

```
service/demo exposed
```

Check Service.

```
kubectl get svc demo
```

```
NAME   TYPE        CLUSTER-IP     PORT(S)
demo   ClusterIP   10.96.40.21    80/TCP
```

Check Endpoints.

```
kubectl get endpoints demo
```

```
NAME   ENDPOINTS           AGE
demo   10.244.0.10:80      5s
```

What changed:

* Endpoint was created pointing to the Pod IP

What did not change:

* Pod IP stayed the same

---

### Step 3: Make the Pod unready

Delete the nginx index file.

```
kubectl exec demo -- rm /usr/share/nginx/html/index.html
```

Check Pod status.

```
kubectl get pod demo
```

```
NAME   READY   STATUS    RESTARTS   AGE
demo   0/1     Running   0          30s
```

Check Endpoints again.

```
kubectl get endpoints demo
```

```
NAME   ENDPOINTS   AGE
demo   <none>     30s
```

What changed:

* Endpoint list is now empty

What did not change:

* Service still exists
* Pod still exists

---

## Key observation

* Services are static definitions
* Endpoints reflect current ready Pods
