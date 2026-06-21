const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const fetch = require('node-fetch');

// Source M3U playlist (community-maintained)
const M3U_URL = 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/us_pluto.m3u';

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

const builder = new addonBuilder(manifest);
let channels = {}; // id -> { name, url, logo }
let loaded = false;
let lastError = null;

async function loadChannels() {
  if (loaded) return;
  
  try {
    console.log('[RED-DRAGON] Starting to load channels from:', M3U_URL);
    
    const res = await fetch(M3U_URL, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0'
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const text = await res.text();
    console.log('[RED-DRAGON] Fetched M3U file, size:', text.length, 'bytes');
    
    if (!text || text.length < 100) {
      throw new Error('M3U file is empty or too small');
    }
    
    const lines = text.split(/\r?\n/);
    console.log('[RED-DRAGON] M3U has', lines.length, 'lines');
    
    let channelCount = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      if (line.startsWith('#EXTINF')) {
        const meta = line;
        const url = lines[i + 1] ? lines[i + 1].trim() : '';
        
        // Make sure we have a URL
        if (!url || url.startsWith('#')) continue;
        
        const nameMatch = meta.match(/,([^\n\r]*)$/);
        const name = nameMatch ? nameMatch[1].trim() : 'Unknown';
        
        const tvgIdMatch = meta.match(/tvg-id="([^"]+)"/);
        const tvgId = tvgIdMatch ? tvgIdMatch[1] : name.replace(/\s+/g, '_').toLowerCase();
        
        const logoMatch = meta.match(/tvg-logo="([^"]+)"/);
        const logo = logoMatch ? logoMatch[1] : null;
        
        const id = `red-dragon:${tvgId}`;
        channels[id] = { name, url, logo };
        channelCount++;
      }
    }
    
    console.log(`✅ [RED-DRAGON] Successfully loaded ${channelCount} channels`);
    lastError = null;
    loaded = true;
    
  } catch (err) {
    lastError = err.message;
    console.error('❌ [RED-DRAGON] Error loading channels:', err.message);
    console.error('[RED-DRAGON] Stack:', err.stack);
  }
}

builder.defineCatalogHandler(async (args) => {
  await loadChannels();
  
  console.log(`[RED-DRAGON] Catalog request - returning ${Object.keys(channels).length} channels`);
  
  if (Object.keys(channels).length === 0) {
    console.warn('[RED-DRAGON] ⚠️  WARNING: No channels loaded! Last error:', lastError);
    // Return a test channel so users know the addon is working
    return {
      metas: [
        {
          id: 'red-dragon:test',
          type: 'tv',
          name: '⚠️ No channels loaded - Check logs',
          poster: '',
          releaseInfo: lastError || 'Unknown error'
        }
      ]
    };
  }
  
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

builder.defineStreamHandler(async ({ id }) => {
  if (!channels[id]) {
    console.warn('[RED-DRAGON] Stream requested for unknown ID:', id);
    return { streams: [] };
  }
  
  const ch = channels[id];
  console.log('[RED-DRAGON] Serving stream for:', ch.name);
  
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

const addonInterface = builder.getInterface();
module.exports = addonInterface;

if (require.main === module) {
  const port = process.env.PORT || 7000;
  serveHTTP(addonInterface, { port });
  console.log(`🚀 [RED-DRAGON] Addon listening on http://localhost:${port}/manifest.json`);
  
  // Load channels immediately on startup
  loadChannels();
}
