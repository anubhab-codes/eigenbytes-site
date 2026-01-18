---

title: PersistentVolumeClaim vs emptyDir
toc:
max_depth: 2
------------

## Short theory

`emptyDir` provides temporary storage tied to a Pod lifecycle.
A PersistentVolumeClaim (PVC) provides storage that outlives Pods.
`emptyDir` is deleted when the Pod is deleted.
PVC-backed volumes survive Pod restarts and rescheduling.

---

## Hands-on example

Assume:

* A working Kubernetes cluster
* A default StorageClass exists
* `kubectl` is configured

---

### Initial state

No Pods or PVCs exist.

```
kubectl get pods
kubectl get pvc
```

```
No resources found in default namespace.
No resources found in default namespace.
```

---

### Step 1: Use emptyDir storage

Create a Pod with `emptyDir`.

```
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: emptydir-demo
spec:
  containers:
  - name: app
    image: busybox
    command: ["sh", "-c", "echo data > /data/file && sleep 3600"]
    volumeMounts:
    - name: tmp
      mountPath: /data
  volumes:
  - name: tmp
    emptyDir: {}
EOF
```

```
pod/emptydir-demo created
```

Verify data.

```
kubectl exec emptydir-demo -- cat /data/file
```

```
data
```

Delete the Pod.

```
kubectl delete pod emptydir-demo
```

```
pod "emptydir-demo" deleted
```

Recreate the same Pod.

```
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: emptydir-demo
spec:
  containers:
  - name: app
    image: busybox
    command: ["sh", "-c", "ls /data || true"]
    volumeMounts:
    - name: tmp
      mountPath: /data
  volumes:
  - name: tmp
    emptyDir: {}
EOF
```

```
pod/emptydir-demo created
```

Check contents.

```
kubectl logs emptydir-demo
```

```
ls: /data: No such file or directory
```

What changed:

* Data was lost

What did not change:

* Pod spec stayed the same

---

### Step 2: Use PersistentVolumeClaim storage

Create a PVC.

```
kubectl apply -f - <<EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-demo
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
EOF
```

```
persistentvolumeclaim/pvc-demo created
```

Create a Pod using the PVC.

```
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: pvc-pod
spec:
  containers:
  - name: app
    image: busybox
    command: ["sh", "-c", "echo data > /data/file && sleep 3600"]
    volumeMounts:
    - name: data
      mountPath: /data
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: pvc-demo
EOF
```

```
pod/pvc-pod created
```

Verify data.

```
kubectl exec pvc-pod -- cat /data/file
```

```
data
```

Delete the Pod.

```
kubectl delete pod pvc-pod
```

```
pod "pvc-pod" deleted
```

Recreate it.

```
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: pvc-pod
spec:
  containers:
  - name: app
    image: busybox
    command: ["sh", "-c", "cat /data/file"]
    volumeMounts:
    - name: data
      mountPath: /data
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: pvc-demo
EOF
```

```
pod/pvc-pod created
```

Check logs.

```
kubectl logs pvc-pod
```

```
data
```

---

## Key observation

* `emptyDir` is Pod-scoped and disposable
* PVC-backed storage survives Pod deletion
