# Networking Basics

Networking is the story of how computers move data between each other.

## The mental model

- IP address = street address.
- Port = door at that address.
- Protocol = language spoken at the door.

## Practical example

```bash
ip a
ping 8.8.8.8
```

Expected result:

```text
64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=13.2 ms
```

That shows the network path is alive.

## Diagram

```mermaid
flowchart LR
  App[Application] -->|TCP| Socket[Socket]
  Socket -->|sends| Network[Network Interface]
  Network -->|routes| Router
  Router -->|delivers| Peer[Remote Host]
```
