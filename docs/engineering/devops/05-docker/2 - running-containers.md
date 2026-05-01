# Running Containers

Running a container is like launching a lightweight VM that only contains your app and its dependencies.

## Example

```bash
docker run -d --name web -p 8080:80 nginx
```

Result:

- Container `web` runs in the background.
- Port 8080 on the host forwards to port 80 in the container.

## Check status

```bash
docker ps
```
