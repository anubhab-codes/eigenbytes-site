---

title: Ingress vs Service
toc:
max_depth: 2
------------

## Short theory

A Service exposes Pods inside or outside the cluster.
An Ingress routes HTTP traffic to Services based on host or path.
Services do not understand HTTP.
Ingress works only with an Ingress Controller.

---

## Hands-on example

Assume:

* A working Kubernetes cluster
* An Ingress controller is installed
* `kubectl` is configured

---

### Initial state

No Deployments, Services, or Ingresses exist.

```
kubectl get deployments
kubectl get svc
kubectl get ingress
```

```
No resources found in default namespace.
No resources found in default namespace.
No resources found in default namespace.
```

---

### Step 1: Create a Deployment

```
kubectl create deployment web --image=nginx
```

```
deployment.apps/web created
```

Verify.

```
kubectl get pods
```

```
web-6f7c8d9f6b-abcde   1/1   Running   0   5s
```

---

### Step 2: Expose it with a Service

```
kubectl expose deployment web --port=80
```

```
service/web exposed
```

Check the Service.

```
kubectl get svc web
```

```
NAME   TYPE        CLUSTER-IP     PORT(S)
web    ClusterIP   10.96.55.12    80/TCP
```

What changed:

* Service provides a stable virtual IP

What did not change:

* No HTTP routing exists

---

### Step 3: Create an Ingress

```
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
spec:
  rules:
  - host: web.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web
            port:
              number: 80
EOF
```

```
ingress.networking.k8s.io/web-ingress created
```

Check Ingress.

```
kubectl get ingress web-ingress
```

```
NAME          CLASS   HOSTS       ADDRESS        PORTS   AGE
web-ingress   nginx   web.local   192.168.49.2   80      10s
```

---

### Step 4: Access through Ingress

From your machine, map the host.

```
sudo sh -c 'echo "192.168.49.2 web.local" >> /etc/hosts'
```

Send a request.

```
curl http://web.local
```

```
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
...
```

What changed:

* HTTP traffic is routed by host

What did not change:

* Service and Pod configuration stayed the same

---

## Key observation

* Services expose endpoints
* Ingress controls HTTP routing on top of Services
