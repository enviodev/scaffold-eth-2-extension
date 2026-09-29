# 🔍 Scaffold-ETH 2 + Envio Indexer Extension

> **⚠️ Important:** This repository contains the **extension code** that gets merged into Scaffold-ETH 2 projects. This codebase is not useful on its own - it's only what gets integrated when you create a new Scaffold-ETH project with this extension.

## 🚀 How to Use This Extension

To create a new Scaffold-ETH 2 project with this Envio extension:

```bash
npx create-eth@latest -e enviodev/scaffold-eth-2-extension
```

This will create a complete Scaffold-ETH 2 project with the Envio indexer extension already integrated.

This extension adds **automatic Envio indexer generation** to your Scaffold-ETH 2 project, allowing you to index all your deployed smart contracts and query their data through a GraphQL API.





## ✨ What It Does

- 🔍 **Generates boilerplate Envio indexer** from your deployed Scaffold-ETH contracts
- 📊 **Status dashboard** with links to Envio metrics and database
- 🔄 **One-click regeneration** to update the indexer when you deploy new contracts
- 🎯 **Automatic event detection** from your contract ABIs
- 📈 **GraphQL API** for querying your indexed blockchain data




## 🔧 Available Commands

> **Note:** These commands are for the Envio indexer within the Scaffold-ETH project and must be run from the `packages/envio` folder.

```bash
cd packages/envio

yarn run update  # Generate indexer from deployed contracts
yarn codegen     # Generate TypeScript types
yarn dev         # Start indexer in development mode
yarn start       # Start indexer in production mode
yarn test        # Run indexer tests
```





## 🚀 Quick Start

### Prerequisites
- **Node.js v22 or newer** (required, v24 recommended)
- **Docker** (for running the indexer)
- **Yarn** (for Scaffold-ETH and the Envio indexer)

### Setup (After Creating Project with Extension)
1. Deploy your contracts: `yarn deploy`
2. Generate the indexer: `cd packages/envio && yarn run update && yarn codegen`
3. Start the indexer: `yarn dev`
4. Access the dashboard at `http://localhost:3000/envio`

## 🔄 Regenerating the Indexer

**Via Frontend:** Go to the envio page (`http://localhost:3000/envio`) and click the "Generate" button.

**Via Command Line:** `cd packages/envio && yarn run update && yarn codegen`

---

For more information about Envio, visit the [official documentation](https://docs.envio.dev).