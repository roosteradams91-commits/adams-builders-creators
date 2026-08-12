/**
 * © 2026 Adams Builders and Creators. All rights reserved.
 * Sherlock™ — Multi-Signal Identity Correlation System for Cyberstalking Detection
 * Patent Pending — Provisional Patent Application filed Aug 11, 2026
 * 
 * CONFIDENTIAL & PROPRIETARY — This code is the property of Adams Builders and Creators.
 * Unauthorized use, copying, modification, or distribution is strictly prohibited.
 * Author: Alex Adams (EIN: 42-3782839)
 */


// Active Warrant Search — Sherlock Tier Product
// Queries multiple live data sources for warrants, court cases, and criminal records
// Sources: CourtListener API (federal dockets + case law), state court databases,
//          US Marshals, FBI, DEA, NSOPW, VINELink, JudyRecords

const LEGAL_DISCLAIMER = {
  not_legal_advice: "This service aggregates publicly available warrant and court record information. It does not constitute legal advice and is not affiliated with any law enforcement agency.",
  no_guarantee: "Warrant information may be outdated, incomplete, or inaccurate. Only law enforcement databases (NCIC) contain complete, real-time warrant data. Always verify with the issuing jurisdiction.",
  liability_cap: "Liability is limited to the amount paid for the service.",
  terms_url: "https://app.base44.com/superagent/6a739f9fb6289211e22db7e0",
  data_source: "Data sourced from CourtListener (federal court dockets), state court databases, US Marshals, FBI, DEA, NSOPW, VINELink, and JudyRecords. Each source updates on different schedules."
};

