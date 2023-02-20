import { has, read, write } from "./cache.ts";
import MAP from "./ldr-map.ts";

const URL = "https://raw.githubusercontent.com/ziv/ldr-db/main/l/";

export default async function resolver(key: string) {
  const name = key.toLowerCase();
  if (!has(name)) {
    const path = MAP[name];
    if (path) {
      try {
        const res = await fetch(URL + path);
        const data = await res.json();
        write(name, data);
      } catch (e) {
        write(name, [[0, "ERROR", "fetch", e.message]]);
      }
    } else {
      write(name, [[0, "ERROR", "not mapped", key]]);
    }
  }
  return read(name);
}
