# Assembly

See [Assembly Docs](https://docs.shape.network/building-on-shape/onchain-compatible/assembly) for full context and learn more about this project.

## Getting Started

### Prerequisites

Ensure you have Node.js and npm/yarn/pnpm/bun installed on your system.

### Clone the Project

First, clone the repository to your local machine:

```bash
git clone <repository-url>
cd <repository-name>
```

### Environment Variables

This project requires certain environment variables to be set. Create a `.env` file in the root of the project and add the necessary variables.

For example:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
NEXT_PUBLIC_ALCHEMY_KEY=
NEXT_PUBLIC_CHAIN_ID=
```

You will need to set `NEXT_PUBLIC_CHAIN_ID` to either Shape Mainnet (`360`) or Shape Sepolia Testnet (`11011`).

### Run the project locally

Install dependencies:

```bash
yarn install
```

Then, run the development server:

```bash
yarn dev
```
