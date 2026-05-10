---
title: Terraform
sidebar_position: 7
description: "Terraform cheatsheet — init, plan, apply, manage state, workspaces, and import existing resources"
---

# Terraform Cheatsheet

Terraform describes infrastructure as code. You write `.tf` files, Terraform figures out what to create, change, or destroy.

The usual cycle is: `init` → `plan` → `apply`.

---

## Init

```bash
terraform init                         # download providers and modules (run this first, always)
terraform init -upgrade                # upgrade providers to the latest allowed version
terraform init -reconfigure            # reinitialize, ignoring existing backend state
terraform init -backend-config=prod.hcl  # init with a specific backend config file
```

---

## Plan

```bash
terraform plan                         # show what Terraform will create/change/destroy
terraform plan -out=tfplan             # save the plan to a file (use this for safe applies)
terraform plan -var="region=us-east-1" # pass a variable on the command line
terraform plan -var-file=prod.tfvars   # pass a variables file
terraform plan -target=aws_instance.web   # plan only one specific resource
```

---

## Apply

```bash
terraform apply                        # apply changes (will prompt for confirmation)
terraform apply -auto-approve          # skip the confirmation prompt
terraform apply tfplan                 # apply a saved plan file (no prompt needed)
terraform apply -var-file=prod.tfvars  # apply with a variables file
terraform apply -target=aws_instance.web   # apply only one specific resource
```

---

## Destroy

```bash
terraform destroy                      # destroy all resources managed by this config (prompts)
terraform destroy -auto-approve        # skip the confirmation prompt
terraform destroy -target=aws_instance.web   # destroy only one resource
```

---

## Inspect state

```bash
terraform state list                   # list all resources tracked in state
terraform state show aws_instance.web  # show details of a specific resource in state
terraform show                         # show the entire current state in human-readable form
terraform output                       # show all output values
terraform output db_endpoint           # show a specific output value
```

---

## Modify state

```bash
terraform state rm aws_instance.web    # remove a resource from state (does NOT delete it in real infra)
terraform state mv aws_instance.web aws_instance.webserver   # rename a resource in state
terraform import aws_instance.web i-1234567890abcdef0        # import an existing resource into state
```

---

## Workspaces (multiple environments from one config)

```bash
terraform workspace list               # list all workspaces
terraform workspace new staging        # create a new workspace called staging
terraform workspace select staging     # switch to the staging workspace
terraform workspace show               # show the current workspace name
terraform workspace delete staging     # delete a workspace (must be empty)
```

---

## Validate and format

```bash
terraform validate                     # check config files for syntax and logic errors
terraform fmt                          # reformat .tf files to canonical style
terraform fmt -check                   # check formatting without changing files (use in CI)
terraform fmt -recursive               # format all .tf files in subdirectories too
```

---

## Providers and modules

```bash
terraform providers                    # show which providers are required
terraform providers lock               # lock provider versions in .terraform.lock.hcl
terraform get                          # download modules (init does this automatically)
```

---

## Common patterns

```bash
# Safe production workflow: always save the plan, apply from the file
terraform plan -out=tfplan -var-file=prod.tfvars
terraform apply tfplan

# Check what is in your state before making changes
terraform state list
terraform state show <resource>

# Recover after manual changes to infra (drift)
terraform plan                         # will show the difference
terraform apply                        # will reconcile infra back to your code
```
