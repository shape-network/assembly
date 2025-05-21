import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-foundry";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "dotenv/config";
import "hardhat-contract-sizer";
import "hardhat-watcher";
import { HardhatUserConfig } from "hardhat/config";

const accounts = {
    mnemonic: process.env.TESTNET_SEED_PHRASE || "abc abc abc abc abc abc abc abc abc abc abc abc",
};

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.26",
        settings: {
            viaIR: true,
            optimizer: {
                enabled: true,
                runs: 1,
            },
        },
    },
    networks: {
              hardhat: {
                  allowUnlimitedContractSize: false,
              },
              mainnet: {
                  chainId: 1,
                  url: process.env.MAINNET_RPC_URL,
                  accounts:process.env.MAINNET_PRIVATE_KEY
                  ? [process.env.MAINNET_PRIVATE_KEY]
                  : accounts,
              },
              sepolia: {
                  chainId: 11155111,
                  url: process.env.SEPOLIA_RPC_URL,
                  accounts,
              },
              shapeSepolia: {
                  chainId: 11011,
                  url: process.env.SHAPE_SEPOLIA_RPC_URL,
                  accounts,
              },
              shapeMainnet: {
                  chainId: 360,
                  url: process.env.SHAPE_MAINNET_RPC_URL,
                  accounts: process.env.SHAPE_MAINNET_PRIVATE_KEY
                      ? [process.env.SHAPE_MAINNET_PRIVATE_KEY]
                      : accounts,
              },
          },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
        customChains: [
            {
                network: "shapeSepolia",
                chainId: 11011,
                urls: {
                    apiURL: "https://sepolia.shapescan.xyz/api",
                    browserURL: "https://sepolia.shapescan.xyz/",
                },
            },
            {
                network: "shapeMainnet",
                chainId: 360,
                urls: {
                    apiURL: "https://shapescan.xyz/api",
                    browserURL: "https://shapescan.xyz/",
                },
            },
        ],
    },
    gasReporter: {
        enabled: false,
        gasPrice: 30,
        currency: "USD",
        coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    },
    // @ts-ignore
    contractSizer: {
        alphaSort: true,
        disambiguatePaths: false,
        runOnCompile: true,
        strict: true,
        only: [],
    },
    watcher: {
        test: {
            tasks: [{ command: "test", params: { testFiles: ["{path}"] } }],
            files: ["./test/**/*"],
            verbose: false,
            clearOnStart: true,
            runOnLaunch: false,
        },
    },
};

export default config;
