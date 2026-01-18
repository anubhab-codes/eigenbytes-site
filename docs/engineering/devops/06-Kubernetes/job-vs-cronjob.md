---

title: Job vs CronJob
toc:
max_depth: 2
------------

## Short theory

A Job runs Pods until they exit successfully.
A CronJob creates Jobs on a schedule.
Jobs run once per creation.
CronJobs repeat Job creation based on time.

---

## Hands-on example

Assume:

* A working Kubernetes cluster
* `kubectl` is configured

---

### Initial state

No Jobs or CronJobs exist.

```
kubectl get jobs
kubectl get cronjobs
```

```
No resources found in default namespace.
No resources found in default namespace.
```

---

### Step 1: Create a Job

Create a Job that runs once and exits.

```
kubectl apply -f - <<EOF
apiVersion: batch/v1
kind: Job
metadata:
  name: once-job
spec:
  template:
    spec:
      containers:
      - name: job
        image: busybox
        command: ["sh", "-c", "echo hello && sleep 2"]
      restartPolicy: Never
EOF
```

```
job.batch/once-job created
```

Check Pods.

```
kubectl get pods
```

```
once-job-abcde   0/1   Completed   0   10s
```

Check Job status.

```
kubectl get job once-job
```

```
NAME       COMPLETIONS   DURATION   AGE
once-job   1/1           2s         15s
```

What changed:

* Job completed successfully

What did not change:

* Job will not run again

---

### Step 2: Create a CronJob

Create a CronJob that runs every minute.

```
kubectl apply -f - <<EOF
apiVersion: batch/v1
kind: CronJob
metadata:
  name: repeat-job
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: job
            image: busybox
            command: ["sh", "-c", "date"]
          restartPolicy: Never
EOF
```

```
cronjob.batch/repeat-job created
```

Wait and check Jobs.

```
kubectl get jobs
```

```
NAME                 COMPLETIONS   AGE
repeat-job-28672001  1/1           10s
repeat-job-28672002  1/1           70s
```

What changed:

* New Jobs are created on schedule

What did not change:

* Each Job still runs only once

---

## Key observation

* Jobs are one-time executions
* CronJobs only schedule Job creation
