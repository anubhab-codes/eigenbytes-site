# ReplicaSet

A ReplicaSet ensures a specified number of pod replicas are running.

## Example

```yaml
kind: ReplicaSet
apiVersion: apps/v1
metadata:
  name: web-rs
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: nginx
```

## Relationship

A Deployment manages a ReplicaSet. You rarely create ReplicaSets directly.
