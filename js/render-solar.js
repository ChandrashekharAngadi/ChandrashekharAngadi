//  SOLAR
// ═══════════════════════════════════════════════════════════
function rndrSolar(){
  const sol=calcSolarProg();
  document.getElementById('sol-kr').innerHTML=`
    <div class="kpi"><div class="kb" style="background:var(--sol)"></div><div class="kl">Solar Overall</div><div class="kv" style="color:var(--sol)">${sol}%</div></div>
    <div class="kpi"><div class="kb" style="background:var(--ok)"></div><div class="kl">ITC-1 Progress</div><div class="kv" style="color:var(--ok)">${calcITCProg('ITC-1')}%</div></div>
    <div class="kpi"><div class="kb" style="background:var(--wn)"></div><div class="kl">Piling Done</div><div class="kv" style="color:var(--wn)">99.5%</div></div>
    <div class="kpi"><div class="kb" style="background:var(--ac)"></div><div class="kl">MMS Erection</div><div class="kv" style="color:var(--ac)">51%</div></div>
    <div class="kpi"><div class="kb" style="background:var(--land)"></div><div class="kl">Manpower</div><div class="kv" style="color:var(--land)">14</div></div>
    <div class="kpi"><div class="kb" style="background:var(--er)"></div><div class="kl">Charge Ready</div><div class="kv" style="color:var(--er)">0 MWp</div></div>`;
  const g=document.getElementById('itc-cards');if(!g)return;
  g.innerHTML=Object.entries(DB.solar.itcs).map(([id,d])=>{
    const p=calcITCProg(id);const r=34,ci=2*Math.PI*r,off=ci*(1-p/100);
    const mwLabel=`${d.mw}MW`;
    return`<div class="itcc" onclick="openITC('${id}')">
      <div style="font-family:var(--f2);font-size:11px;font-weight:700;color:var(--sol);">☀️ ${id}</div>
      <div style="font-size:8px;color:var(--t3);margin-bottom:2px;">${mwLabel} | ${d.pct}% of project</div>
      <svg width="72" height="72" class="ring-svg" style="display:block;margin:3px auto;">
        <circle class="ring-bg" cx="36" cy="36" r="${r}"/>
        <circle class="ring-fg" cx="36" cy="36" r="${r}" stroke="${p>0?'var(--sol)':'var(--b3)'}" stroke-dasharray="${ci.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/>
        <text x="36" y="40" text-anchor="middle" fill="${p>0?'var(--sol)':'var(--t3)'}" style="font-family:var(--f2);font-size:12px;font-weight:700;" transform="rotate(90,36,36)">${p}%</text>
      </svg>
      <div class="chip ${p>=100?'cg':p>0?'cy':'cb'}" style="font-size:8px;">${p>=100?'✔ Done':p>0?'🟡 WIP':'⌛ Pending'}</div>
    </div>`;
  }).join('');
  const ids=Object.keys(DB.solar.itcs);const progs=ids.map(id=>calcITCProg(id));
  mkCWIP('ch-sol-det',ids,progs);
  const acts=DB.solar.itcs['ITC-1'].acts;
  mkC('ch-sol-rad',{type:'radar',data:{labels:acts.map(a=>a.n.length>14?a.n.substr(0,14)+'…':a.n),datasets:[{label:'ITC-1',data:acts.map(a=>a.done),backgroundColor:'rgba(255,170,0,.1)',borderColor:'rgba(255,170,0,.8)',pointBackgroundColor:'rgba(255,170,0,1)',pointRadius:3}]},options:{responsive:true,maintainAspectRatio:false,scales:{r:{min:0,max:100,ticks:{stepSize:25,font:{size:7}},pointLabels:{font:{size:8}}}},plugins:{legend:{position:'top'}}}});
}
function openITC(id){curITC=id;nav('itc',{itc:id});}
function rndrITC(id){
  curITC=id;const d=DB.solar.itcs[id];const p=calcITCProg(id);
  const el=document.getElementById('itc-det');if(!el)return;
  const mapImg=ITC_MAPS[id];
  el.innerHTML=`
    <div class="ph"><div class="pht" style="color:var(--sol)">☀️ ${id} – Activity Dashboard</div>
    <div class="phs">${d.mw}MW | ${d.pct}% of total project | ITC Progress: ${p}% | 17 activities = 100%</div></div>
    <div class="kr">${d.acts.slice(0,6).map(a=>`<div class="kpi" style="padding:9px;"><div class="kb" style="background:${a.col}"></div><div class="kl">${a.n.substr(0,18)}</div><div class="kv" style="font-size:17px;color:${a.col}">${a.done}%</div><div class="km">W:${a.w}%</div></div>`).join('')}</div>

    <!-- ITC DETAIL LAYOUT: LEFT charts + RIGHT map -->
    <div class="itc-det-layout">
      <!-- LEFT: Activity charts -->
      <div>
        <div class="pnl" style="margin-bottom:9px;"><div class="ph2"><div class="pt">📊 Activity Progress Bar</div></div><div class="ch h200"><canvas id="ch-itc-b"></canvas></div></div>
        <div class="pnl"><div class="ph2"><div class="pt">🕸️ Activity Radar</div></div><div class="ch h200"><canvas id="ch-itc-r"></canvas></div></div>
      </div>
      <!-- RIGHT: ITC MAP (main feature per spec) -->
      <div>
        <div class="pnl">
          <div class="ph2">
            <div class="pt">🗺️ ${id} Layout Map</div>
            <button class="btn btsol bts" onclick="triggerMapUpload('${id}')">📸 Upload / Update ITC Map</button>
          </div>
          <div class="itc-map-box" id="itc-map-box-${id}">
            ${mapImg
              ? `<img src="${mapImg}" class="itc-map-img" id="itc-map-img-${id}" alt="${id} Map"/>`
              : `<div class="itc-map-placeholder"><div class="icon">🗺️</div><div class="txt">No map uploaded yet</div><div style="font-size:9px;margin-top:4px;color:var(--t3);">Click "Upload / Update ITC Map" to add the layout image</div></div>`
            }
            <button class="map-upload-btn" onclick="triggerMapUpload('${id}')">📸 Upload / Update Map</button>
          </div>
          <input type="file" id="itc-map-file-${id}" accept="image/*" style="display:none;" onchange="handleMapUpload('${id}',this)">
          <div style="font-size:8px;color:var(--t3);margin-top:6px;">Accepted: JPG, PNG, PDF images | Updates instantly | Stored in session</div>
        </div>
      </div>
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
      <div style="font-family:var(--f2);font-size:12px;font-weight:600;">🔧 All 17 Activities — Click for detail</div>
      <div style="display:flex;gap:6px;">
        <button class="btn btsol bts" onclick="reqLogin('solar',()=>openSolProg('${id}'))">📊 Update Progress</button>
      </div>
    </div>
    <div class="actg" id="actg-${id}"></div>
    <div id="actdet-${id}"></div>`;
  setTimeout(()=>{
    const acts=d.acts;
    const names=acts.map(a=>a.n.length>14?a.n.substr(0,14)+'…':a.n);const pcts=acts.map(a=>a.done);
    mkC('ch-itc-b',{type:'bar',data:{labels:names,datasets:[{label:'% Done',data:pcts,backgroundColor:acts.map(a=>a.col+'cc'),borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:0,max:100,ticks:{callback:v=>v+'%'}}}}});
    mkC('ch-itc-r',{type:'radar',data:{labels:names,datasets:[{label:id,data:pcts,backgroundColor:'rgba(255,170,0,.1)',borderColor:'rgba(255,170,0,.8)',pointBackgroundColor:'rgba(255,170,0,1)',pointRadius:3}]},options:{responsive:true,maintainAspectRatio:false,scales:{r:{min:0,max:100,ticks:{stepSize:25,font:{size:7}},pointLabels:{font:{size:8}}}},plugins:{legend:{position:'top'}}}});
    const g2=document.getElementById('actg-'+id);if(!g2)return;
    g2.innerHTML=acts.map((a,i)=>{const bal=100-a.done;return`<div class="actc" onclick="showActDet('${id}',${i})">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:5px;"><div class="actc-nm">${a.n}</div><div class="actc-pct" style="color:${a.col}">${a.done}%</div></div>
      <div class="actc-bar"><div class="actc-fill" style="width:${a.done}%;background:${a.col}"></div></div>
      <div class="mst"><div class="ms">W:<b>${a.w}%</b></div><div class="ms">Done:<b style="color:var(--ok)">${a.done}%</b></div><div class="ms">Bal:<b style="color:var(--er)">${bal}%</b></div></div>
      ${a.today>0?`<div style="font-size:8px;color:var(--ok);margin-top:2px;">Today: +${a.today}%</div>`:''}
      <div class="actc-hint">Click for detail →</div>
    </div>`;}).join('');
  },80);
}

