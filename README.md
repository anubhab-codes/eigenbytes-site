# Eigenbytes Site

This website is a learning-focused engineering site built with Docusaurus. It is designed to help you build a mental model for concepts in DevOps, Linux, networking, source control, Docker, Kubernetes, and continuous authentication.

The writing blends story-driven explanations with concrete commands, code examples, and diagrams so you can connect each concept to real results.

## Local development

```bash
yarn
yarn start
```

## Build and deploy

```bash
yarn build
```

```bash
USE_SSH=true yarn deploy
```

## How this site is organised

- `docs/engineering`: learning content for practical engineering and operations.
- `docs/publications`: papers and technical narratives with evidence and model explanation.
- `src/pages/resume.mdx`: a personal resume page written as a clear narrative.
