import assert from "node:assert/strict";
import test from "node:test";

test("blog SEO routes are present in the built application", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
  const ctx = { waitUntil() {}, passThroughOnException() {} };

  const blogResponse = await worker.fetch(new Request("http://localhost/blog", { headers: { accept: "text/html" } }), env, ctx);
  assert.equal(blogResponse.status, 200);
  const blogHtml = await blogResponse.text();
  assert.match(blogHtml, /مجله میلنیوم اسپرت|مجله|راهنما/i);
  assert.match(blogHtml, /application\/ld\+json/i);

  const sitemapResponse = await worker.fetch(new Request("http://localhost/sitemap.xml", { headers: { accept: "application/xml" } }), env, ctx);
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /\/blog/);

  const robotsResponse = await worker.fetch(new Request("http://localhost/robots.txt"), env, ctx);
  assert.equal(robotsResponse.status, 200);
  const robots = await robotsResponse.text();
  assert.match(robots, /OAI-SearchBot/i);
  assert.match(robots, /GPTBot/i);
});
