import { serve } from "https://deno.land/std@0.173.0/http/server.ts";
import DB from "./db.ts";


function handler(req: Request) {
  const name = (new URL(req.url).pathname).substring(1);
  const path = DB[name];
  return path
    ? fetch(`https://raw.githubusercontent.com/ziv/ldr-db/main/${path}`)
    : new Response("not found", { status: 404 });
}

await serve(handler);
