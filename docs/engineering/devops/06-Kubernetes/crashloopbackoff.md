---

title: "CrashLoopBackOff: What Actually Causes It"
toc:
max_depth: 2
------------

## Short theory

CrashLoopBackOff means a container keeps crashing and Kubernetes keeps restarting it.
The Pod is running, but the container process exits repeatedly.
Kubernetes delays restarts to avoid tight crash loops.
This is a symptom, not a root cause.

---

## Hands-on example

Assume:

* A working Kubernetes cluster
* `kubectl` is configured

---

### Initial state

No Pods exist.

```
kubectl get pods
```

```
No resources found in default namespace.
```

---

### Step 1: Create a crashing Pod

Create a Pod whose process exits immediately.

```
kubectl run crash-demo \
  --image=busybox \
  --restart=Always \
  -- sh -c 'exit 1'
```

```
pod/crash-demo created
```

Check status.

```
kubectl get pod crash-demo
```

```
NAME         READY   STATUS             RESTARTS   AGE
crash-demo   0/1     CrashLoopBackOff   3          30s
```

What changed:

* Container exited with non-zero code
* Kubernetes restarted it repeatedly

What did not change:

* Pod was not deleted or recreated

---

### Step 2: Inspect the failure

Check the last container exit.

```
kubectl describe pod crash-demo | grep -A5 "Last State"
```

```
Last State:     Terminated
  Reason:       Error
  Exit Code:    1
```

Check logs from the previous run.

```
kubectl logs crash-demo --previous
```

```
<no output>
```

What changed:

* Crash reason is visible

What did not change:

* Backoff continues

---

### Step 3: Fix the command

Replace the Pod with a valid long-running process.

```
kubectl delete pod crash-demo
```

```
pod "crash-demo" deleted
```

Create a fixed Pod.

```
kubectl run crash-demo \
  --image=busybox \
  --restart=Always \
  -- sh -c 'sleep 3600'
```

```
pod/crash-demo created
```

Check again.

```
kubectl get pod crash-demo
```

```
NAME         READY   STATUS    RESTARTS   AGE
crash-demo   1/1     Running   0          10s
```

---

## Key observation

* CrashLoopBackOff means the process exits
* Always inspect exit code and previous logs
