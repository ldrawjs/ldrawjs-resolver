import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { collect, parse } from "https://deno.land/x/ldrawjs@v1.1.5/mod.ts";
import resolver from "./resolver.ts";

const headers = {
  "content-type": "application/json",
  "access-control-allow-origin": "*",
};

// todo error handlers

async function build(req: Request) {
  const data = await (new Response(req.body)).json();
  const map = await collect(parse(data.ldr), resolver as any);
  const output = JSON.stringify([...map.entries()]);
  return new Response(output, { headers });
}

async function resolve(req: Request) {
  const parts = (new URL(req.url).pathname).split("/");
  const name = parts[parts.length - 1];
  const output = JSON.stringify(await resolver(name));
  return new Response(output, { headers });
}

async function handler(req: Request) {
  return "POST" === req.method ? build(req) : resolve(req);
}

await serve(handler);

//
// const notFound = () => new Response("not found", {status: 404, headers});
//
// const proxy = (name: string) => fetch(`https://raw.githubusercontent.com/ziv/ldr-db/main/${name}`)
//     .then(res => res.text())
//     .then(text => new Response(text, {headers}));
