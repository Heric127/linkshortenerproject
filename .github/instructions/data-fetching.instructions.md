---
description: read this file to understand how data fetching works in the project.
---

# Data Fetching guidelines

This is a guide to understanding how data fetching is handled in the project.
adhering to these guidelines will ensure consistent and efficient data fetching throughout the project.

## 1. use server components for data fetching

In Next.js ALWAYS using server components for data fetching. NEVER use client components for fetching data.

## 2 Data fetching methods

ALWAYS use the helper function in the /data directory for fetching data. NEVER fetch data directly within the component.

ALL helper functions in the /data directory should use Drizzle ORM for database interactions.