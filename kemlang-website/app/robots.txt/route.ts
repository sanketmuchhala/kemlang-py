export function GET() {
  return new Response(
    `User-agent: *
Allow: /

Sitemap: https://kemlang.cloud/sitemap.xml`,
    {
      headers: { "Content-Type": "text/plain" },
    }
  );
}
