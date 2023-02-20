const timeout = 1000 * 60 * 5;
const ttl = 1000 * 60 * 60;
const limit = 1000;
const cache = new Map<string, unknown>();
const timer = new Map<string, Date>();

let size = 0;
let t = null;

function cleaner() {
  clearTimeout(t);
  const now = new Date();
  for (
    const [key] of [...timer.entries()].filter(([k, d]) => (now - d) > ttl)
  ) {
    --size;
    cache.delete(key);
    timer.delete(key);
  }
  if (size > 0) {
    t = setTimeout(cleaner, timeout);
  }
}

function remover() {
  const [key] = [...timer.entries()].reduce(
    ([k0, d0], [k1, d1]) => d0 < d1 ? [k0, d0] : [k1, d1],
    ["", new Date()],
  );
  --size;
  cache.delete(key);
  timer.delete(key);
}

export function write<T = any>(key: string, value: unknown): T {
  ++size;
  cache.set(key, value);
  timer.set(key, new Date());
  if (!t) {
    t = setTimeout(cleaner, timeout);
  }
  if (size > limit) {
    remover();
  }
  return value;
}

export function has(key: string) {
  return cache.has(key);
}

export function read<T>(key: string): T {
  timer.set(key, new Date());
  return cache.get(key) as T;
}
