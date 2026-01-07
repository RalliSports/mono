export async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 1000,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result: T = await fn(); // ✅ Explicitly typed result
      return result;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        const msg =
          error instanceof Error ? error.message : JSON.stringify(error);
        console.warn(`Attempt ${attempt} failed — retrying in ${delayMs}ms...`, msg);
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
  }
  throw lastError;
}
