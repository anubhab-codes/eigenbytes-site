# Kubernetes Component Decision

Kubernetes has components for control plane, nodes, and add-ons.

## Decision model

- Use kube-apiserver for state and admission.
- Use kube-scheduler to place pods.
- Use kubelet on each node to manage containers.
- Use kube-proxy for service networking.

This separation keeps cluster control isolated from workload execution.
