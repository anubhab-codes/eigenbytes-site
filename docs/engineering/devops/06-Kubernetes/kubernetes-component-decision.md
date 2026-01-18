---

title: Kubernetes Component Decision Tree
sidebar_position: 2
toc:
max_depth: 2
------------

## Short theory

Kubernetes components exist to answer operational questions.
You choose components by eliminating invalid options.
A fixed decision order reduces confusion.
Most workloads resolve to a small, repeatable pattern.

---

## Hands-on example

Goal:
Choose the **correct component combination** using a decision tree.

---

### Step 1: Workload lifetime

```
Does the workload need to keep running?
│
├─ No
│   ├─ Runs once → Job
│   └─ Runs on a schedule → CronJob
│
└─ Yes → continue
```

Example (one-time task):

```
kubectl create job once --image=busybox -- sh -c 'echo done'
```

---

### Step 2: Pod replaceability

```
Can Pods be replaced freely?
│
├─ Yes → Deployment
│
└─ No
    ├─ Needs stable name
    ├─ Needs stable storage
    └─ Needs ordered startup/shutdown
        → StatefulSet
```

Example (stateless app):

```
kubectl create deployment api --image=nginx
```

Example (stateful app):

```
kubectl create statefulset db --image=nginx --service-name=db
```

---

### Step 3: Self-healing requirement

```
If a Pod dies, should Kubernetes recreate it?
│
├─ No → Pod
│
└─ Yes → keep Deployment / StatefulSet
```

Example (debug-only Pod):

```
kubectl run debug --image=busybox --restart=Never -- sh
```

Bad practice:

* Do not use bare Pods for production
* They are not self-healing

---

### Step 4: Storage needs

```
Does data need to survive Pod deletion?
│
├─ No → emptyDir
│
└─ Yes → PersistentVolumeClaim
```

Example:

```
kubectl create pvc data --storage=1Gi
```

---

### Step 5: Network exposure

```
Does anything need to talk to this workload?
│
├─ No → stop
│
└─ Yes
    ├─ Inside cluster only → Service (ClusterIP)
    └─ Outside cluster → continue
```

Example:

```
kubectl expose deployment api --port=80
```

---

### Step 6: Traffic type

```
Is traffic HTTP-based?
│
├─ No → Service (NodePort / LoadBalancer)
│
└─ Yes → Ingress + Service
```

Example:

```
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api
spec:
  rules:
  - host: api.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api
            port:
              number: 80
EOF
```

---

### Step 7: Configuration delivery

```
Is the configuration sensitive?
│
├─ No → ConfigMap
│
└─ Yes → Secret
```

```
Does config need live updates?
│
├─ No → environment variables
│
└─ Yes → volume mount
```

Example:

```
kubectl create configmap cfg --from-literal=MODE=prod
kubectl create secret generic sec --from-literal=TOKEN=abc
```

---

## Key observation

* Most applications resolve to: **Deployment + Service**
* Add StatefulSet, Ingress, PVC, or Jobs only when the tree forces you
* If you cannot justify a component with a question, you do not need it
