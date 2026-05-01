# Kubernetes Hands-On Guide

This guide walks you through a small, concrete Kubernetes deployment.

## Step 1: create deployment

```bash
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-deploy
spec:
  replicas: 2
  selector:
    matchLabels:
      app: hello
  template:
    metadata:
      labels:
        app: hello
    spec:
      containers:
      - name: hello
        image: hashicorp/http-echo:0.2.3
        args:
        - "-text=Hello from Kubernetes"
EOF
```

## Step 2: expose service

```bash
kubectl expose deployment hello-deploy --type=ClusterIP --name=hello-service --port=5678 --target-port=5678
```

## Step 3: verify

```bash
kubectl get pods
kubectl get svc hello-service
```

## Result

You have a running application with a Deployment, pods, and a service.
