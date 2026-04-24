//  WTG
// ═══════════════════════════════════════════════════════════
function rndrWtg(){
  const wtg=calcWtgProg();const ready=DB.wtg.turbines.filter(t=>t.status==='ready').length;
  const lp=DB.wtg.turbines.filter(t=>t.lp).length;const pp=DB.wtg.turbines.filter(t=>t.pp).length;
  document.getElementById('wtg-kr').innerHTML=`
    <div class="kpi"><div class="kb" style="background:var(--wtg)"></div><div class="kl">WTG Overall</div><div class="kv" style="color:var(--wtg)">${wtg}%</div></div>
    <div class="kpi"><div class="kb" style="background:var(--ok)"></div><div class="kl">Ready Erection</div><div class="kv" style="color:var(--ok)">${ready}/26</div></div>
    <div class="kpi"><div class="kb" style="background:var(--ac)"></div><div class="kl">Foundation Cast</div><div class="kv" style="color:var(--ac)">${DB.wtg.turbines.filter(t=>['casting','ready'].includes(t.status)).length}/26</div></div>
    <div class="kpi"><div class="kb" style="background:var(--sol)"></div><div class="kl">Logistic Path</div><div class="kv" style="color:var(--sol)">${lp}/26</div></div>
    <div class="kpi"><div class="kb" style="background:var(--land)"></div><div class="kl">Permanent Path</div><div class="kv" style="color:var(--land)">${pp}/26</div></div>
    <div class="kpi"><div class="kb" style="background:var(--er)"></div><div class="kl">Erection Done</div><div class="kv" style="color:var(--er)">0/26</div></div>`;

  const tcEl=document.getElementById('wtg-tc');if(!tcEl)return;
  // Split layout: LEFT = turbine grid, RIGHT = detail + tab content
  tcEl.innerHTML=`<div class="wtg-split">
    <div class="wtg-left-panel">
      <div style="font-family:var(--f2);font-size:11px;font-weight:600;margin-bottom:8px;color:var(--wtg);">🌬️ All 26 Turbines — Click to select</div>
      <div class="turbg" id="wtg-turb-grid">${rndrTurbGrid()}</div>
    </div>
    <div class="wtg-right-panel" id="wtg-right-panel" style="overflow-y:auto;max-height:580px;">
      <div style="text-align:center;color:var(--t3);padding:30px 20px;">
        <div style="font-size:28px;margin-bottom:8px;">${_turbImg(32,'')}</div>
        <div style="font-size:11px;">Select a turbine from the left panel to view detail</div>
        <div style="font-size:9px;color:var(--t4);margin-top:6px;">Or use the tabs above to view section reports</div>
      </div>
    </div>
  </div>
  <div class="g2" style="margin-top:12px;">
    <div class="pnl"><div class="ph2"><div class="pt">📊 WTG Foundation — All 26 Turbines</div></div><div class="ch h240"><canvas id="ch-wtg-all"></canvas></div></div>
    <div class="pnl"><div class="ph2"><div class="pt">📊 Civil vs Mechanical Progress</div></div><div class="ch h240"><canvas id="ch-wtg-phases"></canvas></div></div>
  </div>`;
  setTimeout(()=>{
    const turbs=DB.wtg.turbines,tP=turbs.map(t=>calcTurbProg(t));
    mkCWIP('ch-wtg-all',turbs.map(t=>t.id),tP);
    const civPcts=DB.wtg.civil.map((_,i)=>R(DB.wtg.turbines.reduce((s,t)=>s+t.civil[i],0)/26));
    const mechPcts=DB.wtg.mech.map((_,i)=>R(DB.wtg.turbines.reduce((s,t)=>s+t.mech[i],0)/26));
    mkC('ch-wtg-phases',{type:'bar',data:{labels:[...DB.wtg.civil.map(a=>a.n),...DB.wtg.mech.map(a=>a.n)],datasets:[{label:'Avg %',data:[...civPcts,...mechPcts],backgroundColor:[...DB.wtg.civil.map(a=>a.col+'cc'),...DB.wtg.mech.map(a=>a.col+'cc')],borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:0,max:100,ticks:{callback:v=>v+'%'}}}}});
  },80);
}

