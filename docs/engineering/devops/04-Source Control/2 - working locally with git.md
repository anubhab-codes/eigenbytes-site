# Working Locally with Git

A good local workflow keeps changes small, readable, and reversible.

## Example session

```bash
git checkout -b feature/login
# edit files
git add app.py
git commit -m "Add login endpoint"
```

## Why it matters

Small commits make code review easier and reduce merge conflicts.

## Expected result

```bash
git log --oneline --decorate
```

You should see your commit message with the branch reference.
