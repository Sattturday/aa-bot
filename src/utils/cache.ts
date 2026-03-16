export class DataCache<T> {
  private data: T | null = null;
  private lastFetch = 0;
  private ttl: number;
  private fetcher: () => T;

  constructor(fetcher: () => T, ttlMs = 60_000) {
    this.fetcher = fetcher;
    this.ttl = ttlMs;
  }

  get(): T {
    const now = Date.now();
    if (!this.data || now - this.lastFetch > this.ttl) {
      this.data = this.fetcher();
      this.lastFetch = now;
    }
    return this.data;
  }

  invalidate(): void {
    this.data = null;
  }
}
