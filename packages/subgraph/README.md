# Assembly Subgraph

This subgraph indexes events from the Otom Items Core contract on both mainnet and Sepolia testnet. It tracks item creation, crafting, destruction, and other related events.

## Overview

The Assembly subgraph indexes the following key entities:

- Item creation events
- Item crafting events (with counter for total crafts per item)
- Item destruction events
- Item updates
- And more, depending on the network (see network-specific configurations)

## Network Configurations

### Mainnet

- Network: `shape-mainnet`
- Contract Address: `0xe8af571878D33CfecA4eA11caEf124E5ef105a30`
- Start Block: `12751170`
- Indexed Events:
  - ItemCrafted
  - ItemCreated
  - ItemDestroyed
  - ItemUpdated

### Sepolia Testnet

- Network: `shape-sepolia`
- Contract Address: `0xc709F59f1356230025d4fdFDCeD92341A14FF2F8`
- Start Block: `15368091`
- Indexed Events: All events from the contract (see `subgraph.sepolia.yaml` for complete list)

## Getting Started

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- Yarn
- Docker and Docker Compose (for local development)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-org/assembly.git
cd assembly
```

2. Install dependencies:

```bash
yarn install
```

3. Navigate to the subgraph package:

```bash
cd packages/subgraph
```

### Local Development

> **Important Note**: Local development with Shape networks (L2 chains like `shape-mainnet` and `shape-sepolia`) is currently **not supported** by the standard Graph Node and graph-cli. While Alchemy supports these networks for hosted deployments, the open-source Graph Node does not recognize custom L2 networks. This means you cannot run and test the subgraph locally with the actual network configuration.

For development, you can:

1. Generate types from the GraphQL schema and ABIs:

```bash
yarn codegen
```

2. Build the subgraph:

```bash
yarn build:mainnet
# or
yarn build:sepolia
```

3. Deploy directly to a hosted service that supports Shape networks (like Alchemy):

#### Deploying to Alchemy

To deploy the Sepolia testnet subgraph to Alchemy:

```bash
# First build the Sepolia version
yarn build:sepolia

# Then deploy to Alchemy
yarn graph deploy otomsV2Testnet subgraph.sepolia.yaml \
  --version-label v0.0.1-new-version \
  --node https://subgraphs.alchemy.com/api/subgraphs/deploy \
  --deploy-key YOUR_ALCHEMY_DEPLOY_KEY \
  --ipfs https://ipfs.satsuma.xyz
```

To deploy the mainnet version:

```bash
# First build the mainnet version
yarn build:mainnet

# Then deploy to Alchemy
yarn graph deploy otomsV2 subgraph.mainnet.yaml \
  --version-label v0.0.1 \
  --node https://subgraphs.alchemy.com/api/subgraphs/deploy \
  --deploy-key YOUR_ALCHEMY_DEPLOY_KEY \
  --ipfs https://ipfs.satsuma.xyz
```

> **Note**: You'll need an Alchemy deploy key to deploy your subgraph. You can obtain one from [https://subgraphs.alchemy.com/](https://subgraphs.alchemy.com/)

#### Querying the Deployed Subgraph

To query the deployed testnet subgraph:

```bash
curl -v \
  https://subgraph.satsuma-prod.com/{QUERY_KEY}/deca-art/otomsV2Testnet/version/v0.0.1-new-version/api \
  --data-raw '{"query":"{ _meta { block { number hash } } }"}'
```

> **Important**: Replace `{QUERY_KEY}` with your personal query key to access the deployed testnet subgraph.

#### GraphQL Playgrounds

You can also explore and test queries using the GraphQL playgrounds:

- **Testnet (Sepolia) Playground**: [https://subgraph.satsuma-prod.com/deca-art/otomsV2Testnet/playground](https://subgraph.satsuma-prod.com/deca-art/otomsV2Testnet/playground)
- **Production (Mainnet) Playground**: [https://subgraph.satsuma-prod.com/deca-art/otomsV2/playground](https://subgraph.satsuma-prod.com/deca-art/otomsV2/playground)

### Testing

TBD

## Key Features

### Total Crafted Items Counter

The subgraph maintains a counter for each item ID to track how many times it has been crafted. This is implemented through the `ItemCraftCounter` entity, which is updated each time an `ItemCrafted` event is emitted.

To query the total number of times an item has been crafted:

```graphql
{
  itemCraftCounter(id: "1") {
    itemId
    count
    lastUpdated
  }
}
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests to ensure everything works: `yarn test`
5. Commit your changes: `git commit -m 'Add my feature'`
6. Push to the branch: `git push origin feature/my-feature`
7. Submit a pull request

## License

This project is licensed under the [MIT License](LICENSE).
