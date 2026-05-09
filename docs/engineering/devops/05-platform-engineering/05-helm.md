---
title: Helm
sidebar_position: 6
description: "Kubernetes package management — charts, templates, values, and deploying to multiple environments"
---

# Helm

You want to deploy the same application to three environments: dev, staging, production. The YAML is 90% identical. The image tag, replica count, resource limits, and ingress hostname differ.

You have two bad options: copy the YAML three times (now you have three copies to maintain) or write a shell script that patches the YAML (now you have a fragile script to maintain).

So you use Helm. Helm packages Kubernetes resources into **charts** — templates with configurable values. Deploy with different values for different environments. One chart, three deployments.

---

## The chart structure

```
my-chart/
├── Chart.yaml          ← chart metadata (name, version, description)
├── values.yaml         ← default configuration values
└── templates/          ← Kubernetes manifests with Go template syntax
    ├── deployment.yaml
    ├── service.yaml
    └── ingress.yaml
```

**Chart.yaml** defines the chart:

```yaml
apiVersion: v2
name: my-app
description: A simple web application
version: 1.0.0
appVersion: "2.3.1"
```

**values.yaml** defines the defaults:

```yaml
replicaCount: 1
image:
  repository: my-org/my-app
  tag: "2.3.1"
  pullPolicy: IfNotPresent
service:
  type: ClusterIP
  port: 80
resources:
  limits:
    memory: 256Mi
    cpu: 200m
```

**A template** uses Go template syntax to inject values:

```yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-app
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
      - name: app
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        resources:
          limits:
            memory: {{ .Values.resources.limits.memory }}
            cpu: {{ .Values.resources.limits.cpu }}
```

---

## Releases

When you deploy a chart with Helm, you create a **release**. A release is an instance of a chart running in the cluster with a specific set of values.

You can have multiple releases of the same chart. `helm install prod my-chart` and `helm install staging my-chart` are two independent releases.

---

## Hands-on

:::info Lab files
Fork [eigenbytes-devops-labs](https://github.com/anubhab-codes/eigenbytes-devops-labs) — a complete chart is ready in `05-platform-engineering/helm/my-app/`. Skip the `helm create` step and deploy directly.
:::

### Create a chart

```bash
helm create my-app
ls my-app/
# Chart.yaml  charts/  templates/  values.yaml
```

Helm scaffolds a complete chart with example templates. Review the structure, then deploy it.

### Deploy to local Kubernetes

```bash
# Install the chart with default values
helm install my-release my-app/

# Check what was deployed
helm list
kubectl get all -l app.kubernetes.io/instance=my-release

# See what Helm would apply (dry run)
helm install my-release my-app/ --dry-run --debug | head -60
```

### Override values for a different environment

```bash
# Create a values file for production
cat > values-prod.yaml << 'EOF'
replicaCount: 3
image:
  tag: "2.3.1"
resources:
  limits:
    memory: 512Mi
    cpu: 500m
EOF

# Deploy production with overrides
helm install prod my-app/ -f values-prod.yaml

# Or override inline
helm install staging my-app/ \
  --set replicaCount=2 \
  --set image.tag=2.2.0
```

### Upgrade and rollback

```bash
# Upgrade to a new image
helm upgrade my-release my-app/ --set image.tag=2.4.0

# View history
helm history my-release

# Rollback to previous version
helm rollback my-release

# Rollback to specific revision
helm rollback my-release 2
```

### Use a chart from a repository

```bash
# Add the ingress-nginx chart repository
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Search for charts
helm search repo nginx

# Install
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace

# Check values for a chart
helm show values ingress-nginx/ingress-nginx | head -30
```

---

## Cleanup

```bash
helm uninstall my-release staging prod --ignore-not-found
helm uninstall ingress-nginx -n ingress-nginx --ignore-not-found
```

---

## Quick reference

```bash
helm create <name>                           # scaffold a chart
helm install <release> <chart>               # deploy
helm install <release> <chart> -f values.yaml  # with values file
helm upgrade <release> <chart>               # update
helm rollback <release>                      # rollback
helm uninstall <release>                     # delete
helm list                                    # list releases
helm history <release>                       # deployment history
helm repo add <name> <url>                   # add chart repo
helm repo update                             # refresh repos
helm search repo <term>                      # find charts
helm show values <chart>                     # show default values
helm template <release> <chart>             # render templates without deploying
helm diff upgrade <release> <chart>         # show what would change (plugin)
```

---

> Lab files: [eigenbytes-devops-labs/05-platform-engineering/helm](https://github.com/anubhab-codes/eigenbytes-devops-labs/tree/main/05-platform-engineering/helm)
