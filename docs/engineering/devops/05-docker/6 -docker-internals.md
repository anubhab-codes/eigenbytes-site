# Docker Internals

Docker uses a layered storage driver and a lightweight runtime to isolate containers.

## Components

- Image: read-only filesystem.
- Container: writable layer on top of the image.
- Daemon: manages images and containers.

## Example inspect

```bash
docker inspect web
```

## Diagram

```mermaid
graph LR
  Image --> Container
  Container --> Daemon
  Daemon -->|controls| Kernel
```
