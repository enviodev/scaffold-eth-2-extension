## Envio Indexer

*Please refer to the [documentation website](https://docs.envio.dev) for a thorough guide on all [Envio](https://envio.dev) indexer features*

### Run

```bash
yarn dev
```

Visit http://localhost:8080 to see the GraphQL Playground, local password is `testing`.

### Generate files from `config.yaml` or `schema.graphql`

```bash
yarn codegen
```

### Set up agent skills

If you use an AI coding assistant, run this in `packages/envio` to add the HyperIndex skills to `.claude/skills/`

```bash
npx envio skills update
```

Run it again after you upgrade `envio` so the skills match the new release.

### Pre-requisites

- [Node.js v22+ (v24 recommended)](https://nodejs.org/en/download/current)
- [Yarn](https://yarnpkg.com/getting-started/install) (installed with Scaffold-ETH)
- [Docker desktop](https://www.docker.com/products/docker-desktop/)
