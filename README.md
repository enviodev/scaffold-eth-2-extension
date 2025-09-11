# 🔍 Scaffold-ETH 2 + Envio Indexer Extension

This extension adds **automatic Envio indexer generation** to your Scaffold-ETH 2 project, allowing you to index all your deployed smart contracts and query their data through a GraphQL API.

## ✨ What It Does

- 🔍 **Generates boilerplate Envio indexer** from your deployed Scaffold-ETH contracts
- 📊 **Status dashboard** with links to Envio metrics and database
- 🔄 **One-click regeneration** to update the indexer when you deploy new contracts
- 🎯 **Automatic event detection** from your contract ABIs
- 📈 **GraphQL API** for querying your indexed blockchain data




## 🔧 Available Commands

```bash
cd packages/envio

pnpm update   # Generate indexer from deployed contracts
pnpm codegen  # Generate TypeScript types
pnpm dev      # Start indexer in development mode
pnpm start    # Start indexer in production mode
pnpm test     # Run indexer tests
```





## 🚀 Quick Start

### Prerequisites
- **Node.js v20** (required)
- **pnpm** (for Envio indexer)
- **Docker** (for running the indexer)
- **Yarn** (for Scaffold-ETH)

### Setup
1. Deploy your contracts: `yarn deploy`
2. Generate the indexer: `cd packages/envio && pnpm install && pnpm update && pnpm codegen`
3. Start the indexer: `pnpm dev`
4. Access the dashboard at `http://localhost:3000/envio`

## 🔄 Regenerating the Indexer

**Via Frontend:** Go to `http://localhost:3000/envio` and click "Regenerate Boilerplate Indexer"

**Via Command Line:** `cd packages/envio && pnpm update && pnpm codegen`

## 📁 Generated Files

The extension generates these files in `packages/envio/`:

- **`config.yaml`** - Indexer configuration with your contracts and events
- **`schema.graphql`** - GraphQL schema based on your contract events
- **`src/EventHandlers.ts`** - TypeScript event handlers




## 🐛 Troubleshooting

**Indexer not starting:** Check Docker is running, then `cd packages/envio && pnpm dev`

**Contract not indexed:** `cd packages/envio && pnpm update && pnpm codegen && pnpm dev`

**Dashboard not loading:** Ensure indexer (`pnpm dev`) and frontend (`yarn start`) are running

## 🚀 Production Deployment

1. Deploy contracts: `yarn deploy --network sepolia`
2. Update indexer: `cd packages/envio && pnpm update`
3. Start indexer: `pnpm start`

## 📊 What Gets Indexed

- All contract events from your deployed contracts
- Event parameters with proper type mapping
- Block and transaction data for each event
- Timestamps and block numbers for historical queries

---

**Happy Indexing! 🚀**

For more information about Envio, visit the [official documentation](https://docs.envio.dev).