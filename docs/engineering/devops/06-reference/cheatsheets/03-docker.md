---
title: Docker
sidebar_position: 4
description: "Docker command cheatsheet — images, containers, compose, volumes, networks, and cleanup"
---

# Docker Cheatsheet

---

## Images

```bash
docker images                          # list all images on your machine
docker pull nginx                      # download the latest nginx image
docker pull nginx:1.25                 # download a specific version
docker build -t myapp:1.0 .            # build an image from a Dockerfile in current dir
docker build -t myapp:1.0 -f Dockerfile.prod .   # use a specific Dockerfile

docker tag myapp:1.0 myrepo/myapp:1.0  # tag an image for a registry
docker push myrepo/myapp:1.0           # push an image to a registry

docker rmi nginx                       # delete an image
docker rmi $(docker images -q)         # delete all images (careful)
docker image inspect nginx             # show full details of an image
```

---

## Run containers

```bash
docker run nginx                       # run a container (attached, blocks terminal)
docker run -d nginx                    # run in the background (detached)
docker run -d -p 8080:80 nginx         # run + map port 8080 on host to 80 in container
docker run -d --name webserver nginx   # give the container a name
docker run -it ubuntu bash             # run interactively with a shell (-i = interactive, -t = terminal)
docker run --rm ubuntu echo "hello"    # run, print, and delete the container when done
docker run -e DB_HOST=localhost myapp  # pass an environment variable
docker run -v /host/path:/container/path nginx  # mount a host folder into the container
```

---

## Manage running containers

```bash
docker ps                              # list running containers
docker ps -a                           # list all containers including stopped ones
docker stop webserver                  # gracefully stop a container
docker start webserver                 # start a stopped container
docker restart webserver               # stop then start a container
docker kill webserver                  # force-stop a container immediately
docker rm webserver                    # delete a stopped container
docker rm -f webserver                 # force-delete a running container
```

---

## Get inside containers

```bash
docker exec -it webserver bash         # open a shell inside a running container
docker exec webserver ls /etc/nginx    # run a single command inside a container
docker logs webserver                  # show all logs from a container
docker logs -f webserver               # follow logs live
docker logs --tail 50 webserver        # last 50 lines of logs
docker cp webserver:/etc/nginx.conf .  # copy a file from container to host
docker cp ./local.conf webserver:/etc/ # copy a file from host to container
```

---

## Inspect containers

```bash
docker inspect webserver               # full JSON details of a container
docker stats                           # live CPU/memory usage for all containers
docker stats webserver                 # live stats for one container
docker top webserver                   # show processes running inside a container
docker port webserver                  # show port mappings for a container
```

---

## Volumes

```bash
docker volume ls                       # list all volumes
docker volume create mydata            # create a named volume
docker volume inspect mydata           # show where data is stored on the host
docker volume rm mydata                # delete a volume
docker run -v mydata:/app/data myapp   # use a named volume in a container
```

---

## Networks

```bash
docker network ls                      # list all networks
docker network create mynet            # create a custom network
docker network inspect mynet           # show containers connected to a network
docker run --network mynet myapp       # start container on a specific network
docker network connect mynet container # connect a running container to a network
docker network disconnect mynet container  # disconnect a container from a network
```

---

## Docker Compose

```bash
docker compose up                      # start all services defined in compose.yaml
docker compose up -d                   # start in the background
docker compose up --build              # rebuild images before starting
docker compose down                    # stop and remove containers
docker compose down -v                 # stop, remove containers and delete volumes too

docker compose ps                      # list running services
docker compose logs                    # show logs from all services
docker compose logs -f app             # follow logs for one service named "app"
docker compose exec app bash           # open a shell in a running service
docker compose restart app             # restart one service
docker compose build                   # build all images without starting
docker compose pull                    # pull latest images for all services
```

---

## Cleanup

```bash
docker system df                       # show how much disk Docker is using
docker system prune                    # delete stopped containers, unused networks, dangling images
docker system prune -a                 # also delete all images not used by a container (aggressive)
docker container prune                 # delete all stopped containers
docker image prune                     # delete dangling (untagged) images
docker image prune -a                  # delete all unused images
docker volume prune                    # delete all unused volumes
```
