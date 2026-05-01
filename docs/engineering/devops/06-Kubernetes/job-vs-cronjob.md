# Job vs CronJob

A Job runs a task once. A CronJob runs a task on a schedule.

## Example Job

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: data-migration
spec:
  template:
    spec:
      containers:
      - name: migrate
        image: myapp:migrate
      restartPolicy: Never
```

## Example CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: daily-report
spec:
  schedule: "0 2 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: report
            image: myapp:report
          restartPolicy: Never
```
