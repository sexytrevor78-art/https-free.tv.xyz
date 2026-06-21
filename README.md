# Red Dragon — Stremio Addon (Unofficial)

Red Dragon exposes Pluto TV (United States) live channels as a Stremio addon using the community-maintained iptv-org M3U playlist as the stream source.

Important: This is an unofficial project. Pluto TV does not provide a public API for third-party streaming; the playlist comes from the iptv-org project which aggregates public stream links. Use responsibly and respect Pluto TV's terms of service.

## Add-on manifest (use this URL in Stremio)

Add this manifest URL in Stremio's "Manual / Custom Add-on" field to add the addon directly:

https://raw.githubusercontent.com/sexytrevor78-art/https-free.tv.xyz/main/manifest.json

## Quick start (local)

1. Install dependencies

   npm install

2. Run the addon

   npm start

3. In Stremio, add a custom add-on and point it to the manifest URL above or to:

   http://localhost:7000/manifest.json

## What I changed

- Renamed the addon to **Red Dragon** in code and package metadata.
- Added a top-level `manifest.json` so people can add the raw GitHub manifest URL directly to Stremio.

## Next steps

- Switch the source to Pluto's unofficial API endpoints (requires US IP and careful header handling).
- Improve metadata (/meta resource) or add EPG support.
- Deploy to a public host and provide a stable manifest URL.

Tell me which of the next steps you want and I will implement it.