// Helper: returns turbine image html (turbine.png if available, else styled icon)
function _turbImg(size,color){
  // Check once if turbine.png exists (cached on window)
  return `<img src="turbine.png" style="width:${size}px;height:${size}px;vertical-align:middle;filter:${color?'drop-shadow(0 0 4px '+color+')':'none'};" onerror="this.outerHTML='<span style=\\'font-size:${Math.round(size*0.65)}px\\'>⚡</span>'">`; 
}

function rndrTurbGrid(){
  const cm={ready:'var(--ok)',casting:'var(--ac)',wip:'var(--wn)',row:'var(--er)',pending:'var(--t4)',delayed:'var(--bop)'};
  return DB.wtg.turbines.map(t=>{
    const p=calcTurbProg(t);const sc=cm[t.status]||'var(--t4)';
    return`<div class="turb st-${t.status}" onclick="selectTurbine('${t.id}')" id="tcard-${t.id}" style="position:relative;">
      <div style="margin-bottom:2px;">${_turbImg(24,sc)}</div>
      <div style="font-size:9px;font-weight:700;color:${sc};margin:1px 0;">${t.id}</div>
      <div style="font-size:7px;color:var(--t3);">${t.status.toUpperCase()}</div>
      <div style="font-family:var(--f2);font-size:12px;font-weight:700;color:${sc};">${p}%</div>
      ${t.status==='wip'||t.status==='casting'?'<div style="width:6px;height:6px;background:var(--wn);border-radius:50%;margin:2px auto;animation:pu 1.5s infinite;"></div>':''}
    </div>`;
  }).join('');
}

function selectTurbine(id){
  document.querySelectorAll('.turb').forEach(el=>el.style.outline='none');
  const card=document.getElementById('tcard-'+id);
  if(card)card.style.outline='2px solid var(--wtg)';
  const t=DB.wtg.turbines.find(x=>x.id===id);if(!t)return;
  const p=calcTurbProg(t);
  const rp=document.getElementById('wtg-right-panel');if(!rp)return;
  const sc={ready:'var(--ok)',casting:'var(--ac)',wip:'var(--wn)',row:'var(--er)',pending:'var(--t4)'}[t.status]||'var(--t4)';
  // Reset tab highlight to Overview when turbine is selected
  document.querySelectorAll('#view-wtg .tab').forEach((x,i)=>x.classList.toggle('on',i===0));
  rp.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;flex-wrap:wrap;gap:6px;">
      <div style="display:flex;align-items:center;gap:8px;">
        ${_turbImg(36,sc)}
        <div>
          <div style="font-family:var(--f2);font-size:18px;font-weight:700;color:${sc}">${t.id}</div>
          <div style="font-size:9px;color:var(--t3);">LP: ${t.lp?'✅ Done':'⏳ Pending'} | PP: ${t.pp?'✅ Done':'⏳ Pending'}</div>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-family:var(--f2);font-size:26px;font-weight:700;color:${sc}">${p}%</div>
        <span class="chip ${t.status==='ready'?'cg':t.status==='wip'?'cy':'cr'}">${t.status.toUpperCase()}</span>
      </div>
    </div>
    <div style="height:7px;background:var(--b1);border-radius:4px;margin-bottom:12px;overflow:hidden;">
      <div style="width:${p}%;height:100%;background:${sc};border-radius:4px;transition:width 1s ease;"></div>
    </div>
    <div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Civil Activities (30%)</div>
    ${DB.wtg.civil.map((a,i)=>`<div class="pr"><div class="prl" style="min-width:130px;">${a.n} (W:${a.w}%)</div><div class="prt"><div class="prf" style="width:${t.civil[i]}%;background:${t.civil[i]>=100?'var(--ok)':t.civil[i]>0?'var(--wn)':'var(--b3)'}"></div></div><div class="prp" style="color:${t.civil[i]>=100?'var(--ok)':t.civil[i]>0?'var(--wn)':'var(--er)'};">${t.civil[i]}%</div></div>`).join('')}
    <div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:1px;margin:8px 0 6px;">Mechanical Activities (50%)</div>
    ${DB.wtg.mech.map((a,i)=>`<div class="pr"><div class="prl" style="min-width:130px;">${a.n} (W:${a.w}%)</div><div class="prt"><div class="prf" style="width:${t.mech[i]}%;background:${t.mech[i]>=100?'var(--ok)':t.mech[i]>0?'var(--wn)':'var(--b3)'}"></div></div><div class="prp" style="color:${t.mech[i]>=100?'var(--ok)':t.mech[i]>0?'var(--wn)':'var(--er)'};">${t.mech[i]}%</div></div>`).join('')}
    <div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:1px;margin:8px 0 6px;">USS (10%) & Supply (10%)</div>
    <div class="pr"><div class="prl" style="min-width:130px;">USS Works</div><div class="prt"><div class="prf" style="width:${t.uss}%;background:var(--ok)"></div></div><div class="prp">${t.uss}%</div></div>
    <div class="pr"><div class="prl" style="min-width:130px;">Supply Complete</div><div class="prt"><div class="prf" style="width:${t.sup}%;background:var(--ac)"></div></div><div class="prp">${t.sup}%</div></div>
    <div class="sep"></div>
    <div style="font-size:9px;color:var(--t3);margin-bottom:10px;">📝 ${t.notes}</div>
    <button class="btn btwt" onclick="reqLogin('wtg',()=>openWtgProgFor('${id}'))">📊 Enter Today's Progress</button>`;
}

