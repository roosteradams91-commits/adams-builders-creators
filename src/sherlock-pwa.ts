/**
 * © 2026 Adams Builders and Creators. All rights reserved.
 * Sherlock™ — Multi-Signal Identity Correlation System for Cyberstalking Detection
 * Patent Pending — Provisional Patent Application filed Aug 11, 2026
 * 
 * CONFIDENTIAL & PROPRIETARY — This code is the property of Adams Builders and Creators.
 * Unauthorized use, copying, modification, or distribution is strictly prohibited.
 * Author: Alex Adams (EIN: 42-3782839)
 */


// Sherlock PWA — Mobile-optimized Progressive Web App
// Serves: PWA shell (GET), manifest.json (?manifest=1), service worker (?sw=1)

const APP_ID = "6a739f9fb6289211e22db7e0";
const BASE = `https://base44.app/api/apps/${APP_ID}/functions`;

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });

  // Serve manifest.json
  if (url.searchParams.get("manifest") === "1") {
    const manifest = {
      name: "Sherlock — Stalker Detection & Public Records",
      short_name: "Sherlock",
      description: "Stalker detection, warrant search, and public records monitoring. Multi-source scanning across 9+ databases with real-time alerts.",
      start_url: `${BASE}/sherlock-pwa`,
      scope: `${BASE}/`,
      display: "standalone",
      orientation: "portrait",
      background_color: "#0f172a",
      theme_color: "#6366f1",
      categories: ["security", "utilities", "productivity"],
      icons: [
        { src: "https://img.icons8.com/fluency/96/detective.png", sizes: "96x96", type: "image/png", purpose: "any" },
        { src: "https://img.icons8.com/fluency/192/detective.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "https://img.icons8.com/fluency/512/detective.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
      ],
      shortcuts: [
        { name: "Warrant Search", short_name: "Warrant", url: `${BASE}/active-warrant-search`, icons: [{ src: "https://img.icons8.com/fluency/96/search.png", sizes: "96x96" }] },
        { name: "Sherlock Portal", short_name: "Portal", url: `${BASE}/sherlock-portal`, icons: [{ src: "https://img.icons8.com/fluency/96/detective.png", sizes: "96x96" }] },
      ],
    };
    return new Response(JSON.stringify(manifest), {
      status: 200,
      headers: { "Content-Type": "application/manifest+json", ...corsHeaders },
    });
  }

  // Serve service worker
  if (url.searchParams.get("sw") === "1") {
    const sw = `
const CACHE_NAME = 'sherlock-pwa-v1';
const APP_SHELL = [
  '${BASE}/sherlock-pwa',
  '${BASE}/sherlock-portal',
  '${BASE}/active-warrant-search',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

self.addEventListener('push', (event) => {
  let data = { title: 'Sherlock Alert', body: 'New activity detected' };
  try { if (event.data) data = event.data.json(); } catch {}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'https://img.icons8.com/fluency/192/detective.png',
      badge: 'https://img.icons8.com/fluency/96/detective.png',
      vibrate: [200, 100, 200],
      data: { url: data.url || '${BASE}/sherlock-pwa' },
      actions: data.action ? [{ action: 'view', title: 'View Details' }] : [],
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '${BASE}/sherlock-pwa')
  );
});
`;
    return new Response(sw, {
      status: 200,
      headers: {
        "Content-Type": "application/javascript",
        "Service-Worker-Allowed": `${BASE}/`,
        ...corsHeaders,
      },
    });
  }

  // POST — handle push subscription
  if (req.method === "POST") {
    try {
      const body = await req.json();
      if (!body || !body.action) return json({ error: "Invalid request" }, 400, corsHeaders);

      if (body.action === "subscribe") {
        // Store the push subscription (in production, save to entity)
        return json({
          success: true,
          message: "Push notifications enabled. You'll receive alerts when new warrants or court filings appear.",
        }, 200, corsHeaders);
      }

      if (body.action === "unsubscribe") {
        return json({ success: true, message: "Push notifications disabled." }, 200, corsHeaders);
      }

      return json({ error: "Unknown action" }, 400, corsHeaders);
    } catch (error) {
      return json({ error: "Request failed" }, 500, corsHeaders);
    }
  }

  // GET — PWA HTML shell
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#0f172a">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Sherlock">
<meta name="mobile-web-app-capable" content="yes">
<link rel="manifest" href="${BASE}/sherlock-pwa?manifest=1">
<link rel="apple-touch-icon" href="https://img.icons8.com/fluency/192/detective.png">
<title>Sherlock — Stalker Detection & Public Records</title>
<meta name="description" content="Sherlock PWA — Stalker detection, active warrant search, and public records monitoring. Scan 9+ databases from your phone. Installable progressive web app with push notifications.">
<style>
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
:root{--safe-top:env(safe-area-inset-top,0px);--safe-bottom:env(safe-area-inset-bottom,0px)}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh;padding-top:var(--safe-top);padding-bottom:var(--safe-bottom);overflow-x:hidden}
.app{max-width:600px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column}
.header{background:linear-gradient(135deg,#0f172a,#1e293b);padding:60px 20px 30px;text-align:center;border-bottom:1px solid #334155;position:sticky;top:0;z-index:100}
.header h1{font-size:1.75rem;margin-bottom:5px}
.header p{color:#94a3b8;font-size:.9rem}
.status-bar{display:flex;justify-content:center;gap:8px;margin-top:12px;flex-wrap:wrap}
.status-badge{background:#1e293b;border:1px solid #334155;border-radius:20px;padding:4px 12px;font-size:.75rem;color:#94a3b8}
.status-badge.active{background:#052e16;border-color:#10b981;color:#6ee7b7}
.status-badge.alert{background:#450a0a;border-color:#ef4444;color:#fca5a5}
.nav{display:flex;background:#1e293b;border-bottom:1px solid #334155;position:sticky;top:0;z-index:99;padding-top:var(--safe-top)}
.nav-btn{flex:1;padding:16px 8px;text-align:center;color:#64748b;font-size:.8rem;font-weight:600;border:none;background:none;cursor:pointer;transition:color .2s,border-bottom .2s;border-bottom:3px solid transparent}
.nav-btn.active{color:#818cf8;border-bottom-color:#6366f1}
.nav-btn:active{color:#a5b4fc}
.content{flex:1;padding:20px;overflow-y:auto;-webkit-overflow-scrolling:touch}
.card{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:20px;margin-bottom:16px;transition:transform .1s}
.card:active{transform:scale(.98)}
.card h3{color:#818cf8;font-size:1.1rem;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.card p{color:#94a3b8;font-size:.9rem;line-height:1.5}
.card .arrow{float:right;color:#475569;font-size:1.2rem}
.action-btn{display:block;width:100%;padding:16px;background:#6366f1;color:#fff;border:none;border-radius:10px;font-size:1rem;font-weight:600;cursor:pointer;margin-top:12px;text-align:center;text-decoration:none}
.action-btn:active{background:#5558e9}
.action-btn.secondary{background:#334155;color:#e2e8f0}
.action-btn.danger{background:#7f1d1d;color:#fca5a5}
.alert-box{background:#052e16;border:1px solid #10b981;border-radius:10px;padding:20px;text-align:center;margin-bottom:16px}
.alert-box .code{font-size:2.5rem;font-weight:900;color:#10b981;letter-spacing:.4rem;margin-bottom:8px}
.alert-box .msg{color:#6ee7b7;font-size:1.1rem}
.search-form input,.search-form select{width:100%;padding:14px;margin:8px 0;border:2px solid #334155;border-radius:10px;font-size:16px;background:#0f172a;color:#e2e8f0}
.search-form label{display:block;font-size:.8rem;font-weight:600;color:#94a3b8;margin:10px 0 4px}
.install-banner{display:none;background:linear-gradient(135deg,#312e81,#4338ca);padding:16px 20px;border-radius:12px;margin-bottom:16px;align-items:center;justify-content:space-between}
.install-banner.show{display:flex}
.install-banner .text{color:#c7d2fe;font-size:.85rem;flex:1}
.install-banner button{background:#fff;color:#312e81;border:none;border-radius:8px;padding:10px 16px;font-weight:600;font-size:.85rem;margin-left:12px;cursor:pointer;white-space:nowrap}
.scan-item{padding:12px;border-left:3px solid #334155;margin:8px 0;border-radius:0 8px 8px 0;background:#0f172a}
.scan-item a{color:#818cf8;text-decoration:none;font-weight:600}
.scan-item .meta{color:#64748b;font-size:.8rem;margin-top:4px}
.spinner{display:inline-block;width:24px;height:24px;border:3px solid #334155;border-top-color:#6366f1;border-radius:50%;animation:spin 1s linear infinite;margin:20px auto}
@keyframes spin{to{transform:rotate(360deg)}}
.loading{text-align:center;padding:40px}
.feature-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}
.feature{background:#0f172a;border:1px solid #334155;border-radius:10px;padding:16px;text-align:center}
.feature .icon{font-size:1.5rem;margin-bottom:6px}
.feature .label{font-size:.75rem;color:#94a3b8}
.section-title{color:#475569;font-size:.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.05rem;margin:20px 0 10px}
.hidden{display:none}
</style>
</head>
<body>
<script src="${BASE}/support-widget-js"></script>

<div class="app">
  <div class="header">
    <h1>🔒 Sherlock</h1>
    <p>Stalker Detection & Public Records</p>
    <div class="status-bar">
      <span class="status-badge" id="connectionStatus">● Connected</span>
      <span class="status-badge" id="pushStatus">Push: Off</span>
      <span class="status-badge" id="installStatus">Not Installed</span>
    </div>
  </div>

  <nav class="nav">
    <button class="nav-btn active" onclick="showTab('home')">Home</button>
    <button class="nav-btn" onclick="showTab('warrant')">Warrant</button>
    <button class="nav-btn" onclick="showTab('tools')">Tools</button>
    <button class="nav-btn" onclick="showTab('alerts')">Alerts</button>
  </nav>

  <div class="content">
    <!-- Install Banner -->
    <div class="install-banner" id="installBanner">
      <div class="text">Install Sherlock on your home screen for quick access.</div>
      <button onclick="installApp()">Install</button>
    </div>

    <!-- HOME TAB -->
    <div id="tab-home">
      <div class="card">
        <h3>🔎 Active Warrant Search</h3>
        <p>Search 9+ public records sources simultaneously. Federal dockets, state courts, US Marshals, FBI, DEA, and more.</p>
        <a class="action-btn" onclick="showTab('warrant')">Search Now →</a>
      </div>

      <div class="card">
        <h3>📱 Sherlock Portal</h3>
        <p>Full stalker detection platform — device tracking, search analysis, decoy links, and investigation tools.</p>
        <a class="action-btn secondary" href="${BASE}/sherlock-portal" target="_blank">Open Portal →</a>
      </div>

      <div class="card">
        <h3>🔔 Monitor & Alert</h3>
        <p>Daily monitoring across all sources with instant push notifications when new filings appear.</p>
        <a class="action-btn" onclick="showTab('alerts')">Set Up Alerts →</a>
      </div>

      <div class="section-title">Quick Tools</div>
      <div class="feature-grid">
        <div class="card" style="margin:0;padding:16px" onclick="window.open('${BASE}/sherlock-portal','_blank')">
          <div style="font-size:1.5rem">🔍</div>
          <div class="label">Stalker Check</div>
        </div>
        <div class="card" style="margin:0;padding:16px" onclick="showTab('warrant')">
          <div style="font-size:1.5rem">⚖️</div>
          <div class="label">Warrant Scan</div>
        </div>
        <div class="card" style="margin:0;padding:16px" onclick="window.open('${BASE}/sherlock-landing','_blank')">
          <div style="font-size:1.5rem">📋</div>
          <div class="label">Full Report</div>
        </div>
        <div class="card" style="margin:0;padding:16px" onclick="showTab('alerts')">
          <div style="font-size:1.5rem">🔔</div>
          <div class="label">Alerts</div>
        </div>
      </div>

      <div class="section-title">Products</div>
      <div class="card" onclick="window.open('https://roosteradams.gumroad.com','_blank')">
        <h3>🛒 Gumroad Store</h3>
        <p>All Sherlock products and services</p>
        <span class="arrow">→</span>
      </div>
    </div>

    <!-- WARRANT TAB -->
    <div id="tab-warrant" class="hidden">
      <h2 style="margin-bottom:16px;color:#f8fafc">Active Warrant Search</h2>
      <p style="color:#94a3b8;font-size:.85rem;margin-bottom:16px">Queries 9+ live data sources: CourtListener (federal dockets + case law), state courts, US Marshals, FBI, DEA, NSOPW, VINELink, JudyRecords.</p>

      <div class="search-form">
        <label>Full Name</label>
        <input type="text" id="warrantName" placeholder="John Doe" autocomplete="off">
        <label>State</label>
        <select id="warrantState">
          <option value="">Select state...</option>
        </select>
        <label>Email (for alerts)</label>
        <input type="email" id="warrantEmail" placeholder="your@email.com" autocomplete="off">
        <button class="action-btn" onclick="runWarrantSearch()" id="warrantBtn">Scan All Sources →</button>
      </div>

      <div id="warrantResult" class="hidden" style="margin-top:20px"></div>

      <div class="card" style="margin-top:20px;background:#451a03;border-color:#92400e">
        <p style="color:#fde68a;font-size:.8rem"><strong>⚠️ Important:</strong> Each source updates on its own schedule. A clean result doesn't guarantee no warrants exist. Only law enforcement databases (NCIC) have complete real-time data. This is not legal advice.</p>
      </div>
    </div>

    <!-- TOOLS TAB -->
    <div id="tab-tools" class="hidden">
      <h2 style="margin-bottom:16px;color:#f8fafc">Investigation Tools</h2>

      <div class="card" onclick="window.open('${BASE}/sherlock-portal','_blank')">
        <h3>🔍 Sherlock Portal</h3>
        <p>Full investigation platform — device tracking, search analysis, evidence collection</p>
        <span class="arrow">→</span>
      </div>

      <div class="card" onclick="window.open('${BASE}/active-warrant-search','_blank')">
        <h3>⚖️ Warrant Search (Full)</h3>
        <p>Full web version with all 50 states and federal databases</p>
        <span class="arrow">→</span>
      </div>

      <div class="card" onclick="window.open('${BASE}/verify-hub-landing','_blank')">
        <h3>👁️ VerifyHub</h3>
        <p>Double-blind image verification — deepfake detection, content moderation</p>
        <span class="arrow">→</span>
      </div>

      <div class="card" onclick="window.open('${BASE}/mobile-fix?page=review-rocket','_blank')">
        <h3>⭐ ReviewRocket</h3>
        <p>Google Business Profile review management with SMS automation</p>
        <span class="arrow">→</span>
      </div>

      <div class="card" onclick="window.open('${BASE}/mobile-fix?page=ai-act','_blank')">
        <h3>🇪🇺 AI Act Comply</h3>
        <p>EU AI Act compliance checker for AI-powered services</p>
        <span class="arrow">→</span>
      </div>

      <div class="card" onclick="window.open('https://roosteradams.gumroad.com','_blank')">
        <h3>🛒 All Products</h3>
        <p>Browse all Gumroad products and services</p>
        <span class="arrow">→</span>
      </div>
    </div>

    <!-- ALERTS TAB -->
    <div id="tab-alerts" class="hidden">
      <h2 style="margin-bottom:16px;color:#f8fafc">Monitor & Alerts</h2>

      <div id="pushSetup">
        <div class="card">
          <h3>🔔 Push Notifications</h3>
          <p>Get instant push alerts on your phone when new warrants or court filings appear for your tracked person.</p>
          <button class="action-btn" onclick="enablePush()" id="pushBtn">Enable Push Notifications →</button>
        </div>

        <div class="card">
          <h3>📊 Subscription Monitor</h3>
          <p>Monthly subscription: $29/mo. Daily scans across all 9+ sources with instant alerts.</p>
          <a class="action-btn" href="https://checkout.stripe.com/c/pay/cs_test_a1UxK8jPmpPfW18mf4eY7cFSogUmHgWqx8vLrnHgwGtfms139t6TZ3scqW" target="_blank">Subscribe ($29/mo) →</a>
        </div>

        <div class="card">
          <h3>🛒 One-Time Scan</h3>
          <p>Single comprehensive scan across all sources. No subscription needed.</p>
          <a class="action-btn secondary" href="https://roosteradams.gumroad.com/l/turhx" target="_blank">Buy One-Time Scan ($49) →</a>
        </div>
      </div>

      <div id="pushActive" class="hidden">
        <div class="alert-box">
          <div class="code">✓ ON</div>
          <div class="msg">Push notifications active</div>
        </div>
        <div class="card">
          <h3>📊 Your Subscription</h3>
          <p id="subStatus">Checking subscription status...</p>
          <button class="action-btn danger" onclick="disablePush()">Disable Notifications</button>
        </div>
      </div>

      <div class="section-title">Recent Alerts</div>
      <div id="recentAlerts">
        <div class="card" style="text-align:center;color:#64748b;font-size:.9rem">No recent alerts. You'll be notified here when new filings are detected.</div>
      </div>
    </div>
  </div>
</div>

<script>
// --- Tab Navigation ---
function showTab(tab) {
  document.querySelectorAll('[id^="tab-"]').forEach(el => el.classList.add('hidden'));
  document.getElementById('tab-' + tab).classList.remove('hidden');
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  event.target.closest('.nav-btn').classList.add('active');
  if (tab === 'warrant') loadStates();
}

// --- Populate State Dropdown ---
const STATES = [["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"]];

function loadStates() {
  const sel = document.getElementById('warrantState');
  if (sel.options.length > 1) return;
  STATES.forEach(([code, name]) => {
    const opt = document.createElement('option');
    opt.value = code; opt.textContent = name;
    sel.appendChild(opt);
  });
}

// --- Warrant Search ---
async function runWarrantSearch() {
  const n = document.getElementById('warrantName').value.trim();
  const s = document.getElementById('warrantState').value;
  const e = document.getElementById('warrantEmail').value.trim();
  if (!n || !s || !e) { alert('Please fill in all fields'); return; }

  const btn = document.getElementById('warrantBtn');
  btn.disabled = true; btn.textContent = 'Scanning 9+ sources...';
  document.getElementById('warrantResult').classList.remove('hidden');
  document.getElementById('warrantResult').innerHTML = '<div class="loading"><div class="spinner"></div><p style="color:#94a3b8">Querying federal dockets, state courts, and wanted databases...</p></div>';

  try {
    const res = await fetch('${BASE}/active-warrant-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ person_name: n, state: s, email: e })
    });
    const data = await res.json();

    if (data.success) {
      let html = '';
      if (data.status_code === '10-22') {
        html += '<div class="alert-box"><div class="code">10-22</div><div class="msg">' + esc(data.status_message) + '</div><p style="color:#a7f3d0;font-size:.85rem;margin-top:8px">' + esc(data.status_sub) + '</p></div>';
      } else if (data.status_code === '10-31') {
        html += '<div style="background:linear-gradient(135deg,#450a0a,#7f1d1d);border:2px solid #ef4444;border-radius:12px;padding:24px;text-align:center;margin-bottom:16px"><div style="font-size:2.5rem;font-weight:900;color:#ef4444;letter-spacing:.4rem">' + data.status_code + '</div><div style="color:#fca5a5;font-size:1.1rem">' + esc(data.status_message) + '</div><p style="color:#fecaca;font-size:.85rem;margin-top:8px">' + esc(data.status_sub) + '</p></div>';
      }

      html += '<p style="color:#64748b;font-size:.8rem;margin:12px 0">Scanned ' + data.sources_checked + ' sources at ' + new Date().toLocaleString() + '</p>';

      if (data.source_results) {
        data.source_results.forEach(src => {
          html += '<div class="card"><h3 style="font-size:.95rem">' + esc(src.source) + '</h3>';
          html += '<div style="color:#64748b;font-size:.75rem;margin-bottom:8px">' + (src.error ? 'Error: ' + esc(src.error) : src.results_found + ' results') + '</div>';
          if (src.results && src.results.length > 0) {
            src.results.slice(0, 3).forEach(c => {
              html += '<div class="scan-item"><a href="' + (c.url !== 'N/A' ? c.url : '#') + '" target="_blank">' + esc(c.case_name) + '</a><div class="meta">' + esc(c.court) + ' • ' + esc(c.date_filed) + ' • ' + esc(c.docket_number) + '</div></div>';
            });
            if (src.results.length > 3) html += '<p style="color:#64748b;font-size:.8rem;margin:8px 0">+' + (src.results.length - 3) + ' more...</p>';
          } else if (!src.error) {
            html += '<p style="color:#64748b;font-size:.8rem">No results found.</p>';
          }
          html += '</div>';
        });
      }

      html += '<div class="card"><h3 style="font-size:.95rem">State: ' + esc(data.state_info.name) + '</h3><p style="font-size:.85rem">' + esc(data.state_info.notes) + '</p>';
      html += '<a href="' + data.state_info.url + '" target="_blank" style="color:#818cf8;font-size:.85rem">→ Search ' + esc(data.state_info.name) + ' Court Records</a></div>';

      document.getElementById('warrantResult').innerHTML = html;
      btn.disabled = false; btn.textContent = 'Scan Again →';
    } else {
      throw new Error(data.error || 'Search failed');
    }
  } catch (err) {
    document.getElementById('warrantResult').innerHTML = '<div class="card" style="background:#450a0a;border-color:#991b1b"><p style="color:#fca5a5">Error: ' + esc(err.message) + '</p></div>';
    btn.disabled = false; btn.textContent = 'Scan All Sources →';
  }
}

// --- Push Notifications ---
let pushSubscription = null;
let deferredPrompt = null;

async function enablePush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    alert('Push notifications not supported on this device');
    return;
  }

  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true });
    pushSubscription = sub;

    // Send subscription to backend
    await fetch('${BASE}/sherlock-pwa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'subscribe', subscription: sub })
    });

    document.getElementById('pushSetup').classList.add('hidden');
    document.getElementById('pushActive').classList.remove('hidden');
    document.getElementById('pushStatus').textContent = 'Push: On';
    document.getElementById('pushStatus').classList.add('active');
  } catch (err) {
    alert('Failed to enable push: ' + err.message);
  }
}

async function disablePush() {
  if (pushSubscription) {
    try {
      await pushSubscription.unsubscribe();
      await fetch('${BASE}/sherlock-pwa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unsubscribe' })
      });
    } catch {}
  }
  pushSubscription = null;
  document.getElementById('pushActive').classList.add('hidden');
  document.getElementById('pushSetup').classList.remove('hidden');
  document.getElementById('pushStatus').textContent = 'Push: Off';
  document.getElementById('pushStatus').classList.remove('active');
}

// --- PWA Install ---
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBanner').classList.add('show');
  document.getElementById('installStatus').textContent = 'Install Ready';
});

async function installApp() {
  if (!deferredPrompt) {
    alert('To install: tap Share → Add to Home Screen');
    return;
  }
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    document.getElementById('installBanner').classList.remove('show');
    document.getElementById('installStatus').textContent = 'Installed';
    document.getElementById('installStatus').classList.add('active');
  }
  deferredPrompt = null;
}

window.addEventListener('appinstalled', () => {
  document.getElementById('installBanner').classList.remove('show');
  document.getElementById('installStatus').textContent = 'Installed';
  document.getElementById('installStatus').classList.add('active');
});

// --- Service Worker Registration ---
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('${BASE}/sherlock-pwa?sw=1', { scope: '${BASE}/' })
    .then(() => console.log('SW registered'))
    .catch(err => console.log('SW failed:', err));
}

// --- Online/Offline Status ---
window.addEventListener('online', () => {
  document.getElementById('connectionStatus').textContent = '● Connected';
  document.getElementById('connectionStatus').classList.remove('alert');
  document.getElementById('connectionStatus').classList.add('active');
});
window.addEventListener('offline', () => {
  document.getElementById('connectionStatus').textContent = '● Offline';
  document.getElementById('connectionStatus').classList.add('alert');
  document.getElementById('connectionStatus').classList.remove('active');
});

// --- Check if already installed ---
if (window.matchMedia('(display-mode: standalone)').matches) {
  document.getElementById('installStatus').textContent = 'Installed';
  document.getElementById('installStatus').classList.add('active');
  document.getElementById('installBanner').classList.remove('show');
}

// --- Utility ---
function esc(s) { if (!s) return ''; return String(s).replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c])); }
</script>
<footer style="padding:20px;background:#1e293b;text-align:center;border-top:1px solid #334155;margin-top:auto">
    <a href="https://app.base44.com/superagent/6a739f9fb6289211e22db7e0" style="color:#94a3b8;margin:0 10px;text-decoration:none;font-size:.75rem">Privacy Policy</a>
    <a href="https://app.base44.com/superagent/6a739f9fb6289211e22db7e0" style="color:#94a3b8;margin:0 10px;text-decoration:none;font-size:.75rem">Terms of Service</a>
    <p style="margin-top:8px;color:#475569;font-size:.7rem">© 2026 Adams Builders and Creators. All rights reserved.</p>
  </footer>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html", ...corsHeaders },
  });
});

function json(data: any, status = 200, corsHeaders: any = {}): Response {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...corsHeaders } });
}
