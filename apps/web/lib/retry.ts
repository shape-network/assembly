type RetryOptions = {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
};

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000 } = options;
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      const jitter = Math.random() * 0.1 * delay;
      const totalDelay = delay + jitter;

      console.warn(
        `Attempt ${attempt + 1} failed, retrying in ${Math.round(totalDelay)}ms:`,
        error
      );

      await new Promise((resolve) => setTimeout(resolve, totalDelay));
    }
  }

  throw lastError!;
}

export function isRetryableError(error: unknown): boolean {
  if (!error) return false;

  const errorObj = error as Record<string, unknown>;
  const message = (errorObj.message as string) || String(error);
  const statusCode = (errorObj.status as number) || (errorObj.statusCode as number);

  return (
    statusCode >= 500 ||
    statusCode === 429 ||
    message.includes('timeout') ||
    message.includes('network') ||
    message.includes('ECONNRESET') ||
    message.includes('ETIMEDOUT')
  );
}
