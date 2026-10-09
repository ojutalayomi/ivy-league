import { responseCache } from "./admin-api";

export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs = 10000,
): Promise<T> {
  const cached = responseCache.get(key);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data as T;
  }
  const data = await fetcher();
  responseCache.set(key, { data, expiresAt: Date.now() + ttlMs });
  return data;
}
