---
title: Helm
sidebar_position: 6
description: "Helm cheatsheet — manage chart repos, install and upgrade releases, inspect and roll back"
---

# Helm Cheatsheet

Helm is the package manager for Kubernetes. A **chart** is a package. A **release** is a chart installed into your cluster.

---

## Repos

```bash
helm repo list                                          # list all chart repos you have added
helm repo add bitnami https://charts.bitnami.com/bitnami  # add the Bitnami repo
helm repo update                                        # pull latest charts from all repos
helm repo remove bitnami                                # remove a repo

helm search repo nginx                                  # search for charts named nginx
helm search repo nginx --versions                       # show all available versions
helm search hub wordpress                               # search the public Artifact Hub
```

---

## Inspect a chart before installing

```bash
helm show chart bitnami/nginx            # show chart metadata (name, version, description)
helm show values bitnami/nginx           # show all configurable values and their defaults
helm show readme bitnami/nginx           # show the chart README
```

---

## Install

```bash
helm install my-nginx bitnami/nginx                     # install with a release name
helm install my-nginx bitnami/nginx --namespace prod    # install into a specific namespace
helm install my-nginx bitnami/nginx --create-namespace  # create namespace if it does not exist
helm install my-nginx bitnami/nginx --set replicaCount=3          # override one value
helm install my-nginx bitnami/nginx -f my-values.yaml             # use a values file
helm install my-nginx bitnami/nginx -f values.yaml --set image.tag=1.25  # file + override

helm install my-nginx ./my-chart/        # install from a local chart directory
```

---

## Upgrade

```bash
helm upgrade my-nginx bitnami/nginx                    # upgrade to latest chart version
helm upgrade my-nginx bitnami/nginx --set replicaCount=5  # upgrade with a value change
helm upgrade my-nginx bitnami/nginx -f values.yaml     # upgrade with a values file
helm upgrade my-nginx bitnami/nginx --version 13.0.0   # upgrade to a specific chart version

helm upgrade --install my-nginx bitnami/nginx          # install if not exists, upgrade if it does
```

---

## Inspect releases

```bash
helm list                              # list all releases in current namespace
helm list -A                           # list releases in all namespaces
helm list -n prod                      # list releases in a specific namespace

helm status my-nginx                   # show the status of a release
helm get values my-nginx               # show the values used for this release
helm get values my-nginx --all         # show all values including defaults
helm get manifest my-nginx             # show the rendered Kubernetes manifests
helm history my-nginx                  # show revision history of a release
```

---

## Rollback

```bash
helm rollback my-nginx                 # roll back to the previous revision
helm rollback my-nginx 2               # roll back to revision 2 specifically
helm history my-nginx                  # check revision numbers before rolling back
```

---

## Uninstall

```bash
helm uninstall my-nginx                # delete a release (removes all Kubernetes resources)
helm uninstall my-nginx --keep-history # delete but keep history for rollback
```

---

## Template and debug

```bash
helm template my-nginx bitnami/nginx           # render the manifests without installing
helm template my-nginx bitnami/nginx -f values.yaml  # render with your values
helm lint ./my-chart/                          # check a local chart for errors
helm install my-nginx bitnami/nginx --dry-run  # simulate install, show what would happen
```

---

## Package and publish a chart

```bash
helm package ./my-chart/               # bundle a chart directory into a .tgz file
helm push my-chart-1.0.0.tgz oci://registry.example.com/charts  # push to an OCI registry
```
