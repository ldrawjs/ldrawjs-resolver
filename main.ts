import { serve } from "https://deno.land/std@0.173.0/http/server.ts";
import DB from "./db.ts";

const headers = {
    "content-type": "text/plain",
    "access-control-allow-origin": "*",
};

const notFound = () => new Response("not found", {status: 404, headers});

const proxy = (name: string) => fetch(`https://raw.githubusercontent.com/ziv/ldr-db/main/${name}`)
    .then(res => res.text())
    .then(text => new Response(text, {headers}));

function handler(req: Request) {
    const name = (new URL(req.url).pathname).substring(1);
    const path = DB[name];
    return path ? proxy(path) : notFound();
}

await serve(handler);
