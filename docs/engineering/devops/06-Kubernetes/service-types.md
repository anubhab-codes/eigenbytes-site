# Service Types

Kubernetes services expose pods in different ways.

- `ClusterIP` ? internal address only.
- `NodePort` ? host port on each node.
- `LoadBalancer` ? cloud load balancer.
- `ExternalName` ? DNS alias.

## Example

```yaml
kind: Service
apiVersion: v1
metadata:
  name: web
spec:
  type: LoadBalancer
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 80
```
