---
title: Volumes and Data
sidebar_position: 5
description: "Persistent data in Docker — named volumes, bind mounts, and when to use each"
---

# Volumes and Data

A PostgreSQL container starts. You insert data. You stop the container. You run it again. The data is gone.

Containers are ephemeral. Their filesystem is reset on every new container creation. For anything that needs to survive — database files, user uploads, config — you need a volume.

---

## Two options

**Named volumes** — managed by Docker. Data lives in Docker's storage area (`/var/lib/docker/volumes/`). The container gets a path; Docker handles the rest. Use for databases and anything where data must persist across container replacements.

**Bind mounts** — you specify a path on your host machine. The container reads and writes directly to your filesystem. Use for development (live code reload) or sharing config files from the host.

| | Named Volume | Bind Mount |
|---|-------------|-----------|
| Managed by | Docker | You |
| Data location | Docker's storage area | Anywhere on host |
| Portability | ✓ | ✗ (path must exist) |
| Use case | Production data | Dev workflow, host config |

---

## Hands-on

### Named volume — persist database data

```bash
# Create a named volume
docker volume create pgdata

# Use it with a postgres container
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=secret \
  -v pgdata:/var/lib/postgresql/data \
  postgres:15

# Insert data
docker exec -it postgres psql -U postgres -c "CREATE TABLE test (id serial);"
docker exec -it postgres psql -U postgres -c "INSERT INTO test DEFAULT VALUES;"

# Stop and remove the container
docker rm -f postgres

# Start a new container with the same volume
docker run -d \
  --name postgres2 \
  -e POSTGRES_PASSWORD=secret \
  -v pgdata:/var/lib/postgresql/data \
  postgres:15

# Data is still there
docker exec -it postgres2 psql -U postgres -c "SELECT * FROM test;"
```

The container is new. The data survived.

### Bind mount — live code reload in development

```bash
mkdir ~/dev-app && cd ~/dev-app
echo "<h1>Hello</h1>" > index.html

docker run -d \
  --name dev-server \
  -p 8080:80 \
  -v $(pwd):/usr/share/nginx/html \
  nginx

curl http://localhost:8080
# <h1>Hello</h1>

# Edit the file on your host
echo "<h1>Updated!</h1>" > index.html

# The change is immediately visible in the container
curl http://localhost:8080
# <h1>Updated!</h1>
```

No rebuild needed. The bind mount makes the container read your local files directly.

### Inspect a volume

```bash
docker volume ls                        # list all volumes
docker volume inspect pgdata            # see where data is stored
```

---

## Cleanup

```bash
docker rm -f postgres2 dev-server
docker volume rm pgdata
rm -rf ~/dev-app
```

---

## Quick reference

```bash
docker volume create <name>             # create named volume
docker volume ls                        # list volumes
docker volume inspect <name>            # details + mount path
docker volume rm <name>                 # remove volume
docker volume prune                     # remove unused volumes

# Mount in run
-v <volume>:<container-path>            # named volume
-v $(pwd):<container-path>             # bind mount (current directory)
-v /absolute/path:<container-path>     # bind mount (absolute path)
```
