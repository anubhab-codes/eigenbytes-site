# Environment Variables vs Volume Mounts

Environment variables are best for small configuration values. Volume mounts are better for files, certificates, and larger config.

## Example

```yaml
env:
- name: DATABASE_URL
  value: "postgres://db:5432/app"
volumeMounts:
- name: config
  mountPath: /etc/app
```
