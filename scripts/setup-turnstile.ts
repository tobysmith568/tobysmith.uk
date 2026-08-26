// One-off script to create this site's Turnstile widget via the Cloudflare API, rather than
// clicking through the dashboard. Safe to re-run - checks for an existing widget by `name`
// first, so it never creates a duplicate. Not part of CI; run manually with:
//
//   CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... bun scripts/setup-turnstile.ts
//
// The token needs the "Turnstile Sites Write" (or "Account Settings Write") scope. The
// `secret` is only ever returned by the create call below (Cloudflare's list endpoint omits
// it) - copy it somewhere safe immediately, it can't be retrieved again, only rotated.

export {};

const WIDGET_NAME = "tobysmith-uk";
const DOMAINS = ["tobysmith.uk"];
const MODE = "managed";

const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

if (!apiToken || !accountId) {
  console.error("Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID before running this script.");
  process.exit(1);
}

const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/challenges/widgets`;
const headers = {
  Authorization: `Bearer ${apiToken}`,
  "Content-Type": "application/json"
};

interface CloudflareApiResponse<T> {
  success: boolean;
  errors: { code: number; message: string }[];
  result: T;
}

interface TurnstileWidget {
  sitekey: string;
  name: string;
  domains: string[];
  mode: string;
}

interface TurnstileWidgetWithSecret extends TurnstileWidget {
  secret: string;
}

const listRes = await fetch(baseUrl, { headers });
const listBody = (await listRes.json()) as CloudflareApiResponse<TurnstileWidget[]>;

if (!listRes.ok || !listBody.success) {
  console.error("Failed to list existing Turnstile widgets:", listBody.errors);
  process.exit(1);
}

const existing = listBody.result.find(widget => widget.name === WIDGET_NAME);

if (existing) {
  console.log(`Widget "${WIDGET_NAME}" already exists - sitekey: ${existing.sitekey}`);
  console.log(
    "The secret isn't retrievable after creation. If it's been lost, rotate it via " +
      `POST ${baseUrl}/${existing.sitekey}/rotate_secret and update the stored secret to match.`
  );
  process.exit(0);
}

const createRes = await fetch(baseUrl, {
  method: "POST",
  headers,
  body: JSON.stringify({ name: WIDGET_NAME, domains: DOMAINS, mode: MODE })
});
const createBody = (await createRes.json()) as CloudflareApiResponse<TurnstileWidgetWithSecret>;

if (!createRes.ok || !createBody.success) {
  console.error("Failed to create the Turnstile widget:", createBody.errors);
  process.exit(1);
}

console.log(`Created widget "${WIDGET_NAME}".`);
console.log(
  `  sitekey: ${createBody.result.sitekey}  (not secret - set as PUBLIC_TURNSTILE_SITE_KEY in .env.production)`
);
console.log(
  `  secret:  ${createBody.result.secret}  (secret - set via 'wrangler secret put TURNSTILE_SECRET_KEY', and as the TURNSTILE_SECRET_KEY GitHub Actions secret for deployment.yml)`
);
console.log("This is the only time the secret is shown - copy it now.");
