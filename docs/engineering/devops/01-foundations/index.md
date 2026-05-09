---
title: Foundations
sidebar_position: 1
description: "How production servers work — the OS, access model, and network layer every engineer needs to understand"
---

# Foundations

Before containers. Before Kubernetes. Before any of that.

Every system you will ever operate runs on a server. That server runs Linux. Traffic reaches it through a network. Someone controls who can log in and what they can do.

These are not optional concepts. When something breaks in production — and it will — you trace the failure through these layers. The application crashes. Is it the app? The OS? The network? You cannot answer that without understanding all three.

---

## What this section covers

**Linux server model** — The OS running under every container and every VM. How the filesystem is organized, how processes work, how services start and stay running.

**Access and security** — Who can log in to a server and what they can do once they're in. Users, groups, sudo, SSH key authentication.

**Networking** — How traffic moves from one machine to another. IP addresses, routing, ports, DNS resolution, and how to diagnose connectivity failures.

---

## Why this matters before containers

When a container fails, the failure happens somewhere in this stack.

The container runtime is a Linux process. Its networking is built on kernel networking. Its filesystem uses kernel namespaces. If you do not understand what's underneath, you cannot debug what's on top.

Learn this once. It applies everywhere.
