# Red Dragon — Stremio Addon (Unofficial)

Red Dragon exposes Pluto TV (United States) live channels as a Stremio addon using the community-maintained iptv-org M3U playlist as the stream source.

**Important:** This is an unofficial project. Pluto TV does not provide a public API for third-party streaming; the playlist comes from the iptv-org project which aggregates public stream links. Use responsibly.

## ⚡ Quick Deploy to Render.com (FREE)

1. Go to [Render.com](https://render.com) and sign up (takes 2 minutes)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account
4. Select this repository (`sexytrevor78-art/https-free.tv.xyz`)
5. Render will auto-detect the `render.yaml` config
6. Click **"Create Web Service"** and wait ~2 minutes for deployment
7. Copy your service URL (looks like: `https://red-dragon-addon-xxxx.onrender.com`)

## 📱 Add to Stremio

Once deployed on Render:

1. Open **Stremio** on your device
2. Go to **Add-ons** → **Custom Add-on**
3. Enter your Render URL followed by `/manifest.json`:
   ```
   https://your-red-dragon-url.onrender.com/manifest.json
   ```
4. Click **Install** and enjoy Pluto TV live channels!

## 🏠 Run Locally

```bash
npm install
npm start
```

Then in Stremio, add custom add-on:
```
http://localhost:7000/manifest.json
```

## 🔧 What's Inside

- **index.js** — Stremio addon server that fetches channels from iptv-org
- **manifest.json** — Addon metadata
- **render.yaml** — Deployment config for Render.com
- **.github/workflows/deploy.yml** — Auto-deploy on code changes

## 🚀 Next Steps (Optional)

- Switch to Pluto TV's unofficial API for more reliable streams
- Add EPG (Electronic Program Guide) support
- Add channel search/filtering

Let me know which improvements you'd like!
