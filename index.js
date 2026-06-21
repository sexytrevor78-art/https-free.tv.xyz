const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const fetch = require('node-fetch');

// Source M3U playlist (community-maintained)
const M3U_URL = 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/us_plutotv.m3u';

const manifest = {
  id: 'org.sexytrevor78.red-dragon',
  version: '1.0.0',
  name: 'Red Dragon (Pluto TV US)',
  description: 'Red Dragon - Unofficial Pluto TV US live channels via iptv-org playlist.',
  resources: ['catalog', 'stream'],
  types: ['tv'],
  catalogs: [
    { type: 'tv', id: 'red-dragon-pluto-us', name: 'Red Dragon - Pluto TV (US)' }
  ]
};

let channels = {}; // id -> { name, url, logo }
let loaded = false;

async function loadChannels() {
  if (loaded) return;
  try {
    const res = await fetch(M3U_URL);
    const text = await res.text();
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      if (line.startsWith('#EXTINF')) {
        const meta = line;
        const url = lines[i + 1] ? lines[i + 1].trim() : '';
        const nameMatch = meta.match(/,([^,\n\r]*)$/);
        const name = nameMatch ? nameMatch[1].trim() : 'Unknown';
        const tvgIdMatch = meta.match(/tvg-id="([^"]+)"/);
        const tvgId = tvgIdMatch ? tvgIdMatch[1] : name.replace(/\s+/g, '_').toLowerCase();
        const logoMatch = meta.match(/tvg-logo="([^"]+)"/);
        const logo = logoMatch ? logoMatch[1] : null;
        const id = `red-dragon:${tvgId}`;
        channels[id] = { name, url, logo };
      }
    }
    console.log(`✅ Loaded ${Object.keys(channels).length} channels from iptv-org`);
    loaded = true;
  } catch (err) {
    console.error('❌ Error loading channels:', err.message);
  }
}

// Create addon - addonBuilder is a function, not a constructor
const addon = addonBuilder(manifest);

// Register handlers
addon.defineCatalogHandler(async (args) => {
  await loadChannels();
  const metas = Object.keys(channels).map(id => {
    const ch = channels[id];
    return {
      id,
      type: 'tv',
      name: ch.name,
      poster: ch.logo || '',
      logo: ch.logo || '',
      releaseInfo: 'Live'
    };
  });
  return { metas };
});

addon.defineStreamHandler(async ({ id }) => {
  if (!channels[id]) return { streams: [] };
  const ch = channels[id];
  return {
    streams: [
      {
        title: ch.name,
        url: ch.url,
        isFree: true
      }
    ]
  };
});

const addonInterface = addon.getInterface();
module.exports = addonInterface;

if (require.main === module) {
  const port = process.env.PORT || 7000;
  serveHTTP(addonInterface, { port });
  console.log(`🚀 Addon listening on http://localhost:${port}/manifest.json`);
}
