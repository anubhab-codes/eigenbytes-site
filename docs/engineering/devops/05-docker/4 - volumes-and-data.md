---
title: Containers Are Ephemeral
toc:
  max_depth: 2
---

# Containers Are Ephemeral (Volumes and Data)

A container is not a server.
A container is a process.
When it dies, its writable layer is disposable.

If students miss this, they lose data and panic.

---

## Demonstration: data disappears

Run a container and create a file inside it:

```bash
docker run -it --name temp alpine:latest sh
```

Inside container:

```sh
echo "important" > /data.txt
ls -la /data.txt
exit
```

Remove the container:

```bash
docker rm temp
```

Start a new container:

```bash
docker run -it alpine:latest sh
ls -la /data.txt
```

What you see:
- file is missing

What this means:
- container writable layer is not durable
- new container starts fresh

---

## Two ways to persist data

1) Volumes (managed by Docker)  
2) Bind mounts (map a host folder into the container)

Use volumes for most cases.
Use bind mounts for local development.

---

## Volumes (recommended)

Create a volume:

```bash
docker volume create appdata
```

List volumes:

```bash
docker volume ls
```

Inspect a volume:

```bash
docker volume inspect appdata
```

Sample output (short):
```text
[
  {
    "Name": "appdata",
    "Mountpoint": "/var/lib/docker/volumes/appdata/_data"
  }
]
```

---

## Use a volume with a container

Write data into the volume:

```bash
docker run --rm -it -v appdata:/data alpine:latest sh
```

Inside container:

```sh
mkdir -p /data/demo
echo "persisted" > /data/demo/value.txt
ls -la /data/demo
exit
```

Start a new container with the same volume:

```bash
docker run --rm -it -v appdata:/data alpine:latest sh
cat /data/demo/value.txt
exit
```

What you see:
- the file still exists

---

## Bind mounts (for local development)

Create a host folder and file:

```bash
mkdir -p host-data
echo "from host" > host-data/hello.txt
```

Run container with bind mount:

```bash
docker run --rm -it -v "$(pwd)/host-data":/data alpine:latest sh
```

Inside container:

```sh
ls -la /data
cat /data/hello.txt
echo "from container" > /data/container.txt
exit
```

Back on host:

```bash
ls -la host-data
cat host-data/container.txt
```

---

## Volume vs bind mount (simple rule)

Volume:
- Docker manages location
- good for production
- avoids hardcoding host paths

Bind mount:
- exact host path
- best for development
- permissions can bite on Linux

---

## Cleaning volumes

Delete a specific volume:

```bash
docker volume rm appdata
```

Remove unused volumes:

```bash
docker volume prune
```

Be careful:
- prune deletes volumes not used by any container

---

## Inspect mounts on a container

Start a container:

```bash
docker run -d --name voltest -v appdata:/data nginx:alpine
```

Inspect mounts:

```bash
docker inspect voltest -f '{{json .Mounts}}'
```

Stop and remove:

```bash
docker rm -f voltest
```

Data in the volume remains unless you delete the volume.
