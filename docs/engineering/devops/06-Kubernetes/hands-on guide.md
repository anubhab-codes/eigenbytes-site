---

title: Hands-on Guide
toc:
max_depth: 2
------------

---

# 🧪 Kubernetes Hands-On Guide (Beginner Friendly)

---

# Part 1 — Setup

---

## Step 1 — Start Docker Desktop

🎯 **Why**

Kubernetes in our lab runs inside Docker Desktop.
If Docker is not running, Kubernetes will not work.

🛠 **Do**

Open Docker Desktop and ensure it is running.

✅ **Expected**

Dashboard loads normally.

🧠 **Understand**

Docker Desktop provides:

* Container runtime
* Kubernetes cluster (single node)

---

## Step 2 — Enable Kubernetes

🎯 **Why**

Kubernetes must be enabled before we use `kubectl`.

🛠 **Do**

1. Docker Desktop → Settings
2. Kubernetes
3. Enable Kubernetes
4. Apply & Restart
5. Wait until status shows **Running**

✅ **Expected**

Green status / Running.

🧠 **Understand**

You now have a **single-node Kubernetes cluster** on your laptop.

---

## Step 3 — Verify Kubernetes CLI

🎯 **Why**

We use `kubectl` to talk to Kubernetes.

🛠 **Do**

```bash
kubectl version --client
```

✅ **Expected**

Client version shown.

---

## Step 4 — Check cluster connection

🎯 **Why**

Make sure `kubectl` is connected to correct cluster.

🛠 **Do**

```bash
kubectl config current-context
```

✅ **Expected**

Shows `docker-desktop`

---

## Step 5 — Check Node

🎯 **Why**

Node = machine where pods run.

🛠 **Do**

```bash
kubectl get nodes
```

✅ **Expected**

1 node with status `Ready`.

🧠 **Understand**

Your laptop is acting as the Kubernetes node.

---

# Part 2 — Pods

---

## Step 6 — Create a Pod

🎯 **Why**

Pod is the smallest unit Kubernetes runs.
Usually 1 pod = 1 container.

🛠 **Do**

```bash
kubectl run nginx-pod --image=nginx
```

---

## Step 7 — Check Pod Status

🛠 **Do**

```bash
kubectl get pods
```

✅ **Expected**

`nginx-pod` → Running

🧠 **Understand**

Kubernetes:

* Pulled nginx image
* Created container
* Assigned IP
* Started it

---

## Step 8 — Inspect Pod

🎯 **Why**

See detailed information.

🛠 **Do**

```bash
kubectl describe pod nginx-pod
```

Look at:

* Image
* Status
* Events

---

## Step 9 — View Logs

🎯 **Why**

Logs help debug.

🛠 **Do**

```bash
kubectl logs nginx-pod
```

---

## Step 10 — Delete Pod

🎯 **Why**

Plain pod is NOT self-healing.

🛠 **Do**

```bash
kubectl delete pod nginx-pod
```

Check:

```bash
kubectl get pods
```

✅ Pod is gone permanently.

🧠 **Understand**

Pods alone are not managed.

---

# Part 3 — Deployment (Real Usage)

---

## Step 11 — Create Deployment

🎯 **Why**

Deployment manages pods:

* Self-healing
* Scaling
* Rolling updates

🛠 **Do**

```bash
kubectl create deployment demo --image=nginx
```

---

## Step 12 — Verify Deployment

```bash
kubectl get deployments
kubectl get pods
```

✅ 1 deployment
✅ 1 pod (random name)

---

## Step 13 — Self Healing Test

🎯 **Why**

Deployment keeps desired state.

🛠 **Do**

Delete the pod:

```bash
kubectl delete pod <pod-name>
```

Check:

```bash
kubectl get pods
```

✅ New pod appears automatically.

🧠 **Understand**

Deployment enforces:

> "I want 1 pod always running."

---

## Step 14 — Scale

🎯 **Why**

Run multiple copies for load.

🛠 **Do**

```bash
kubectl scale deployment demo --replicas=3
```

Check:

```bash
kubectl get pods
```

✅ 3 pods running.

🧠 **Understand**

Kubernetes handles scaling automatically.

---

# Part 4 — Service (Networking)

---

## Step 15 — Expose Deployment

🎯 **Why**

Pods change names/IPs.
Service provides stable access.

🛠 **Do**

```bash
kubectl expose deployment demo --type=NodePort --port=80
```

---

## Step 16 — Check Service

```bash
kubectl get services
```

Look at:

```
80:3xxxx/TCP
```

Open in browser:

```
http://localhost:<NodePort>
```

✅ Nginx page loads.

🧠 **Understand**

Service:

* Stable IP
* Load balances to 3 pods

---

# Part 5 — Labels

---

## Step 17 — View Labels

🎯 **Why**

Labels connect objects.

🛠 **Do**

```bash
kubectl get pods --show-labels
```

You’ll see something like:

```
app=demo
```

---

## Step 18 — Add Label to Deployment

```bash
kubectl label deployment demo team=devops
```

Check:

```bash
kubectl get deployment demo --show-labels
```

🧠 **Understand**

This labels the deployment object only.

---

## Step 19 — Add Label to Pod Template (Permanent)

```bash
kubectl edit deployment demo
```

Find:

```
spec:
  template:
    metadata:
      labels:
```

Add:

```
env: training
```

Save.

Check:

```bash
kubectl get pods --show-labels
```

✅ Pods now have `env=training`

🧠 **Understand**

Service selectors match pod labels only.

---

## Step 20 — Filter Using Labels

```bash
kubectl get pods -l env=training
```

Only matching pods show.

---

## Step 21 — Remove Label from Pod

```bash
kubectl label pod <pod-name> env-
```

🧠 Temporary if deployment recreates pod.

---

# Part 6 — Cleanup

---

## Step 22 — Delete Everything

```bash
kubectl delete service demo
kubectl delete deployment demo
```

Verify:

```bash
kubectl get all
```

Cluster clean.

---

# Final Concepts Students Should Know

| Object     | Purpose                   |
| ---------- | ------------------------- |
| Node       | Machine                   |
| Pod        | Runs container            |
| Deployment | Manages pods              |
| Replica    | Number of pod copies      |
| Service    | Networking & load balance |
| Label      | Identifies objects        |
| Selector   | Matches labels            |

---
