---
title: Images and Dockerfile
sidebar_position: 4
description: "How Docker images are built, how layers work, and how to write an efficient Dockerfile"
---

# Images and Dockerfile

You have an application. You need to package it so it runs the same everywhere.

An **image** is that package. A **Dockerfile** is the recipe for building it. Every line in a Dockerfile creates a layer. Layers stack on top of each other. The final stack is the image.

---

## Layers and caching

Docker builds images layer by layer. Each instruction (`FROM`, `RUN`, `COPY`, `CMD`) creates one layer. Layers are cached.

If nothing changed in a layer, Docker reuses the cached version. If something changed, that layer and every layer after it rebuild from scratch.

**The rule**: put the things that change least at the top, the things that change most at the bottom.

```dockerfile
# Bad — installs dependencies every time source code changes
FROM node:18
COPY . .                        # changes on every code edit
RUN npm install                 # rebuilds every time

# Good — dependencies cached as long as package.json doesn't change
FROM node:18
COPY package*.json ./           # only changes when deps change
RUN npm install                 # cached unless deps change
COPY . .                        # changes on code edit
```

---

## Dockerfile instructions

| Instruction | Purpose |
|-------------|---------|
| `FROM` | Base image to build on |
| `RUN` | Execute a command during build |
| `COPY` | Copy files from host to image |
| `ENV` | Set environment variables |
| `EXPOSE` | Document which port the app listens on |
| `CMD` | Default command when container starts |
| `ENTRYPOINT` | Executable that always runs (args appended) |
| `WORKDIR` | Set working directory for subsequent instructions |
| `USER` | Run subsequent instructions as this user |

---

## Hands-on

### Build a Python app image

Create this structure:
```
myapp/
├── Dockerfile
├── requirements.txt
└── app.py
```

`app.py`:
```python
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello from Docker"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

`requirements.txt`:
```
flask==3.0.0
```

`Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app.py .

EXPOSE 5000

CMD ["python", "app.py"]
```

Build and run:

```bash
docker build -t my-flask-app .
docker run -d -p 5000:5000 --name flask my-flask-app
curl http://localhost:5000
# Hello from Docker
```

### Observe layers

```bash
docker history my-flask-app
```

Each line is one layer. Notice the sizes — the `pip install` layer is the largest.

### See caching in action

```bash
# First build — all layers build
docker build -t my-flask-app .

# Edit app.py — change the return string
# Rebuild
docker build -t my-flask-app .
```

Watch the output. `FROM`, `COPY requirements.txt`, and `RUN pip install` are all `CACHED`. Only the `COPY app.py` and `CMD` layers rebuild. Because you put pip install before copying source, the slow step is skipped on every code change.

---

## Multi-stage builds

Build tools and compilers should not be in the final image. They're only needed during build.

```dockerfile
# Stage 1: build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

The final image contains only nginx and the compiled output. No Node, no node_modules, no source code. Images are smaller and have a smaller attack surface.

---

## Cleanup

```bash
docker rm -f flask
docker rmi my-flask-app
```

---

## Quick reference

```bash
docker build -t <name>:<tag> .          # build image from Dockerfile in current dir
docker build -f <path> .                # specify Dockerfile path
docker images                           # list local images
docker history <image>                  # show layers
docker image inspect <image>            # full metadata
docker rmi <image>                      # remove image
docker image prune                      # remove unused images
docker build --no-cache .               # rebuild all layers
```
