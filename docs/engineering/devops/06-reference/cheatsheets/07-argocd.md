---
title: ArgoCD
sidebar_position: 8
description: "ArgoCD CLI cheatsheet — manage apps, sync, diff, rollback, and inspect deployment state"
---

# ArgoCD Cheatsheet

ArgoCD watches a Git repo and keeps your Kubernetes cluster in sync with it. The CLI lets you do everything the UI does, from your terminal.

---

## Login

```bash
argocd login argocd.example.com                    # login to an ArgoCD server
argocd login argocd.example.com --insecure         # skip TLS verification (for local/dev)
argocd login argocd.example.com --sso              # login using SSO/browser flow
argocd logout argocd.example.com                   # logout

argocd context                                     # show all saved server contexts
argocd context my-cluster                          # switch to a saved context
```

---

## List and inspect apps

```bash
argocd app list                        # list all applications
argocd app get my-app                  # show status, health, and sync state of an app
argocd app diff my-app                 # show what is different between Git and the cluster
argocd app manifests my-app            # show the rendered manifests ArgoCD would apply
argocd app history my-app              # show deployment history (revision, date, status)
```

---

## Sync an app

```bash
argocd app sync my-app                 # sync the app (apply Git state to the cluster)
argocd app sync my-app --force         # force sync even if already in sync
argocd app sync my-app --prune         # delete resources that are no longer in Git
argocd app sync my-app --dry-run       # show what would change without applying it
argocd app sync my-app --revision v2.1 # sync to a specific Git tag or commit
argocd app sync my-app --resource apps:Deployment:my-app  # sync only one resource
```

---

## Wait for sync to finish

```bash
argocd app wait my-app                 # block until the app is Synced and Healthy
argocd app wait my-app --health        # block until the app is Healthy
argocd app wait my-app --timeout 120   # wait up to 120 seconds
```

---

## Create and update apps

```bash
# Create an app pointing to a Git repo
argocd app create my-app \
  --repo https://github.com/myorg/myrepo.git \
  --path k8s/overlays/prod \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace prod \
  --sync-policy automated

# Create an app from a Helm chart
argocd app create my-nginx \
  --repo https://charts.bitnami.com/bitnami \
  --helm-chart nginx \
  --revision 15.0.0 \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace prod

argocd app set my-app --sync-policy automated    # enable auto-sync on an existing app
argocd app set my-app --self-heal                # re-sync if someone manually changes the cluster
argocd app set my-app --auto-prune               # delete resources removed from Git
argocd app set my-app -p replicaCount=3          # override a Helm parameter
```

---

## Rollback

```bash
argocd app history my-app              # find the revision ID to roll back to
argocd app rollback my-app 5           # roll back to revision 5
```

---

## Delete apps

```bash
argocd app delete my-app               # delete the ArgoCD app (leaves cluster resources)
argocd app delete my-app --cascade     # delete app AND all Kubernetes resources it created
```

---

## Repos

```bash
argocd repo list                       # list all repos ArgoCD knows about
argocd repo add https://github.com/myorg/myrepo.git --username git --password mytoken
argocd repo rm https://github.com/myorg/myrepo.git
```

---

## Projects

```bash
argocd proj list                       # list all projects
argocd proj get my-project             # show project details and permissions
argocd proj create my-project          # create a project
argocd proj delete my-project          # delete a project
```

---

## Accounts and RBAC

```bash
argocd account list                    # list all ArgoCD accounts
argocd account get my-user             # show user details and capabilities
argocd account update-password         # change your password
argocd account generate-token          # generate an API token for automation
```
