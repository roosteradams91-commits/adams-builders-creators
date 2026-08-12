// Adams Builders and Creators™ — Cash App Checkout Page
// © 2026 Adams Builders and Creators™ — All Rights Reserved

Deno.serve(async (req) => {
  // Clean the cashtag — handle if user entered full URL or just the tag
  let rawCashtag = Deno.env.get("CASH_APP_CASHTAG") || "adamsbuilders";
  // Strip https://cash.app/$ prefix if present, strip any trailing /amount
  let CASHTAG = rawCashtag.replace(/https?:\/\/cash\.app\/\$/i, "").replace(/\/.*$/, "").replace(/^\$/, "");
  if (!CASHTAG) CASHTAG = "adamsbuilders";
  
  const products = [
    { name: "Sherlock: Active Warrant Search", desc: "One-time deep search across court records, social media, and public data to find active warrants.", price: 49.00, category: "Tool", gumroad_url: "https://adamsbuilders.gumroad.com/l/sherlock-search", featured: true },
    { name: "Sherlock: Warrant Monitoring (Monthly)", desc: "Ongoing warrant monitoring with instant alerts. Cancel anytime.", price: 29.00, category: "Subscription", gumroad_url: "https://adamsbuilders.gumroad.com/l/sherlock-monitor", featured: true },
    { name: "ReviewRocket: SMS Review Collection", desc: "Get more Google reviews from your customers via SMS. Full setup included.", price: 49.00, category: "Service", gumroad_url: "https://adamsbuilders.gumroad.com/l/reviewrocket" },
    { name: "AI Act Comply: SaaS Compliance Checker", desc: "Check your SaaS product against EU AI Act requirements. Full compliance report included.", price: 49.00, category: "Tool", gumroad_url: "https://adamsbuilders.gumroad.com/l/ai-act-comply" },
    { name: "VerifyHub: Verification Platform", desc: "Identity verification platform for businesses. Setup and configuration included.", price: 98.00, category: "Service", gumroad_url: "https://adamsbuilders.gumroad.com/l/verifyhub" },
    { name: "Secret Shopper Pro", desc: "Mystery shopping service for local businesses. Detailed report included.", price: 49.00, category: "Service", gumroad_url: "https://adamsbuilders.gumroad.com/l/secret-shopper" },
    { name: "GBP Monthly Management", desc: "Full Google Business Profile management. Posts, reviews, updates. Monthly service.", price: 79.00, category: "Service", gumroad_url: "https://adamsbuilders.gumroad.com/l/gbp-management" },
    { name: "Email Etiquette Pro", desc: "Professional email communication guide + templates. Instant download.", price: 1.00, category: "Digital", gumroad_url: "https://adamsbuilders.gumroad.com/l/email-etiquette" },
    { name: "Social Media Safety Guide", desc: "Protect yourself online. Complete social media safety guide. Instant download.", price: 2.99, category: "Digital", gumroad_url: "https://adamsbuilders.gumroad.com/l/social-safety" },
    { name: "Harassment Documentation Kit", desc: "Document harassment properly for legal action. Templates + guide. Instant download.", price: 2.99, category: "Digital", gumroad_url: "https://adamsbuilders.gumroad.com/l/harassment-kit" }
  ];

  const cashAppLink = (amount) => `https://cash.app/$${CASHTAG}/${amount.toFixed(2)}`;

  const productCards = products.map(p => {
    const priceWhole = Math.floor(p.price);
    const priceCents = p.price % 1 === 0 ? '00' : Math.round(p.price * 100 % 100).toString().padStart(2, '0');
    const featuredClass = p.featured ? 'featured' : '';
    const featuredBadge = p.featured ? `<div class="featured-badge">POPULAR</div>` : '';
    const gumroadBtn = p.gumroad_url ? `<a href="${p.gumroad_url}" class="btn btn-gumroad" target="_blank" rel="noopener">Card / Gumroad</a>` : '';
    return `<div class="product ${featuredClass}">
      ${featuredBadge}
      <span class="category">${p.category}</span>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="price">$${priceWhole}<span class="cents">.${priceCents}</span></div>
      <div class="buttons">
        <a href="${cashAppLink(p.price)}" class="btn btn-cashapp" target="_blank" rel="noopener">Cash App $${p.price.toFixed(2)}</a>
        ${gumroadBtn}
      </div>
    </div>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Adams Builders and Creators — Checkout</title>
<meta name="description" content="Pay with Cash App or Card. Digital tools, services, and subscriptions from Adams Builders and Creators">
<meta name="robots" content="index, follow">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:#0a0a0f;color:#e8e8e8;padding-top:52px;min-height:100vh}
.hero{background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:60px 20px 40px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(circle at 30% 50%,rgba(0,220,130,0.08) 0%,transparent 50%),radial-gradient(circle at 70% 50%,rgba(0,180,255,0.06) 0%,transparent 50%)}
.hero h1{font-size:2.2rem;background:linear-gradient(90deg,#00dC82,#00b8d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;position:relative}
.hero p{color:#8899aa;margin-top:12px;font-size:1rem;position:relative}
.hero .badge{display:inline-block;background:rgba(0,220,130,0.15);color:#00dC82;padding:6px 16px;border-radius:20px;font-size:0.85rem;margin-top:16px;border:1px solid rgba(0,220,130,0.3);position:relative}
.products{max-width:1200px;margin:0 auto;padding:40px 20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:24px}
.product{background:linear-gradient(145deg,#14142a 0%,#1a1a30 100%);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:28px;transition:all 0.3s ease;position:relative;overflow:hidden}
.product:hover{border-color:rgba(0,220,130,0.2);transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,220,130,0.06)}
.product.featured{border-color:rgba(0,220,130,0.25);background:linear-gradient(145deg,#14142a 0%,#162030 100%)}
.featured-badge{position:absolute;top:16px;right:-32px;background:#00dC82;color:#0a0a0f;font-size:0.65rem;font-weight:700;padding:4px 40px;transform:rotate(35deg);z-index:1}
.product .category{display:inline-block;font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;color:#667788;margin-bottom:8px}
.product h3{font-size:1.15rem;color:#e8e8e8;margin-bottom:8px}
.product p{font-size:0.85rem;color:#778899;line-height:1.5;margin-bottom:16px}
.product .price{font-size:1.8rem;font-weight:700;color:#00dC82;margin-bottom:16px}
.product .price .cents{font-size:1.1rem;opacity:0.7}
.product .buttons{display:flex;gap:10px;flex-wrap:wrap}
.btn{flex:1;min-width:140px;padding:12px 16px;border-radius:10px;font-size:0.9rem;font-weight:600;text-decoration:none;text-align:center;transition:all 0.2s;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px}
.btn-cashapp{background:#00dC82;color:#0a0a0f}
.btn-cashapp:hover{background:#00f08c;transform:scale(1.02)}
.btn-gumroad{background:transparent;color:#ff90e8;border:1px solid rgba(255,144,232,0.3)}
.btn-gumroad:hover{background:rgba(255,144,232,0.1);border-color:rgba(255,144,232,0.5)}
.tip-jar{max-width:600px;margin:0 auto 60px;padding:40px 30px;background:linear-gradient(145deg,#14142a 0%,#1a1a30 100%);border:1px solid rgba(255,255,255,0.06);border-radius:16px;text-align:center}
.tip-jar h2{font-size:1.4rem;margin-bottom:8px;color:#e8e8e8}
.tip-jar p{color:#778899;font-size:0.9rem;margin-bottom:24px}
.tip-amounts{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:16px}
.tip-btn{background:rgba(0,220,130,0.1);color:#00dC82;border:1px solid rgba(0,220,130,0.2);padding:12px 28px;border-radius:10px;font-size:1rem;font-weight:600;cursor:pointer;transition:all 0.2s;text-decoration:none;display:inline-block}
.tip-btn:hover{background:rgba(0,220,130,0.2);transform:scale(1.05)}
.custom-tip{display:flex;gap:10px;max-width:400px;margin:16px auto 0}
.custom-tip input{flex:1;padding:12px 16px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#e8e8e8;font-size:1rem;outline:none}
.custom-tip input:focus{border-color:#00dC82}
.custom-tip button{padding:12px 20px;background:#00dC82;color:#0a0a0f;border:none;border-radius:10px;font-weight:600;cursor:pointer}
.custom-service{max-width:600px;margin:0 auto 60px;padding:40px 30px;background:linear-gradient(145deg,#14142a 0%,#1a1a30 100%);border:1px solid rgba(255,255,255,0.06);border-radius:16px;text-align:center}
.custom-service h2{font-size:1.4rem;margin-bottom:8px;color:#e8e8e8}
.custom-service p{color:#778899;font-size:0.9rem;margin-bottom:24px}
.custom-service-form{display:flex;gap:10px;max-width:400px;margin:0 auto}
.custom-service-form input{flex:1;padding:12px 16px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#e8e8e8;font-size:1rem;outline:none}
.custom-service-form input:focus{border-color:#00dC82}
.custom-service-form button{padding:12px 20px;background:#00dC82;color:#0a0a0f;border:none;border-radius:10px;font-weight:600;cursor:pointer;white-space:nowrap}
.footer{text-align:center;padding:40px 20px;border-top:1px solid rgba(255,255,255,0.04);color:#556677;font-size:0.8rem}
.footer a{color:#667788;text-decoration:none}
.footer a:hover{color:#00dC82}
.footer .legal{margin-top:12px;font-size:0.7rem;color:#445566;max-width:600px;margin-left:auto;margin-right:auto}
@media(max-width:600px){.hero h1{font-size:1.6rem}.products{grid-template-columns:1fr;padding:20px}.product{padding:20px}.btn{min-width:100%}}
</style>
</head>
<body>
<div class="hero">
  <h1>Adams Builders and Creators</h1>
  <p>Digital tools, services &amp; subscriptions</p>
  <div class="badge">Pay with Cash App — Instant</div>
</div>
<div class="products" id="products">
  ${productCards}
</div>
<div class="tip-jar">
  <h2>Support the Builder</h2>
  <p>Like what we're building? Buy Alex a coffee (or a whole pot).</p>
  <div class="tip-amounts">
    <a href="${cashAppLink(5)}" class="tip-btn" target="_blank" rel="noopener">$5</a>
    <a href="${cashAppLink(10)}" class="tip-btn" target="_blank" rel="noopener">$10</a>
    <a href="${cashAppLink(25)}" class="tip-btn" target="_blank" rel="noopener">$25</a>
    <a href="${cashAppLink(50)}" class="tip-btn" target="_blank" rel="noopener">$50</a>
  </div>
  <div class="custom-tip">
    <input type="number" id="customTipAmount" placeholder="Custom amount $" min="1" step="0.01">
    <button onclick="const v=document.getElementById('customTipAmount').value; if(v && v > 0) window.open('https://cash.app/$${CASHTAG}/' + parseFloat(v).toFixed(2))">Send</button>
  </div>
</div>
<div class="custom-service">
  <h2>Pay for a Custom Service</h2>
  <p>Received a custom quote? Enter the amount and pay instantly via Cash App.</p>
  <div class="custom-service-form">
    <input type="number" id="customServiceAmount" placeholder="Invoice amount $" min="1" step="0.01">
    <button onclick="const v=document.getElementById('customServiceAmount').value; if(v && v > 0) window.open('https://cash.app/$${CASHTAG}/' + parseFloat(v).toFixed(2))">Pay Invoice</button>
  </div>
</div>
<div class="footer">
  <p>&copy; 2026 Adams Builders and Creators&trade; &mdash; All Rights Reserved</p>
  <p><a href="https://adamscreators.com">adamscreators.com</a> | 253 Meeks Rd, Colt, AR 72326</p>
  <div class="legal">Products and services provided "as is" without warranty. Digital downloads are non-refundable once accessed. Subscription services may be cancelled at any time. This is not legal, financial, or professional advice. By purchasing, you agree to our Terms of Service and Privacy Policy.</div>
</div>
<script src="https://base44.app/api/apps/6a739f9fb6289211e22db7e0/functions/support-widget-js"></script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=300'
    }
  });
});