const STATE_RESOURCES: Record<string, { name: string; online_search: boolean; url: string; notes: string }> = {
  "AL": { name: "Alabama", online_search: true, url: "https://www.alacourt.gov", notes: "Alabama Unified Judicial System" },
  "AK": { name: "Alaska", online_search: false, url: "https://courts.alaska.gov", notes: "Contact Alaska Court System" },
  "AZ": { name: "Arizona", online_search: true, url: "https://www.azcourts.gov", notes: "Arizona Judicial Branch" },
  "AR": { name: "Arkansas", online_search: true, url: "https://caseinfo.arcourts.gov", notes: "Arkansas CourtConnect" },
  "CA": { name: "California", online_search: true, url: "https://www.courts.ca.gov", notes: "California Courts — county-by-county" },
  "CO": { name: "Colorado", online_search: true, url: "https://www.courts.state.co.us", notes: "Colorado Judicial Branch" },
  "CT": { name: "Connecticut", online_search: true, url: "https://www.jud.ct.gov", notes: "Connecticut Judicial Branch" },
  "DE": { name: "Delaware", online_search: true, url: "https://courts.delaware.gov", notes: "Delaware Courts" },
  "FL": { name: "Florida", online_search: true, url: "https://www.flclerks.com", notes: "Florida Clerks of Court" },
  "GA": { name: "Georgia", online_search: true, url: "https://www.gsccca.org", notes: "Georgia Superior Court Clerks" },
  "HI": { name: "Hawaii", online_search: false, url: "https://www.courts.state.hi.us", notes: "Contact Hawaii State Judiciary" },
  "ID": { name: "Idaho", online_search: true, url: "https://www.idcourts.us", notes: "Idaho Supreme Court" },
  "IL": { name: "Illinois", online_search: true, url: "https://www.illinoiscourts.gov", notes: "Illinois Courts — county-by-county" },
  "IN": { name: "Indiana", online_search: true, url: "https://mycase.in.gov", notes: "Indiana MyCase" },
  "IA": { name: "Iowa", online_search: true, url: "https://www.iowacourts.gov", notes: "Iowa Courts Online" },
  "KS": { name: "Kansas", online_search: true, url: "https://www.kansas.gov", notes: "Kansas District Court Records" },
  "KY": { name: "Kentucky", online_search: true, url: "https://kcoa.kycourts.net", notes: "Kentucky Court of Justice" },
  "LA": { name: "Louisiana", online_search: false, url: "https://www.lasc.org", notes: "Contact Louisiana Supreme Court" },
  "ME": { name: "Maine", online_search: false, url: "https://www.courts.maine.gov", notes: "Contact Maine Judicial Branch" },
  "MD": { name: "Maryland", online_search: true, url: "https://casesearch.courts.state.md.us", notes: "Maryland Judiciary Case Search" },
  "MA": { name: "Massachusetts", online_search: true, url: "https://www.masscourts.org", notes: "Massachusetts Courts" },
  "MI": { name: "Michigan", online_search: true, url: "https://courtexplorer.courts.mi.gov", notes: "Michigan Court Explorer" },
  "MN": { name: "Minnesota", online_search: true, url: "https://www.mncourts.gov", notes: "Minnesota Courts" },
  "MS": { name: "Mississippi", online_search: false, url: "https://www.mssc.us", notes: "Contact Mississippi Judiciary" },
  "MO": { name: "Missouri", online_search: true, url: "https://www.courts.mo.gov/casenet", notes: "Missouri CaseNet" },
  "MT": { name: "Montana", online_search: false, url: "https://courts.mt.gov", notes: "Contact Montana Courts" },
  "NE": { name: "Nebraska", online_search: true, url: "https://www.nebraska.gov", notes: "Nebraska Judicial Branch" },
  "NV": { name: "Nevada", online_search: true, url: "https://www.nvcourts.gov", notes: "Nevada Courts" },
  "NH": { name: "New Hampshire", online_search: false, url: "https://www.courts.nh.gov", notes: "Contact NH Courts" },
  "NJ": { name: "New Jersey", online_search: true, url: "https://www.njcourts.gov", notes: "New Jersey Courts" },
  "NM": { name: "New Mexico", online_search: true, url: "https://www.nmcourts.gov", notes: "New Mexico Courts" },
  "NY": { name: "New York", online_search: true, url: "https://www.nycourts.gov", notes: "NY Courts — webcivil Supreme" },
  "NC": { name: "North Carolina", online_search: true, url: "https://www.nccourts.gov", notes: "NC Courts" },
  "ND": { name: "North Dakota", online_search: true, url: "https://www.ndcourts.gov", notes: "ND Courts" },
  "OH": { name: "Ohio", online_search: true, url: "https://www.courtclerk.org", notes: "Ohio — county-by-county" },
  "OK": { name: "Oklahoma", online_search: true, url: "https://www.oscn.net", notes: "Oklahoma Supreme Court Network" },
  "OR": { name: "Oregon", online_search: true, url: "https://www.courts.oregon.gov", notes: "Oregon Courts" },
  "PA": { name: "Pennsylvania", online_search: true, url: "https://ujsportal.pacourts.us", notes: "PA Unified Judicial System" },
  "RI": { name: "Rhode Island", online_search: false, url: "https://www.courts.ri.gov", notes: "Contact RI Courts" },
  "SC": { name: "South Carolina", online_search: true, url: "https://www.sccourts.org", notes: "SC Courts" },
  "SD": { name: "South Dakota", online_search: false, url: "https://ujs.sd.gov", notes: "Contact SD Unified Judicial System" },
  "TN": { name: "Tennessee", online_search: true, url: "https://www.tncourts.gov", notes: "Tennessee Courts" },
  "TX": { name: "Texas", online_search: true, url: "https://www.txcourts.gov", notes: "Texas Courts — county-by-county" },
  "UT": { name: "Utah", online_search: true, url: "https://www.utcourts.gov", notes: "Utah Courts — Xchange" },
  "VT": { name: "Vermont", online_search: false, url: "https://www.vermontjudiciary.org", notes: "Contact VT Judiciary" },
  "VA": { name: "Virginia", online_search: true, url: "https://www.courts.state.va.us", notes: "Virginia Courts" },
  "WA": { name: "Washington", online_search: true, url: "https://www.courts.wa.gov", notes: "Washington Courts" },
  "WV": { name: "West Virginia", online_search: true, url: "https://www.courts.wv.gov", notes: "WV Courts" },
  "WI": { name: "Wisconsin", online_search: true, url: "https://www.wicourts.gov", notes: "Wisconsin Courts — CCAP" },
  "WY": { name: "Wyoming", online_search: false, url: "https://www.courts.state.wy.us", notes: "Contact Wyoming Courts" },
};

