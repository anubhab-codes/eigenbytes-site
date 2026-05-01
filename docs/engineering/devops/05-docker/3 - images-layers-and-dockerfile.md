# Images, Layers, and Dockerfile

A Docker image is built from a Dockerfile and stored as layers.

## Example Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "server.js"]
```

## Why layers matter

Layers are cached. If only source files change, rebuild uses the existing dependency layer.

## Command

```bash
docker build -t myapp:latest .
```