function wTab(t){
  curWT=t;
  document.querySelectorAll('#view-wtg .tab').forEach((x,i)=>x.classList.toggle('on',i===t));
  // All tab content goes into the RIGHT panel (not below)
  const rp=document.getElementById('wtg-right-panel');if(!rp)return;
  if(t===0){
    // Overview tab: show placeholder if no turbine selected
    if(!rp.querySelector('.btn.btwt')){
      rp.innerHTML=`<div style="text-align:center;color:var(--t3);padding:30px 20px;"><div style="font-size:28px;margin-bottom:8px;">${_turbImg(32,'')}</div><div style="font-size:11px;">Select a turbine from the left panel to view detail</div></div>`;
    }
    return;
  }
  let html='';
  if(t===1)html=rndrCivilTab();
  else if(t===2)html=rndrMechTab();
  else if(t===3)html=rndrPathTab();
  else if(t===4)html=rndrSupTab();
  else if(t===5)html=rndrSchedTab();
  rp.innerHTML=`<div style="padding:2px;">${html}</div>`;
  // Remove outline from turbine cards since we switched to a section view
  document.querySelectorAll('.turb').forEach(el=>el.style.outline='none');
}
function rndrTurbs(){
  const sm={ready:['st-rdy','🟢'],casting:['st-wip','🔵'],wip:['st-wip','🟡'],row:['st-row','🔴'],pending:['st-pnd','⬜'],delayed:['st-del','🟠']};
  return`<div class="pnl"><div class="ph2"><div class="pt">🏭 All 26 Turbines — Click for detail</div></div>
    <div class="turbg">${DB.wtg.turbines.map(t=>{const[cls,ic]=sm[t.status]||['st-pnd','⬜'];const p=calcTurbProg(t);
      return`<div class="turb ${cls}" onclick="showTurb('${t.id}')">
        <div style="font-size:18px;margin-bottom:2px;">🌬️</div>
        <div style="font-family:var(--f2);font-size:10px;font-weight:700;">${t.id}</div>
        <div style="font-size:8px;margin-top:1px;">${ic} ${p}%</div>
        <div style="font-size:7px;color:var(--t3);">${t.status.toUpperCase()}</div>
      </div>`;}).join('')}</div></div>`;
}
function rndrCivilTab(){
  return`<div class="pnl"><div class="ph2"><div class="pt">🏗️ Civil Activities (30% weight each turbine)</div></div>
    <div class="tsc"><table class="tbl"><thead><tr><th>ID</th>${DB.wtg.civil.map(a=>`<th>${a.n}</th>`).join('')}<th>Civil%</th></tr></thead>
    <tbody>${DB.wtg.turbines.map(t=>`<tr><td><b>${t.id}</b></td>${t.civil.map((v,i)=>`<td><span class="chip ${v>=100?'cg':v>0?'cy':'cr'}">${v}%</span></td>`).join('')}<td><b>${R(DB.wtg.civil.reduce((s,a,i)=>s+(t.civil[i]||0)/100*a.w,0))}%</b></td></tr>`).join('')}</tbody></table></div></div>`;
}
function rndrMechTab(){
  return`<div class="pnl"><div class="ph2"><div class="pt">🔩 Mechanical Activities (50% weight each turbine)</div></div>
    <div class="tsc"><table class="tbl"><thead><tr><th>ID</th>${DB.wtg.mech.map(a=>`<th>${a.n}</th>`).join('')}<th>USS</th><th>Supply</th><th>Total%</th></tr></thead>
    <tbody>${DB.wtg.turbines.map(t=>`<tr><td><b>${t.id}</b></td>${t.mech.map((v,i)=>`<td><span class="chip ${v>=100?'cg':v>0?'cy':'cr'}">${v}%</span></td>`).join('')}<td>${t.uss}%</td><td>${t.sup}%</td><td><b>${calcTurbProg(t)}%</b></td></tr>`).join('')}</tbody></table></div></div>`;
}
function rndrPathTab(){
  const lp=DB.wtg.turbines.filter(t=>t.lp).length;const pp=DB.wtg.turbines.filter(t=>t.pp).length;
  return`<div class="pnl"><div class="ph2"><div class="pt">🛣️ Logistic & Permanent Pathway</div></div>
    <div class="g4" style="margin-bottom:11px;">
      <div class="kpi"><div class="kb" style="background:var(--sol)"></div><div class="kl">Logistic Done</div><div class="kv" style="color:var(--sol)">${lp}/26</div></div>
      <div class="kpi"><div class="kb" style="background:var(--land)"></div><div class="kl">Permanent Done</div><div class="kv" style="color:var(--land)">${pp}/26</div></div>
      <div class="kpi"><div class="kb" style="background:var(--er)"></div><div class="kl">ROW Issues</div><div class="kv" style="color:var(--er)">${DB.wtg.turbines.filter(t=>t.status==='row').length}</div></div>
    </div>
    <div class="tsc"><table class="tbl"><thead><tr><th>ID</th><th>Log Path</th><th>Perm Path</th><th>Status</th><th>Notes</th></tr></thead>
    <tbody>${DB.wtg.turbines.map(t=>`<tr><td><b>${t.id}</b></td><td>${t.lp?'<span class="chip cg">✅</span>':'<span class="chip cr">⏳</span>'}</td><td>${t.pp?'<span class="chip cg">✅</span>':'<span class="chip cr">⏳</span>'}</td><td><span class="chip ${t.status==='ready'?'cg':t.status==='row'?'cr':t.status==='casting'?'cb':'cy'}">${t.status.toUpperCase()}</span></td><td style="font-size:9px;">${t.notes}</td></tr>`).join('')}</tbody></table></div></div>`;
}
function rndrSupTab(){
  const s={nacelle:8,hub:8,bladeSet:7,towerSet:7,converterPanel:8,towerRack:8,lift:6,hardwareSet:3,deliveredFull:4};
  return`<div class="pnl"><div class="ph2"><div class="pt">🚚 WTG Supply Status</div></div>
    ${Object.entries(s).map(([k,v])=>`<div class="pr"><div class="prl">${k.replace(/([A-Z])/g,' $1').trim()}</div><div class="prt"><div class="prf" style="width:${R(v/26*100)}%;background:var(--wtg)"></div></div><div class="prp" style="color:var(--wtg)">${v}/26</div></div>`).join('')}
  </div>`;
}
function rndrSchedTab(){
  return`<div class="pnl"><div class="ph2"><div class="pt">📅 Construction Schedule</div></div>
    <div class="tsc"><table class="tbl"><thead><tr><th>ID</th><th>Excv</th><th>PCC</th><th>Anch</th><th>Reinf</th><th>Cast</th><th>LP</th><th>PP</th><th>Total%</th><th>Status</th></tr></thead>
    <tbody>${DB.wtg.turbines.map(t=>`<tr><td><b>${t.id}</b></td>
      ${t.civil.map(v=>`<td><span class="chip ${v>=100?'cg':v>0?'cy':'cr'}">${v}%</span></td>`).join('')}
      <td>${t.lp?'<span class="chip cg">✅</span>':'<span class="chip cr">⏳</span>'}</td>
      <td>${t.pp?'<span class="chip cg">✅</span>':'<span class="chip cr">⏳</span>'}</td>
      <td><b>${calcTurbProg(t)}%</b></td>
      <td><span class="chip ${t.status==='ready'?'cg':t.status==='row'?'cr':t.status==='casting'?'cb':'cy'}">${t.status.toUpperCase()}</span></td>
    </tr>`).join('')}</tbody></table></div></div>`;
}
function showTurb(id){
  const t=DB.wtg.turbines.find(x=>x.id===id);if(!t)return;
  const p=calcTurbProg(t);
  document.getElementById('t-t').textContent='🌬️ '+id+' – Turbine Detail';
  document.getElementById('t-b').innerHTML=`
    <div class="g4" style="margin-bottom:10px;">
      <div class="kpi" style="padding:8px;"><div class="kl">Total</div><div class="kv" style="font-size:14px;color:var(--wtg)">${p}%</div></div>
      <div class="kpi" style="padding:8px;"><div class="kl">Status</div><div class="kv" style="font-size:12px;color:${t.status==='ready'?'var(--ok)':t.status==='row'?'var(--er)':'var(--wn)'};">${t.status.toUpperCase()}</div></div>
      <div class="kpi" style="padding:8px;"><div class="kl">Log Path</div><div class="kv" style="font-size:14px;color:${t.lp?'var(--ok)':'var(--er)'};">${t.lp?'✅':'⏳'}</div></div>
      <div class="kpi" style="padding:8px;"><div class="kl">Perm Path</div><div class="kv" style="font-size:14px;color:${t.pp?'var(--ok)':'var(--er)'};">${t.pp?'✅':'⏳'}</div></div>
    </div>
    <div style="height:8px;background:var(--b1);border-radius:4px;margin-bottom:9px;overflow:hidden;"><div style="width:${p}%;height:100%;background:var(--wtg);border-radius:4px;"></div></div>
    <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--t3);margin-bottom:6px;">Civil Activities (30%)</div>
    ${DB.wtg.civil.map((a,i)=>`<div class="pr"><div class="prl" style="min-width:130px;">${a.n} (W:${a.w}%)</div><div class="prt"><div class="prf" style="width:${t.civil[i]}%;background:${t.civil[i]>=100?'var(--ok)':t.civil[i]>0?'var(--wn)':'var(--b3)'}"></div></div><div class="prp" style="color:${t.civil[i]>=100?'var(--ok)':t.civil[i]>0?'var(--wn)':'var(--er)'};">${t.civil[i]}%</div></div>`).join('')}
    <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--t3);margin:8px 0 6px;">Mechanical Activities (50%)</div>
    ${DB.wtg.mech.map((a,i)=>`<div class="pr"><div class="prl" style="min-width:130px;">${a.n} (W:${a.w}%)</div><div class="prt"><div class="prf" style="width:${t.mech[i]}%;background:${t.mech[i]>=100?'var(--ok)':t.mech[i]>0?'var(--wn)':'var(--b3)'}"></div></div><div class="prp" style="color:${t.mech[i]>=100?'var(--ok)':t.mech[i]>0?'var(--wn)':'var(--er)'};">${t.mech[i]}%</div></div>`).join('')}
    <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--t3);margin:8px 0 6px;">USS (10%) & Supply (10%)</div>
    <div class="pr"><div class="prl" style="min-width:130px;">USS Works</div><div class="prt"><div class="prf" style="width:${t.uss}%;background:var(--ok)"></div></div><div class="prp">${t.uss}%</div></div>
    <div class="pr"><div class="prl" style="min-width:130px;">Supply Complete</div><div class="prt"><div class="prf" style="width:${t.sup}%;background:var(--ac)"></div></div><div class="prp">${t.sup}%</div></div>
    <div class="sep"></div>
    <div style="font-size:9px;color:var(--t3);margin-bottom:7px;">📝 Notes: ${t.notes}</div>
    <button class="btn btwt bts" onclick="reqLogin('wtg',()=>{cov('tov');openWtgProg('${id}');})">📊 Enter Today's Progress</button>`;
  ov('tov');
}

// ═══════════════════════════════════════════════════════════