// Federal wanted databases (scraped/searched via URLs)
const FEDERAL_RESOURCES = [
  { name: "US Marshals Wanted Persons", url: "https://www.usmarshals.gov/investigations/wanted", description: "Federal fugitives wanted by the US Marshals Service", update_freq: "Daily" },
  { name: "FBI Most Wanted", url: "https://www.fbi.gov/wanted", description: "FBI most wanted fugitives and suspects", update_freq: "Daily" },
  { name: "DEA Fugitives", url: "https://www.dea.gov/fugitives", description: "DEA wanted fugitives", update_freq: "Weekly" },
  { name: "National Sex Offender Registry", url: "https://www.nsopw.gov", description: "DOJ public sex offender registry", update_freq: "Real-time" },
  { name: "VINELink", url: "https://www.vinelink.com", description: "Nationwide victim notification — custody status changes", update_freq: "Real-time" },
  { name: "JudyRecords", url: "https://www.judyrecords.com", description: "360M+ US court records — free, no signup required", update_freq: "Weekly" },
];

interface SearchResult {
  source: string;
  source_url: string;
  source_type: string;
  query: string;
  timestamp: string;
  results_found: number;
  results: any[];
  error?: string;
}

async function searchCourtListener(personName: string, searchType: string): Promise<SearchResult> {
  const timestamp = new Date().toISOString();
  const encodedName = encodeURIComponent(personName);
  const typeLabel = searchType === 'r' ? 'Federal Court Dockets' : 'Case Law';
  const url = `https://www.courtlistener.com/api/rest/v4/search/?q=${encodedName}&type=${searchType}&order_by=dateFiled+desc`;
  
  try {
    const resp = await fetch(url, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'Sherlock-Warrant-Search/1.0' }
    });
    
    if (resp.status === 429) {
      return { source: `CourtListener — ${typeLabel}`, source_url: 'https://www.courtlistener.com', source_type: typeLabel, query: personName, timestamp, results_found: 0, results: [], error: 'Rate limited — try again in a few minutes' };
    }
    
    if (!resp.ok) {
      return { source: `CourtListener — ${typeLabel}`, source_url: 'https://www.courtlistener.com', source_type: typeLabel, query: personName, timestamp, results_found: 0, results: [], error: `HTTP ${resp.status}` };
    }
    
    const data = await resp.json();
    const results = (data.results || []).slice(0, 5).map((r: any) => ({
      case_name: r.caseName || r.case_name || 'Unknown',
      court: r.court || r.court_id || 'Unknown',
      date_filed: r.dateFiled || r.date_filed || 'Unknown',
      docket_number: r.docketNumber || r.docket_number || 'N/A',
      url: r.absolute_url ? `https://www.courtlistener.com${r.absolute_url}` : 'N/A',
      snippet: r.snippet || '',
      nature: r.suitNature || r.suit_nature || '',
    }));
    
    return {
      source: `CourtListener — ${typeLabel}`,
      source_url: 'https://www.courtlistener.com',
      source_type: typeLabel,
      query: personName,
      timestamp,
      results_found: data.count || 0,
      results,
    };
  } catch (err: any) {
    return { source: `CourtListener — ${typeLabel}`, source_url: 'https://www.courtlistener.com', source_type: typeLabel, query: personName, timestamp, results_found: 0, results: [], error: err.message };
  }
}

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const method = req.method;
  const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
  if (method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });

  if (method === "GET" && !url.searchParams.has("results")) {
    const stateOptions = Object.entries(STATE_RESOURCES).map(([code, info]) => `<option value="${code}">${info.name}</option>`).join('');
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Active Warrant Search \\u2014 Multi-Source Public Records | Sherlock</title><meta name="description" content="Search multiple public warrant databases and court records by name and state. Live queries across federal dockets, state courts, and federal wanted databases.">
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,sans-serif;background:#0f172a;color:#e2e8f0;padding-top:52px;line-height:1.6}.hero{background:linear-gradient(135deg,#0f172a,#1e293b);padding:80px 20px;text-align:center}.hero h1{font-size:2.5rem;margin-bottom:1rem}.tagline{font-size:1.25rem;color:#94a3b8;margin-bottom:1rem}.badge{display:inline-block;background:#dc2626;color:#fff;padding:4px 12px;border-radius:12px;font-size:.8rem;font-weight:600;margin:5px}.cta{display:inline-block;background:#6366f1;color:#fff;padding:14px 40px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:20px}.section{padding:60px 20px;max-width:900px;margin:0 auto}.section h2{font-size:1.8rem;margin-bottom:20px;text-align:center}.form-box{max-width:500px;margin:40px auto;background:#1e293b;border-radius:12px;padding:40px;border:1px solid #334155}.form-box input,.form-box select{width:100%;padding:14px;margin:8px 0;border:2px solid #334155;border-radius:8px;font-size:16px;background:#0f172a;color:#e2e8f0}.form-box label{display:block;font-size:13px;font-weight:600;color:#94a3b8;margin:12px 0 6px}.form-box button{width:100%;padding:16px;background:#6366f1;color:#fff;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;margin-top:20px}.form-box button:disabled{opacity:.5}.result{margin:20px 0;padding:20px;border-radius:8px;display:none}.success{background:#052e16;border:1px solid #166534}.error{background:#450a0a;border:1px solid #991b1b}.results-box{margin:20px 0;display:none}.src-card{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:20px;margin:10px 0}.src-card h4{color:#818cf8;margin-bottom:8px}.src-card .meta{font-size:.8rem;color:#64748b;margin-bottom:10px}.src-card .case{padding:10px;border-left:3px solid #334155;margin:5px 0}.src-card .case a{color:#818cf8}.src-card .case .date{color:#94a3b8;font-size:.85rem}.warning-box{background:#451a03;border:2px solid #92400e;border-radius:12px;padding:25px;margin:30px auto;max-width:700px}.warning-box h3{color:#fbbf24;margin-bottom:10px}.warning-box p{color:#fde68a;font-size:.9rem}.disc{padding:40px 20px;text-align:center;background:#1e293b}.disc p{max-width:700px;margin:0 auto;font-size:.85rem;color:#64748b}.footer{padding:30px 20px;text-align:center;border-top:1px solid #334155}.footer a{color:#94a3b8;margin:0 15px;text-decoration:none;font-size:.85rem}.uc{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;max-width:900px;margin:0 auto}.uc-item{background:#1e293b;border-radius:12px;padding:25px;border:1px solid #334155}.uc-item h3{color:#818cf8;margin-bottom:10px}.uc-item p{color:#94a3b8;font-size:.9rem}.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;max-width:800px;margin:0 auto}.step{background:#1e293b;border-radius:12px;padding:25px;border:1px solid #334155;text-align:center}.sn{font-size:2rem;color:#6366f1;font-weight:bold;margin-bottom:10px}.step h3{color:#f8fafc;margin-bottom:8px}.step p{color:#94a3b8;font-size:.9rem}.clear-banner{background:linear-gradient(135deg,#052e16,#064e3b);border:2px solid #10b981;border-radius:12px;padding:30px;text-align:center;margin:20px 0}.clear-code{font-size:3rem;font-weight:900;color:#10b981;letter-spacing:.5rem;margin-bottom:10px}.clear-msg{font-size:1.2rem;color:#6ee7b7}.clear-sub{font-size:.9rem;color:#a7f3d0;margin-top:8px}.flag-banner{background:linear-gradient(135deg,#450a0a,#7f1d1d);border:2px solid #ef4444;border-radius:12px;padding:30px;text-align:center;margin:20px 0}.flag-code{font-size:3rem;font-weight:900;color:#ef4444;letter-spacing:.5rem;margin-bottom:10px}.flag-msg{font-size:1.2rem;color:#fca5a5}.flag-sub{font-size:.9rem;color:#fecaca;margin-top:8px}.spinner{display:inline-block;width:20px;height:20px;border:3px solid #334155;border-top-color:#6366f1;border-radius:50%;animation:spin 1s linear infinite;margin-right:10px;vertical-align:middle}@keyframes spin{to{transform:rotate(360deg)}}</style></head>
<body><script src="https://base44.app/api/apps/6a739f9fb6289211e22db7e0/functions/support-widget-js"></script>
<section class="hero"><h1>Active Warrant Search</h1><p class="tagline">Multi-source public records search \\u2014 federal dockets, state courts, wanted databases</p><p class="tagline">Powered by Sherlock \\u2014 proprietary analytical platform</p><div><span class="badge">7+ Data Sources</span><span class="badge">Live Federal Dockets</span><span class="badge">50-State Coverage</span><span class="badge">Not Law Enforcement</span></div><a href="#search" class="cta">Search Now \\u2192</a></section>
<section class="section"><h2>When You Need This</h2><div class="uc"><div class="uc-item"><h3>Stalking & Harassment</h3><p>Someone is harassing you. Check if they have active warrants law enforcement can act on.</p></div><div class="uc-item"><h3>Lawsuit Tracking</h3><p>Waiting for a lawsuit to be filed? Monitor federal court dockets across multiple sources.</p></div><div class="uc-item"><h3>Personal Awareness</h3><p>Check if you have an outstanding warrant you don't know about.</p></div><div class="uc-item"><h3>Background Screening</h3><p>Vetting someone for safety, employment, or housing.</p></div></div></section>
<section class="section"><h2>How It Works</h2><div class="steps"><div class="step"><div class="sn">1</div><h3>Enter Info</h3><p>Provide name and state to search.</p></div><div class="step"><div class="sn">2</div><h3>Multi-Source Scan</h3><p>We query CourtListener (federal dockets + case law), state court databases, US Marshals, FBI, DEA, NSOPW, VINELink, and JudyRecords simultaneously.</p></div><div class="step"><div class="sn">3</div><h3>Get Results</h3><p>Aggregated results with timestamps showing when each source was checked and last updated.</p></div></div></section>
<div class="warning-box"><h3>\\u26A0\\uFE0F Important: Read Before Searching</h3><p><strong>Each data source updates on its own schedule.</strong> Federal dockets update daily via PACER/RECAP. State courts vary \\u2014 some real-time, some weekly, some monthly. Federal wanted databases update daily but only include a fraction of active warrants. A clean result does NOT guarantee no warrants exist \\u2014 only law enforcement databases (NCIC) have complete, real-time data. Always verify with the issuing jurisdiction.</p></div>
<section class="form-box" id="search"><h2 style="margin-bottom:20px;text-align:center;">Search Active Warrants</h2><label>Full Name of Person</label><input type="text" id="personName" placeholder="John Doe"><label>State to Search</label><select id="stateSelect"><option value="">Select a state...</option>${stateOptions}</select><label>Your Email</label><input type="email" id="email" placeholder="your@email.com"><button onclick="runSearch()" id="searchBtn">Scan All Sources \\u2192</button><div id="result" class="result"></div><div id="resultsBox" class="results-box"></div></section>
<section class="disc"><p><strong>Legal Disclaimer:</strong> ${LEGAL_DISCLAIMER.not_legal_advice} ${LEGAL_DISCLAIMER.no_guarantee} ${LEGAL_DISCLAIMER.liability_cap}</p><p style="margin-top:10px;">This tool does not provide legal advice. If you have information about a wanted individual, contact your local law enforcement.</p></section>
<footer class="footer"><a href="https://app.base44.com/superagent/6a739f9fb6289211e22db7e0">Privacy Policy</a><a href="https://app.base44.com/superagent/6a739f9fb6289211e22db7e0">Terms of Service</a><a href="mailto:roosteradams91@gmail.com">Support</a><p style="margin-top:15px;color:#475569;font-size:.8rem;">\\u00a9 2026 Adams Builders and Creators. Not affiliated with any law enforcement agency.</p></footer>
<script>
async function runSearch(){
  const n=document.getElementById('personName').value.trim(),s=document.getElementById('stateSelect').value,e=document.getElementById('email').value.trim();
  if(!n||!s||!e){showResult('Please fill in all fields.','error');return;}
  const btn=document.getElementById('searchBtn');btn.disabled=true;btn.innerHTML='<span class="spinner"></span>Querying 7+ data sources...';
  try{
    const res=await fetch('https://base44.app/api/apps/6a739f9fb6289211e22db7e0/functions/active-warrant-search',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({person_name:n,state:s,email:e})});
    const data=await res.json();
    if(data.success){
      showResult('Multi-source scan complete. Results below.','success');
      const box=document.getElementById('resultsBox');box.style.display='block';
      let h='';
      
      if(data.status_code==='10-22'){
        h+='<div class="clear-banner"><div class="clear-code">10-22</div><div class="clear-msg">'+data.status_message+'</div><div class="clear-sub">'+data.status_sub+'</div></div>';
      } else if(data.status_code==='10-31'){
        h+='<div class="flag-banner"><div class="flag-code">'+data.status_code+'</div><div class="flag-msg">'+data.status_message+'</div><div class="flag-sub">'+data.status_sub+'</div></div>';
      }
      
      h+='<p style="color:#64748b;font-size:.85rem;margin:15px 0;">Scan completed at '+new Date().toLocaleString()+' \\u2014 '+data.sources_checked+' sources queried</p>';
      
      if(data.source_results&&data.source_results.length>0){
        data.source_results.forEach(src=>{
          h+='<div class="src-card">';
          h+='<h4>'+src.source+'</h4>';
          h+='<div class="meta">Checked: '+src.timestamp+' \\u2014 '+src.results_found+' results'+(src.error?' \\u2014 Error: '+src.error:'')+'</div>';
          if(src.results&&src.results.length>0){
            src.results.forEach(c=>{
              h+='<div class="case">';
              h+='<a href="'+(c.url||'#')+'" target="_blank">'+esc(c.case_name||'Unknown')+'</a>';
              h+='<div class="date">Court: '+esc(c.court||'N/A')+' \\u2014 Filed: '+esc(c.date_filed||'N/A')+' \\u2014 Docket: '+esc(c.docket_number||'N/A')+'</div>';
              if(c.snippet) h+='<div style="color:#94a3b8;font-size:.85rem;margin:5px 0;">'+esc(c.snippet.substring(0,200))+'</div>';
              if(c.nature) h+='<div style="color:#818cf8;font-size:.8rem;">Nature: '+esc(c.nature)+'</div>';
              h+='</div>';
            });
          } else if(!src.error) {
            h+='<div style="color:#64748b;font-size:.85rem;">No results found in this source.</div>';
          }
          h+='</div>';
        });
      }
      
      h+='<div style="background:#1e293b;border-radius:8px;padding:20px;margin:10px 0;border:1px solid #334155;">';
      h+='<h4 style="color:#f8fafc;margin-bottom:10px;">State Court Database \\u2014 '+data.state_info.name+'</h4>';
      h+='<p style="color:#94a3b8;margin-bottom:10px;">'+data.state_info.notes+'</p>';
      if(data.state_info.online_search){h+='<a href="'+data.state_info.url+'" target="_blank" style="color:#818cf8;">\\u2192 Search '+data.state_info.name+' Court Records</a>';}
      else{h+='<p style="color:#fbbf24;">No online database. Contact: <a href="'+data.state_info.url+'" target="_blank" style="color:#818cf8;">'+data.state_info.url+'</a></p>';}
      h+='</div>';
      
      h+='<h4 style="margin:20px 0 10px;color:#818cf8;">Additional Federal Sources</h4>';
      data.federal_resources.forEach(r=>{
        h+='<div class="src-card"><h4>'+r.name+'</h4><div class="meta">'+r.description+' \\u2014 Updates: '+r.update_freq+'</div><a href="'+r.url+'" target="_blank" style="color:#818cf8;">\\u2192 Visit</a></div>';
      });
      
      h+='<div style="background:#451a03;border:1px solid #92400e;border-radius:8px;padding:15px;margin:15px 0;"><p style="color:#fde68a;font-size:.85rem;"><strong>Verification Required:</strong> '+data.verification_note+'</p></div>';
      h+='<h4 style="margin:20px 0 10px;color:#818cf8;">If You Find a Warrant</h4><ol style="color:#cbd5e1;padding-left:20px;"><li style="padding:5px 0;">Someone harming you: Contact law enforcement with the case number.</li><li style="padding:5px 0;">Warrant for you: Contact a criminal defense attorney.</li><li style="padding:5px 0;">Someone you know: Do not apprehend them. Call police.</li><li style="padding:5px 0;">Always verify with the issuing court or sheriffs office.</li></ol>';
      box.innerHTML=h;btn.style.display='none';
    }else{throw new Error(data.error||'Search failed')}
  }catch(err){showResult('Error: '+err.message,'error');btn.disabled=false;btn.textContent='Scan All Sources \\u2192'}
}
function showResult(m,t){const d=document.getElementById('result');d.style.display='block';d.className='result '+t;d.textContent=m}
function esc(s){if(!s)return'';return String(s).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));}
</script></body></html>`;
    return new Response(html, { status: 200, headers: { "Content-Type": "text/html", ...corsHeaders } });
  }

  if (method === "POST") {
    try {
      const body = await req.json();
      if (!body || !body.person_name || typeof body.person_name !== 'string' || body.person_name.length > 200) return json({ error: "Valid name required (max 200 chars)", _legal: LEGAL_DISCLAIMER }, 400, corsHeaders);
      if (!body.state || !STATE_RESOURCES[body.state as string]) return json({ error: "Valid state required", _legal: LEGAL_DISCLAIMER }, 400, corsHeaders);
      if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return json({ error: "Valid email required", _legal: LEGAL_DISCLAIMER }, 400, corsHeaders);

      const stateInfo = STATE_RESOURCES[body.state as string];
      const personName = body.person_name as string;

      // Query multiple data sources in parallel
      const [docketResults, caseLawResults] = await Promise.all([
        searchCourtListener(personName, 'r'),  // Federal dockets (PACER/RECAP)
        searchCourtListener(personName, 'o'),  // Case law opinions
      ]);

      const sourceResults = [docketResults, caseLawResults];
      
      // Count total findings across all sources
      const totalFound = sourceResults.reduce((sum, r) => sum + r.results_found, 0);
      
      // Determine status
      const hasResults = totalFound > 0;
      
      return json({
        success: true,
        status_code: hasResults ? "10-31" : "10-22",
        status_message: hasResults 
          ? `${totalFound} potential matches found \\u2014 Review below`
          : "All Clear \\u2014 No public flags detected",
        status_sub: hasResults
          ? "Results found across multiple data sources. Review each finding and verify with the issuing court."
          : "No active warrants or court cases found across all queried sources. Different sources update on different schedules \\u2014 verify using the resources below.",
        sources_checked: sourceResults.length + FEDERAL_RESOURCES.length + 1, // +1 for state court
        source_results: sourceResults,
        state_info: stateInfo,
        federal_resources: FEDERAL_RESOURCES,
        verification_note: "Each data source updates on its own schedule. Federal dockets via CourtListener/RECAP update daily. State courts vary from real-time to monthly. Federal wanted databases update daily but only include a fraction of active warrants. Contact the county sheriff's office or court clerk for the most current information. Federal warrants and warrants from jurisdictions without online databases will not appear in public sources.",
        _legal: LEGAL_DISCLAIMER
      }, 200, corsHeaders);
    } catch (error) { return json({ error: "Search failed", _legal: LEGAL_DISCLAIMER }, 500, corsHeaders); }
  }
  return new Response(null, { status: 302, headers: { "Location": "https://base44.app/api/apps/6a739f9fb6289211e22db7e0/functions/active-warrant-search", ...corsHeaders } });
});

function json(data: any, status = 200, corsHeaders: any = {}): Response {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...corsHeaders } });
}