// ── ITC MAP UPLOAD FUNCTIONS ────────────────────────────────
function triggerMapUpload(itcId){
  const input=document.getElementById('itc-map-file-'+itcId);
  if(input)input.click();
}
function handleMapUpload(itcId,input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=function(e){
    ITC_MAPS[itcId]=e.target.result;
    // Update the map box immediately without re-rendering the full ITC detail
    const box=document.getElementById('itc-map-box-'+itcId);
    if(box){
      box.innerHTML=`
        <img src="${e.target.result}" class="itc-map-img" id="itc-map-img-${itcId}" alt="${itcId} Map"/>
        <button class="map-upload-btn" onclick="triggerMapUpload('${itcId}')">📸 Upload / Update Map</button>`;
    }
    // Show success toast
    showToast(`✅ ${itcId} map updated successfully!`,'ok');
  };
  reader.readAsDataURL(file);
  input.value=''; // reset so same file can be re-uploaded
}
function showToast(msg,type){
  let t=document.getElementById('toast-el');
  if(!t){t=document.createElement('div');t.id='toast-el';t.style.cssText='position:fixed;bottom:24px;right:24px;padding:10px 18px;border-radius:8px;font-size:11px;font-weight:600;z-index:9999;transition:all .3s;';document.body.appendChild(t);}
  const c={ok:'rgba(0,230,118,.9)',er:'rgba(255,82,82,.9)',wn:'rgba(255,202,40,.9)'};
  t.style.background=c[type]||c.ok;t.style.color=type==='ok'?'#071020':'#fff';
  t.textContent=msg;t.style.opacity='1';
  setTimeout(()=>t.style.opacity='0',2800);
}
function showActDet(id,idx){
  const a=DB.solar.itcs[id]?.acts[idx];if(!a)return;
  const bal=100-a.done;const el=document.getElementById('actdet-'+id);if(!el)return;
  const cid='ch-ad-'+id+'_'+idx;
  el.innerHTML=`<div class="det">
    <div style="display:flex;justify-content:space-between;margin-bottom:9px;">
      <div><div style="font-family:var(--f2);font-size:15px;font-weight:700;color:${a.col}">${a.n}</div><div style="font-size:8px;color:var(--t3);">${id} | Weight: ${a.w}%</div></div>
      <button onclick="document.getElementById('actdet-${id}').innerHTML=''" style="background:none;border:1px solid var(--b1);color:var(--t3);width:22px;height:22px;border-radius:5px;cursor:pointer;font-size:10px;">✕</button>
    </div>
    <div class="g4" style="margin-bottom:9px;">
      <div class="kpi" style="padding:8px;"><div class="kl">Done</div><div class="kv" style="font-size:16px;color:var(--ok)">${a.done}%</div></div>
      <div class="kpi" style="padding:8px;"><div class="kl">Remaining</div><div class="kv" style="font-size:16px;color:var(--er)">${bal}%</div></div>
      <div class="kpi" style="padding:8px;"><div class="kl">Weight</div><div class="kv" style="font-size:16px;color:${a.col}">${a.w}%</div></div>
      <div class="kpi" style="padding:8px;"><div class="kl">Status</div><div class="kv" style="font-size:14px;">${a.done>=100?'<span class="chip cg">✔ Done</span>':a.done>0?'<span class="chip cy">🟡 WIP</span>':'<span class="chip cr">🔴 Pending</span>'}</div></div>
    </div>
    <div style="height:8px;background:var(--b1);border-radius:4px;margin-bottom:9px;overflow:hidden;"><div style="width:${a.done}%;height:100%;background:${a.col};border-radius:4px;transition:width 1s ease;"></div></div>
    <div class="g2"><div class="ch h180"><canvas id="${cid}"></canvas></div>
    <div><div class="ir"><div class="irl">Activity</div><div class="irr">${a.n}</div></div><div class="ir"><div class="irl">Completed</div><div class="irr" style="color:var(--ok)">${a.done}%</div></div><div class="ir"><div class="irl">Remaining</div><div class="irr" style="color:var(--er)">${bal}%</div></div><div class="ir"><div class="irl">Today</div><div class="irr" style="color:var(--ac3)">${a.today||0}%</div></div><div class="ir"><div class="irl">Weight in ITC</div><div class="irr" style="color:${a.col}">${a.w}%</div></div></div></div>
  </div>`;
  setTimeout(()=>mkC(cid,{type:'doughnut',data:{labels:['Done','Remaining'],datasets:[{data:[a.done,bal],backgroundColor:[a.col,'rgba(26,46,74,.65)'],borderWidth:0,cutout:'70%'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:9}}}}}}),45);
  el.scrollIntoView({behavior:'smooth',block:'nearest'});
}

// ═══════════════════════════════════════════════════════════