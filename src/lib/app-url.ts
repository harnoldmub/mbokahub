export function getAppUrl(req?: Request): string {
  if (req) {
    const origin = req.headers.get("origin");
    if (origin) return origin;
    const host = req.headers.get("host");
    if (host) {
      const proto = req.headers.get("x-forwarded-proto") ?? "https";
      return `${proto}://${host}`;
    }
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  const replitDomains = process.env.REPLIT_DOMAINS;
  if (replitDomains) {
    const first = replitDomains.split(",")[0]?.trim();
    if (first) return `https://${first}`;
  }

  return "http://localhost:5000";
}
