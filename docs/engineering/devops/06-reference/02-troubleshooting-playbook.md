---
title: Troubleshooting Playbook
sidebar_position: 3
description: "A layer-by-layer diagnostic guide — from OS failures to container issues to Kubernetes problems"
---

# Troubleshooting Playbook

Production failures rarely announce themselves clearly. The symptom is "the app is down." The cause could be anywhere in the stack.

This playbook is organized by layer. Start at the bottom and work up. The layer that breaks first is usually the layer that matters.

---

## Layer 1: Is the server up?

```bash
# Can you SSH in?
ssh user@host

# If not: check cloud console, security groups, instance state
# If yes: proceed to next layer
```

```bash
# Is the OS healthy?
uptime                          # how long has it been up? recent restart?
df -h                           # is the disk full?
free -h                         # is memory exhausted?
top                             # is CPU pegged?
dmesg | tail -20                # kernel errors?
```

**Disk full** is one of the most common production failures. When `/var/log` fills up, services stop writing logs and often crash. When the root filesystem fills up, the OS may become unstable.

```bash
# Find what is consuming disk
du -sh /var/* 2>/dev/null | sort -rh | head -10
find /var/log -size +100M -type f
```

---

## Layer 2: Is the service running?

```bash
# Is the process running?
systemctl status <service>
pgrep -a <process-name>

# Is it listening on the expected port?
ss -tlnp | grep :<port>

# Any errors in the service logs?
journalctl -u <service> -n 50 --no-pager
journalctl -u <service> --since "5 minutes ago"
```

**Service crashed silently** — check `journalctl -u <service> -b` for logs from the current boot.

**Port already in use** — `lsof -i :<port>` to see what else has it.

---

## Layer 3: Is the network OK?

```bash
# Basic connectivity
ping 8.8.8.8                    # can I reach the internet?
ping <internal-host>             # can I reach other internal hosts?

# Can I reach the service on its port?
nc -zv <host> <port>

# DNS resolution
nslookup <hostname>
dig +short <hostname>

# Active connections
ss -tnp | grep <port>
```

**DNS failing but connectivity works** — check `/etc/resolv.conf`. Try `dig @8.8.8.8 <hostname>` to bypass local DNS.

**Port unreachable** — check firewall rules (`iptables -L`, security groups). The service may be running but bound to `127.0.0.1` instead of `0.0.0.0`.

---

## Layer 4: Is the container running?

```bash
# List containers
docker ps
docker ps -a                    # includes stopped containers

# Why did a container stop?
docker inspect <name> | grep -A 5 '"State"'
docker logs <name> --tail 50
docker logs <name> --since 10m

# Get a shell for investigation
docker exec -it <name> sh

# Resource usage
docker stats --no-stream
```

**OOMKilled** — the container exceeded its memory limit. Check `docker inspect <name> | grep OOMKilled`.

**Exit code 1** — application error. Read the logs.

**ImagePullBackOff** — image does not exist or registry credentials are missing.

---

## Layer 5: Is the Kubernetes pod running?

```bash
# Pod status
kubectl get pods
kubectl get pods -A             # all namespaces

# Why is it in that state?
kubectl describe pod <name>     # read the Events section at the bottom

# Logs
kubectl logs <name>
kubectl logs <name> --previous  # last crash

# Shell in for investigation
kubectl exec -it <name> -- sh
```

### By status

| Status | Start here |
|--------|-----------|
| `Pending` | `kubectl describe pod` → check Events for scheduling failure |
| `CrashLoopBackOff` | `kubectl logs --previous` → check exit code |
| `ImagePullBackOff` | `kubectl describe pod` → check image name and pull secrets |
| `OOMKilled` | `kubectl describe pod` → check Last State, increase memory limit |
| `Running` but unhealthy | `kubectl get endpoints <svc>` → is traffic routing? |

---

## Layer 6: Is Kubernetes routing traffic correctly?

```bash
# Does the service exist?
kubectl get service <name>

# Does it have endpoints? (if not, selector doesn't match any pods)
kubectl get endpoints <name>

# What selector does the service use?
kubectl describe service <name> | grep Selector

# What labels do the pods have?
kubectl get pods --show-labels

# Test the service from inside the cluster
kubectl run test --image=curlimages/curl -it --rm --restart=Never -- \
  curl http://<service-name>.<namespace>.svc.cluster.local
```

**No endpoints** — the service selector does not match any pod labels. Labels are case-sensitive.

**Service exists but pod unreachable** — check if the pod's container is actually listening on the declared port.

---

## The universal checklist

When you don't know where to start, run this sequence.

```bash
# 1. What is the error message?
# (logs, status page, monitoring alert — read it carefully before doing anything)

# 2. When did it start?
kubectl get events --sort-by='.lastTimestamp' | tail -20
journalctl --since "30 minutes ago" | grep -i error

# 3. What changed recently?
git log --oneline -10            # recent commits
kubectl rollout history deployment/<name>

# 4. Is it the whole system or one component?
kubectl get pods -A | grep -v Running   # anything not running?
kubectl top nodes                        # any node under pressure?

# 5. Can you reproduce it?
# If yes: much easier to debug
# If no: look at logs from when it happened
```

---

## Common patterns

**"Worked yesterday, broken today"** — Something changed. Look at recent deployments, config changes, certificate expirations, disk space, and scheduled jobs.

**"Only happens under load"** — Resource limits, connection pool exhaustion, or a race condition. Check `kubectl top pods` during load. Check for OOMKilled.

**"Broken in one environment only"** — Configuration difference. Compare env vars, secrets, resource limits, and image tags between environments.

**"Works from inside the cluster, not from outside"** — Ingress, load balancer, or DNS issue. The service is fine; the routing layer is broken.
