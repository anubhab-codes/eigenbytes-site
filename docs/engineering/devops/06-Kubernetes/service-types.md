---

title: Service Types: ClusterIP vs NodePort
toc:
max_depth: 2
------------

## Short theory

A Service exposes Pods using a stable virtual IP.
ClusterIP is reachable only inside the cluster.
NodePort exposes the Service on a port of every node.
NodePort is a thin wrapper over ClusterIP with external access.

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
kubectl get deployments
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

Verify the Pod.

```
kubectl get pods
```

```
NAME                    READY   STATUS    RESTARTS   AGE
demo-6f7c8d9f6b-abcde   1/1     Running   0          5s
```

---

### Step 2: Expose as ClusterIP

```
kubectl expose deployment demo --port=80 --target-port=80
```

```
service/demo exposed
```

Check the Service.

```
kubectl get svc
```

```
NAME   TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
demo   ClusterIP   10.96.120.45   <none>        80/TCP    5s
```

What changed:

* A ClusterIP Service was created

What did not change:

* No external access exists

---

### Step 3: Access ClusterIP from inside the cluster

Run a temporary Pod.

```
kubectl run curl --image=curlimages/curl -it --rm --restart=Never -- sh
```

Inside the Pod:

```
curl http://demo
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

### Step 4: Change Service to NodePort

```
kubectl patch svc demo -p '{"spec":{"type":"NodePort"}}'
```

```
service/demo patched
```

Check again.

```
kubectl get svc
```

```
NAME   TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
demo   NodePort   10.96.120.45   <none>        80:30007/TCP   1m
```

What changed:

* A node port was allocated

What did not change:

* ClusterIP stayed the same
* Pod selection stayed the same

---

## Key observation

* NodePort adds external access but keeps ClusterIP
* Do not use NodePort as a load balancer replacement
