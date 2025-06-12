#!/bin/bash

# Create a symlink to the mainnet subgraph configuration for testing
echo "Creating symlink for testing..."
ln -sf ./subgraph.mainnet.yaml ./subgraph.yaml

# Run the tests
echo "Running tests..."
graph test

# Remove the symlink after tests are done
echo "Cleaning up..."
rm -f ./subgraph.yaml

exit 0
