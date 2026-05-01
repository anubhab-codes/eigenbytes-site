# Deployment

A Deployment describes how to run pods and keep them running.

## Example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-deployment
spec:
  replicas: 3
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

## What it does

- Creates 3 replicas.
- Restarts pods if they fail.
- Updates pods with rolling deployment.
