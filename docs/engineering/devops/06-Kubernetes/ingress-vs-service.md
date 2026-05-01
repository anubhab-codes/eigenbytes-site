# Ingress vs Service

A Service routes traffic to pods. An Ingress routes external HTTP/HTTPS traffic to Services.

## Example

```yaml
kind: Ingress
apiVersion: networking.k8s.io/v1
metadata:
  name: web-ingress
spec:
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web
            port:
              number: 80
```

## Mental model

- Service = internal phone extension.
- Ingress = receptionist who directs external calls.
