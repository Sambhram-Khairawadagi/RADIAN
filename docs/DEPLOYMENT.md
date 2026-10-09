# Deploy to Vercel

Use standard Next.js hosting, not static export: the enquiry endpoint requires a server runtime.

1. Put this project in a Git repository. Include the lockfile, generated manifests and `public/media`. Exclude `.next`, `node_modules`, `.env.local`, test output and scratch files.
2. Import it into Vercel, select this project root and Next.js, use a Node release satisfying 22.12+, install `npm ci`, build `npm run build`.
3. Set `NEXT_PUBLIC_SITE_URL` to the exact trusted deployment HTTPS origin. This configures canonical/social URLs, sitemap and the enquiry origin check. Preview deployments need their own origin if forms will be tested there.
4. Keep `NEXT_PUBLIC_LAUNCH_APPROVED=false` during review. Use Vercel deployment protection for private previews; robots controls are not authentication.
5. Configure services below, rebuild, then test real delivery with the owner.
6. Complete the checklist, approve disclosures and set `NEXT_PUBLIC_LAUNCH_APPROVED=true` with a fresh build for public indexing.

## Email

Set `RESEND_API_KEY`, `LEAD_FROM_EMAIL` (verified sending domain) and `LEAD_TO_EMAIL` (approved recipient). The handler sends plain text with the validated visitor email as reply-to. Success requires an accepted provider ID; it does not claim confirmed inbox receipt. Provider rejection/timeout is reported truthfully. Lead contents are not logged by the application.

Reference: https://resend.com/docs/api-reference/emails/send-email

## Shared rate limiting

Set `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` and a random private `RATE_LIMIT_SALT`. Set `TRUST_PROXY=true` on Vercel only after confirming forwarding headers are normalized by the platform. Client IP is salted/hashed, with an atomic Redis limit of five attempts per 15 minutes. Without production limiter configuration or service, delivery fails closed. Development uses an in-memory limiter only.

Reference: https://upstash.com/docs/redis/features/restapi

The handler also enforces server-side validation, trusted origin, 16 KB request limit, honeypot and a 1.5-second minimum form interaction time. These mitigate spam; add platform rate rules if traffic requires them.

## Media and updates

Vercel serves `public/media` with cache headers. After changing original assets, run preparation scripts, commit media/manifests and rebuild. Runtime never needs the Desktop source folder or FFmpeg.

No public deployment was performed. A Vercel project/domain and production credentials were not supplied. All secrets belong in environment configuration, never client-side source.
