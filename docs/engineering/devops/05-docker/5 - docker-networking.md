# Docker Networking

Docker networking connects containers and the host.

## Example

```bash
docker network create app-net
docker run -d --network app-net --name web nginx
```

## Result

Containers on `app-net` can discover each other by name.

## Diagram

```mermaid
flowchart LR
  Browser --> Host[Host network]
  Host --> Container[nginx container]
  Container -->|bridge| DockerNet
```
