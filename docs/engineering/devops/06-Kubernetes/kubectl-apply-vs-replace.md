---

title: kubectl apply vs kubectl replace
toc:
max_depth: 2
------------

## Short theory

`kubectl apply` updates resources using a three-way merge.
`kubectl replace` deletes and recreates the resource spec.
Apply preserves fields not defined in your manifest.
Replace overwrites the entire spec.

---

## Hands-on example

Assume:

* A working Kubernetes cluster
* `kubectl` is configured

---

### Initial state

Create a Deployment using `apply`.

```
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: demo
  template:
    metadata:
      labels:
        app: demo
    spec:
      containers:
      - name: app
        image: nginx:1.25
        ports:
        - containerPort: 80
EOF
```

```
deployment.apps/demo created
```

Check the Deployment.

```
kubectl get deployment demo -o yaml | grep image
```

```
image: nginx:1.25
```

---

### Step 1: Modify the Deployment using apply

Change only the image field.

```
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo
spec:
  template:
    spec:
      containers:
      - name: app
        image: nginx:1.26
EOF
```

```
deployment.apps/demo configured
```

Verify.

```
kubectl get deployment demo -o yaml | grep image
```

```
image: nginx:1.26
```

What changed:

* Image field was updated

What did not change:

* Replicas, labels, and ports stayed intact

---

### Step 2: Modify the Deployment using replace

Replace with a minimal spec.

```
kubectl replace -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: demo
  template:
    metadata:
      labels:
        app: demo
    spec:
      containers:
      - name: app
        image: nginx:1.27
EOF
```

```
deployment.apps/demo replaced
```

Verify ports.

```
kubectl get deployment demo -o yaml | grep containerPort
```

```
<no output>
```

What changed:

* Deployment spec was fully replaced

What did not change:

* Resource name stayed the same

---

## Key observation

* Use `apply` for incremental changes
* `replace` removes fields you do not specify
