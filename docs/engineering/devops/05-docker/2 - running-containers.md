---
title: Running Containers
toc:
  max_depth: 2
---

# Running Containers (Hands-on Basics)

This article is hands-on.
You will pull images and run containers.
No Dockerfile yet.

---

## Step 1: Confirm Docker works

```bash
docker version
```

What you see:
- Client section
- Server section

If Server is missing, Docker Engine is not running.

---

## Step 2: Pull an image

```bash
docker pull hello-world
```

What you see (sample):
```text
Using default tag: latest
latest: Pulling from library/hello-world
Digest: sha256:...
Status: Downloaded newer image for hello-world:latest
```

What this means:
- Docker downloaded the image locally
- Image is now available to run

---

## Step 3: Run a container

```bash
docker run hello-world
```

What you see:
- a message printed by the container
- then it exits

Important:
- A container is a process.
- This process finished, so the container stopped.

---

## Step 4: List running containers

```bash
docker ps
```

What you see:
- probably nothing (hello-world already exited)

---

## Step 5: List all containers (including stopped)

```bash
docker ps -a
```

What you see (sample):
```text
CONTAINER ID   IMAGE         COMMAND    STATUS                     NAMES
a1b2c3d4e5f6   hello-world   "/hello"   Exited (0) 10 seconds ago   gifted_panini
```

What this means:
- The container exists (metadata)
- It is not running

---

## Step 6: Run an interactive container

```bash
docker run -it alpine:latest sh
```

What you see:
- you get a shell prompt inside the container

Try:

```sh
uname -a
cat /etc/os-release
ls -la
```

Exit:

```sh
exit
```

What happens:
- container stops when the main process ends

---

## Step 7: Run in detached mode

```bash
docker run -d --name web nginx:alpine
```

What you see:
- a long container id

Check it is running:

```bash
docker ps
```

Sample output:
```text
CONTAINER ID   IMAGE         STATUS          NAMES
8f1c...        nginx:alpine  Up 10 seconds   web
```

---

## Step 8: View logs

```bash
docker logs web
```

What you see:
- nginx startup logs

Logs come from stdout/stderr of the container process.

---

## Step 9: Execute a command inside a running container

```bash
docker exec -it web sh
```

Try:

```sh
nginx -v
ls -la /usr/share/nginx/html
exit
```

---

## Step 10: Stop and remove containers

Stop:

```bash
docker stop web
```

Remove:

```bash
docker rm web
```

Verify:

```bash
docker ps -a
```

---

## Step 11: Clean up stopped containers (optional)

```bash
docker container prune
```

What you see:
- a list of removed containers
- reclaimed space

---

## Step 12: Images on your machine

```bash
docker images
```

Sample output:
```text
REPOSITORY    TAG      IMAGE ID       SIZE
nginx         alpine   123456789abc   20MB
alpine        latest   987654321def   7MB
hello-world   latest   111111111111   13kB
```

Remove an image (only if no containers depend on it):

```bash
docker rmi hello-world
```

---

## Quick mental model

- `docker pull` downloads an image
- `docker run` creates + starts a container
- `docker ps` shows running containers
- `docker ps -a` shows all containers
- `docker logs` shows output
- `docker exec` runs commands in a running container
- `docker stop` stops a container process
- `docker rm` removes container metadata
