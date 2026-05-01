# What a Pod Is

A Pod is the smallest deployable unit in Kubernetes. It contains one or more containers that share network and storage.

## Example definition

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
  - name: nginx
    image: nginx:stable
```

## Mental model

Think of a pod as a single application process with attached resources.
