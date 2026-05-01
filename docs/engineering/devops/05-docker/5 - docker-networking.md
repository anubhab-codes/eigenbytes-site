---
title: Docker Networking
toc:
  max_depth: 2
---

# Docker Networking

Students usually struggle with two things:
- ports
- container-to-container communication

This article keeps networking simple and practical.

---

## Host port vs container port

A container has its own network namespace.
Services listen on container ports.

You publish a container port to the host with `-p`.

Example:

```bash
docker run -d --name web -p 8080:80 nginx:alpine
```

What this means:
- nginx listens on container port 80
- host port 8080 forwards to container port 80

Check:

```bash
docker ps
```

Sample output (short):
```text
NAMES  PORTS
web    0.0.0.0:8080->80/tcp
```

Test from host:

```bash
curl -I http://localhost:8080
```

Sample output (short):
```text
HTTP/1.1 200 OK
Server: nginx
```

Cleanup:

```bash
docker rm -f web
```

---

## Why user-defined networks matter

Default bridge network works, but name resolution is limited.
User-defined networks give DNS for container names.

Use user-defined networks for multi-container apps.

---

## Create a user-defined network

```bash
docker network create appnet
docker network ls
```

Inspect:

```bash
docker network inspect appnet
```

---

## Container-to-container by name

Start a simple HTTP echo server:

```bash
docker run -d --name api --network appnet hashicorp/http-echo -text="hello from api"
```

Start a client container:

```bash
docker run --rm -it --network appnet alpine:latest sh
```

Inside client container:

```sh
apk add --no-cache curl
curl http://api:5678
exit
```

Expected output:
```text
hello from api
```

Why this works:
- `api` resolves via Docker DNS on the user-defined network

Cleanup:

```bash
docker rm -f api
docker network rm appnet
```

---

## Inspect a container IP (debug tool)

```bash
docker run -d --name web nginx:alpine
docker inspect web -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'
docker rm -f web
```

Use this for debugging.
Do not build systems using container IPs.

---

## Common networking mistakes

- using container IPs in config (IPs change)
- forgetting `-p` and wondering why host cannot reach container
- using `localhost` inside container expecting host (it points to the container)
