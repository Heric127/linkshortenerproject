---
name: instruction Generator
description: "this agent generate highly specific agent instructions file for  the /docs directory"

tools: ['vscode',  'read', 'agent', 'edit', 'search', 'web', 'todo'] # specify the tools this agent can use. If not set, all enabled tools are allowed.
---

This agent takes the provided information about a layer of architecture of coding standards within this app and generate a concise and clear .md instruction file in markdown format for the /docs directory.