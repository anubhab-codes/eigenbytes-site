# PVC vs EmptyDir

A PersistentVolumeClaim requests durable storage. `emptyDir` is ephemeral storage that disappears when a pod is removed.

## Example

```yaml
volumeMounts:
- mountPath: /data
  name: app-data
volumes:
- name: app-data
  emptyDir: {}
```

## Durable example

```yaml
volumes:
- name: app-data
  persistentVolumeClaim:
    claimName: app-pvc
```
