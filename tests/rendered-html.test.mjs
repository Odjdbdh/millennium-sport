import assert from "node:assert/strict";
import test from "node:test";

const htmlMeta = (html, name) =>
  new RegExp(`<meta(?=[^>]*\\bname=["']${name}["'])[^>]*>`, "i");

test("renders production homepage without development metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\\/html\\b/i,
  );

  const html = await response.text();
  assert.doesNotMatch(html, /codex-preview/i);
  assert.match(html, htmlMeta(html, "description"));
  assert.match(html, /og:title/i);
  assert.match(html, /میلنیوم اسپرت/);
});
