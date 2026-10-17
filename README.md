# Martina Morais da Silva — portfolio (Cloudflare)

The site is a Vite/React static frontend served by a Cloudflare Worker. The Worker provides shared, persistent storage for the profile photo, CV, motivation letter, and certificate files using Cloudflare Workers KV.

## Required Cloudflare setup

The source code intentionally does not contain an admin password or a real KV namespace ID. Configure both in your own Cloudflare account before using uploads.

1. In Cloudflare, open **Workers & Pages → KV** and create a KV namespace, for example `martina-portfolio-storage`.
2. Copy the namespace ID and replace `REPLACE_WITH_YOUR_CLOUDFLARE_KV_NAMESPACE_ID` in `wrangler.jsonc` with that exact ID. Keep the binding name `PORTFOLIO_KV` unchanged.
3. Open the Worker `my-portfolio` in **Settings → Variables and Secrets** and add `PORTFOLIO_ADMIN_TOKEN` as an encrypted **Secret**. Use a long, unique password. Do not put the secret in this repository or commit it to GitHub.
4. Confirm the Worker is configured to use `worker.js` and the static assets directory `dist`. The Wrangler configuration now runs `npm run build` automatically before `wrangler deploy`, creating the `dist` directory required by the `assets` setting. In Cloudflare Workers Builds, set the **Root directory** to the folder containing `package.json` and `wrangler.jsonc`, and use `npx wrangler deploy` as the deploy command. The build step is configured in `wrangler.jsonc`. Ensure the project is deployed as a Worker, not as a static-only Pages site, because the API is implemented in `worker.js`.
5. Commit and push the updated `worker.js`, `wrangler.jsonc`, `wrangler.toml`, `package.json`, and README to GitHub, then wait for Cloudflare to deploy the new version.
6. Open the live site and upload the photo and documents again. Files that existed only in a browser's local storage or IndexedDB are not automatically copied to Cloudflare KV.
7. On the first upload, the site asks for the admin token. Enter exactly the same secret configured as `PORTFOLIO_ADMIN_TOKEN`. It is kept in the current browser session only.

If you change the KV namespace ID in `wrangler.jsonc`, trigger a new deployment. If the API returns `STORAGE_NOT_CONFIGURED`, the Worker does not have the `PORTFOLIO_KV` binding. If it returns `Admin token rejected`, check the encrypted `PORTFOLIO_ADMIN_TOKEN` secret and enter the same value in the site prompt.

## Storage behavior

- Public GET requests read the stored portfolio files and certificate metadata.
- Upload, replace, delete, and metadata update requests require the admin token.
- Files are limited to 4 MiB and PDF, JPEG, PNG, or WebP.
- Files are stored in KV as base64 values. The upload limit keeps the encoded values below the Workers KV per-value size limit.
- KV is suitable for this small portfolio. It is not intended as a general file-hosting system for large documents or high upload volumes.
- Uploaded certificates are publicly readable by the portfolio because the page displays them. Do not upload a document that must remain confidential.

## Local development

```bash
npm install
npm run build
```

The Cloudflare API requires the KV binding and admin secret to be configured in the deployed Worker. A local static Vite preview does not provide that backend automatically. Before the first deploy, replace the KV namespace placeholder in `wrangler.jsonc`; Wrangler cannot deploy the placeholder value.
