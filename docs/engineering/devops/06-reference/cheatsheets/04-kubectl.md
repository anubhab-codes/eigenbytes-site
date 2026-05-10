---
title: kubectl
sidebar_position: 5
description: "kubectl cheatsheet — query resources, apply changes, debug pods, manage rollouts, and switch contexts"
---

# kubectl Cheatsheet

`kubectl` is the CLI for talking to a Kubernetes cluster. Every command follows the pattern:

```
kubectl <verb> <resource> <name>
```

---

## Context and cluster

```bash
kubectl config get-contexts            # list all clusters you can connect to
kubectl config current-context         # which cluster are you talking to right now?
kubectl config use-context my-cluster  # switch to a different cluster
kubectl config set-context --current --namespace=staging  # change default namespace
kubectl cluster-info                   # show cluster API server and DNS addresses
```

---

## Namespaces

```bash
kubectl get namespaces                 # list all namespaces
kubectl create namespace staging       # create a new namespace
kubectl delete namespace staging       # delete a namespace and everything in it

# Most commands accept -n to target a namespace:
kubectl get pods -n staging            # list pods in the "staging" namespace
kubectl get pods -A                    # list pods across all namespaces
```

---

## Get resources

```bash
kubectl get pods                       # list pods in current namespace
kubectl get pods -o wide               # list pods with extra info (node, IP)
kubectl get deployments                # list deployments
kubectl get services                   # list services
kubectl get ingress                    # list ingress rules
kubectl get configmaps                 # list configmaps
kubectl get secrets                    # list secrets (values are base64-encoded)
kubectl get nodes                      # list nodes in the cluster
kubectl get events --sort-by='.lastTimestamp'   # recent cluster events, newest last
kubectl get all                        # list pods, services, deployments, replicasets
```

---

## Inspect a resource

```bash
kubectl describe pod my-pod            # detailed view: events, conditions, containers
kubectl describe node my-node          # node capacity, allocated resources, events
kubectl describe deployment my-app     # deployment details and rollout status

kubectl get pod my-pod -o yaml         # show the full YAML of any resource
kubectl get pod my-pod -o json         # same as JSON
kubectl explain pod.spec.containers    # show documentation for a field
```

---

## Apply and delete

```bash
kubectl apply -f manifest.yaml         # create or update resource from a YAML file
kubectl apply -f ./k8s/                # apply all YAML files in a directory
kubectl apply -k ./overlays/staging    # apply a Kustomize overlay

kubectl delete -f manifest.yaml        # delete resource defined in a file
kubectl delete pod my-pod              # delete a specific pod (it will restart if managed)
kubectl delete pod my-pod --force      # force delete immediately (use for stuck pods)
kubectl delete deployment my-app       # delete a deployment (stops all its pods)
```

---

## Debug pods

```bash
kubectl logs my-pod                    # show logs for a pod
kubectl logs my-pod -f                 # follow logs live
kubectl logs my-pod --tail=100         # last 100 lines
kubectl logs my-pod -c sidecar        # logs from a specific container in a multi-container pod
kubectl logs my-pod --previous         # logs from the previous (crashed) container

kubectl exec -it my-pod -- bash        # open a shell inside a pod
kubectl exec my-pod -- ls /app         # run a single command inside a pod
kubectl exec -it my-pod -c sidecar -- sh  # shell into a specific container

kubectl port-forward pod/my-pod 8080:3000     # forward local port 8080 to pod port 3000
kubectl port-forward svc/my-service 8080:80   # forward to a service instead

kubectl cp my-pod:/app/log.txt ./log.txt      # copy a file out of a pod
```

---

## Deployments and rollouts

```bash
kubectl rollout status deployment/my-app       # is the rollout finished?
kubectl rollout history deployment/my-app      # show rollout history
kubectl rollout undo deployment/my-app         # roll back to the previous version
kubectl rollout undo deployment/my-app --to-revision=3   # roll back to a specific revision

kubectl scale deployment my-app --replicas=5   # manually scale a deployment
kubectl set image deployment/my-app app=myapp:2.0   # update the container image
kubectl edit deployment my-app                 # edit the deployment YAML in your editor
```

---

## Resource usage

```bash
kubectl top pods                       # CPU and memory usage per pod
kubectl top pods -A                    # all namespaces
kubectl top nodes                      # CPU and memory usage per node
```

---

## Labels and selectors

```bash
kubectl get pods -l app=my-app                 # list pods with a specific label
kubectl get pods -l env=prod,tier=backend      # multiple label filters
kubectl label pod my-pod env=debug             # add a label to a pod
kubectl annotate pod my-pod owner=team-a       # add an annotation
```

---

## Common quick patterns

```bash
# Watch pods until they are ready
kubectl get pods -w

# Get a shell in a fresh throwaway pod
kubectl run debug --image=busybox -it --rm -- sh

# Check why a pod is not starting
kubectl describe pod my-pod | grep -A 10 Events

# See all resources a service account can do
kubectl auth can-i --list --as=system:serviceaccount:default:my-sa

# Decode a secret value
kubectl get secret my-secret -o jsonpath='{.data.password}' | base64 --decode
```
