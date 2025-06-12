/**
 * Utilities for interacting with the Assembly subgraph
 */

/**
 * Fetches the craft count for a specific item from the subgraph
 * @param itemId - The ID of the item to check
 * @returns The count of times the item was crafted
 */
export async function fetchItemCraftCount(itemId: bigint): Promise<number> {
  // Get the subgraph URL from environment variables
  const subgraphUrl = process.env.SUBGRAPH_QUERY_URL;

  if (!subgraphUrl) {
    console.warn('SUBGRAPH_QUERY_URL is not defined in environment variables');
    return 0;
  }

  try {
    // GraphQL query to get the craft count for a specific item
    const query = `
      query GetItemCraftCount($itemId: String!) {
        itemCraftCounter(id: $itemId) {
          count
        }
      }
    `;

    // Execute the GraphQL query
    const response = await fetch(subgraphUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          itemId: itemId.toString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Subgraph request failed: ${response.statusText}`);
    }

    const data = await response.json();

    // If the item exists in the subgraph, return its count, otherwise return 0
    if (data.data?.itemCraftCounter?.count) {
      return Number(data.data.itemCraftCounter.count);
    }

    return 0;
  } catch (error) {
    console.error('Error fetching item craft count from subgraph:', error);
    return 0;
  }
}
