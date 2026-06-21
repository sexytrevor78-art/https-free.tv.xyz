Pluto TV US Stremio Addon (Unofficial)

This repository contains a minimal Stremio addon that exposes Pluto TV (United States) live channels using the community-maintained iptv-org M3U playlist as the source of stream URLs.

Important: This is an unofficial project. Pluto TV does not provide a public API for direct streaming for third-party addons; the playlist comes from the iptv-org project which aggregates public stream links. Use responsibly and respect Pluto TV's terms of service.

Quick start (local):

1. Install dependencies

   npm install

2. Run the addon

   npm start

3. In Stremio, add a custom addon and point it to the manifest URL:

   http://localhost:7000/manifest.json

   (If running the addon on a public host, replace with the public URL to /manifest.json.)

What I added

- index.js — Node.js Stremio addon using stremio-addon-sdk. It fetches the iptv-org Pluto TV US M3U and exposes channels as a tv catalog and stream endpoints.
- package.json — dependencies and start script.
- README.md — usage and notes.

Notes and next steps

- The addon uses the iptv-org playlist (https://github.com/iptv-org/iptv) as the source. If you prefer using Pluto's own endpoints, I can update the addon to query their unofficial APIs instead (may require geo/U.S. IP and token handling).
- If you want the addon to be hosted (so you can add it by URL in Stremio without running locally), I can add a GitHub Actions workflow to deploy it to a hosting provider (e.g., Render) or help you set up a small server.

If you'd like, I can now:
- Switch the source to Pluto's unofficial API endpoints (attempt best-effort) instead of iptv-org; or
- Add a /meta resource with more detailed metadata per channel; or
- Deploy the addon to a public URL for you.

Tell me which of those you want next.