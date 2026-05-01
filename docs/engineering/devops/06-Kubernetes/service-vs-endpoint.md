# Service vs Endpoint

A Service exposes a stable network endpoint. Endpoints are the actual pod IPs behind that Service.

## Example

```bash
kubectl get svc web
kubectl get endpoints web
```

## Mental model

- Service = phone number.
- Endpoints = actual agents answering the calls.
