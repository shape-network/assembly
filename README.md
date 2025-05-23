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

This project requires certain environment variables to be set. Create a `.env` file in the root of apps/web project and add the necessary variables.

For example:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
NEXT_PUBLIC_ALCHEMY_KEY=
NEXT_PUBLIC_CHAIN_ID=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
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

Want to run only web project locally connected to sepolia or mainnet contracts? You can run:

```bash
yarn run dev --filter=web
```

## Contributing

Contributions are welcome! If you have any improvements or features to add, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a Pull Request.

We appreciate your contributions Shaper!
