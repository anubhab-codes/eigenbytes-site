---
title: Images, Layers, and Dockerfile
toc:
  max_depth: 2
---

# Images, Layers, and Dockerfile

This is the core of Docker.
If students understand this, they can build and ship apps.

---

## What an image is

An image is a read-only filesystem template.
It is built from layers.

Each Dockerfile instruction typically creates a new layer.
Layers are cached.
This is why build order matters.

Diagram:

```
Image
├─ Layer 1: base (alpine)
├─ Layer 2: add packages
├─ Layer 3: copy app
└─ Layer 4: set command
```

---

## Inspect an image

Pull a base image:

```bash
docker pull alpine:latest
```

Show image list:

```bash
docker images
```

Show layer history:

```bash
docker history alpine:latest
```

Sample output (short):
```text
IMAGE          CREATED        CREATED BY                      SIZE
<id>           2 weeks ago    /bin/sh -c #(nop)  CMD ...      0B
<id>           2 weeks ago    /bin/sh -c #(nop) ADD ...       7MB
```

What this means:
- images are built step-by-step
- each step becomes part of the final image

---

## Build your first image

Create a folder:

```bash
mkdir docker-build-demo
cd docker-build-demo
```

Create a file:

```bash
cat > app.sh << 'EOF'
#!/bin/sh
echo "Hello from container"
echo "Time: $(date)"
EOF
chmod +x app.sh
```

Create a Dockerfile:

```bash
cat > Dockerfile << 'EOF'
FROM alpine:latest
WORKDIR /app
COPY app.sh /app/app.sh
RUN chmod +x /app/app.sh
CMD ["/app/app.sh"]
EOF
```

Build:

```bash
docker build -t demo-hello:1.0 .
```

What you see (sample):
```text
[+] Building ...
 => [1/4] FROM alpine:latest
 => [2/4] WORKDIR /app
 => [3/4] COPY app.sh /app/app.sh
 => [4/4] RUN chmod +x /app/app.sh
 => naming to demo-hello:1.0
```

Run it:

```bash
docker run --rm demo-hello:1.0
```

Sample output:
```text
Hello from container
Time: Sun Jan 11 06:30:00 UTC 2026
```

---

## Dockerfile instructions (what they do)

- `FROM`: base image
- `WORKDIR`: sets working directory inside image/container
- `COPY`: copies files into the image
- `RUN`: runs a command at build time (creates a layer)
- `CMD`: default command at container runtime

Short rule:
- `RUN` happens during build.
- `CMD` happens during run.

---

## Tagging images

```bash
docker images
docker tag demo-hello:1.0 demo-hello:latest
```

---

## Why layer order matters

Cache is per-layer.

If you change a layer, all layers after it rebuild.

Practical rule:
- install dependencies first (changes less)
- copy app later (changes more)

This saves build time.

---

## Build args (simple)

Update Dockerfile to include:

```Dockerfile
ARG APP_NAME=demo
ENV APP_NAME=$APP_NAME
```

Build:

```bash
docker build --build-arg APP_NAME=myapp -t demo-hello:2.0 .
```

Run and print env:

```bash
docker run --rm demo-hello:2.0 sh -c 'echo $APP_NAME'
```

---

## Helpful inspection commands

Metadata:

```bash
docker inspect demo-hello:1.0
```

Filter one field:

```bash
docker inspect -f '{{.Id}}' demo-hello:1.0
docker inspect -f '{{.Config.Cmd}}' demo-hello:1.0
```

---

## Common mistakes

- mixing up build-time vs run-time
- forgetting the final `.` in `docker build ... .`
- copying large repos into the image without `.dockerignore`
