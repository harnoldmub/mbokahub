import Stripe from "stripe";

type ConnectionItem = {
  settings: {
    publishable?: string;
    secret?: string;
  };
};

const STRIPE_API_VERSION = "2026-03-25.dahlia" as const;

async function getCredentialsFromConnector(): Promise<{
  publishableKey: string;
  secretKey: string;
} | null> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? `repl ${process.env.REPL_IDENTITY}`
    : process.env.WEB_REPL_RENEWAL
      ? `depl ${process.env.WEB_REPL_RENEWAL}`
      : null;

  if (!hostname || !xReplitToken) return null;

  const isProduction = process.env.REPLIT_DEPLOYMENT === "1";
  const targetEnvironment = isProduction ? "production" : "development";

  const url = new URL(`https://${hostname}/api/v2/connection`);
  url.searchParams.set("include_secrets", "true");
  url.searchParams.set("connector_names", "stripe");
  url.searchParams.set("environment", targetEnvironment);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "X-Replit-Token": xReplitToken,
      },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { items?: ConnectionItem[] };
    const item = data.items?.[0];
    if (!item?.settings.publishable || !item?.settings.secret) return null;
    return {
      publishableKey: item.settings.publishable,
      secretKey: item.settings.secret,
    };
  } catch {
    return null;
  }
}

async function getCredentials(): Promise<{
  publishableKey: string;
  secretKey: string;
}> {
  // 1) Explicit env vars take precedence (used in production with LIVE keys)
  const envSecret = process.env.STRIPE_SECRET_KEY;
  const envPublishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (envSecret && envPublishable) {
    return { publishableKey: envPublishable, secretKey: envSecret };
  }

  // 2) Fall back to Replit connector (sandbox in dev, production keys in deployed app)
  const fromConnector = await getCredentialsFromConnector();
  if (fromConnector) return fromConnector;

  throw new Error(
    "Stripe credentials missing: set STRIPE_SECRET_KEY + NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY or connect Stripe via Replit integrations.",
  );
}

export async function getStripe(): Promise<Stripe> {
  const { secretKey } = await getCredentials();
  return new Stripe(secretKey, { apiVersion: STRIPE_API_VERSION });
}

export async function getStripePublishableKey(): Promise<string> {
  const { publishableKey } = await getCredentials();
  return publishableKey;
}
