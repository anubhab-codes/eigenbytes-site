# Volumes and Data

Volumes separate data from the container filesystem, so state survives container restarts.

## Example

```bash
docker run -d -v /srv/data:/data --name db postgres
```

## Result

Database files persist on the host path `/srv/data` even if the container is removed.

## Mental model

A container image is code. A volume is the data store attached to that code.
