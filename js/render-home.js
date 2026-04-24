//  HOME
// ═══════════════════════════════════════════════════════════
function updateOverallBars(){
  const sol=calcSolarProg(),wtg=calcWtgProg(),land=calcLandProg(),bop=calcBopProg(),tot=calcOverall();
  function setBar(id,pid,v){const f=document.getElementById(id);if(f){f.style.width=v+'%';f.textContent=v+'%';}const p=document.getElementById(pid);if(p)p.textContent=v+'%';}
  setBar('fill-total','pct-total',tot);setBar('fill-sol','pct-sol',sol);setBar('fill-wtg','pct-wtg',wtg);setBar('fill-land','pct-land',land);setBar('fill-bop','pct-bop',bop);
  // Module cards
  [['mc-sol','bar-sol',sol,'chip-sol','sub-sol',`ITC-1:${calcITCProg('ITC-1')}%`],['mc-wtg','bar-wtg',wtg,'chip-wtg','sub-wtg',`${DB.wtg.turbines.filter(t=>t.status==='ready').length}/26 ready`],['mc-land','bar-land',land,'',''],[],[]].forEach(([mv,bv,v,,sv,sub])=>{if(mv){const el=document.getElementById(mv);if(el)el.textContent=v+'%';const bl=document.getElementById(bv);if(bl)bl.style.width=v+'%';if(sv&&sub){const sl=document.getElementById(sv);if(sl)sl.textContent=sub;}}});
  const bl=document.getElementById('mc-land');if(bl)bl.textContent=land+'%';const bb=document.getElementById('bar-land');if(bb)bb.style.width=land+'%';
  const bopEl=document.getElementById('mc-bop');if(bopEl)bopEl.textContent=bop+'%';const bopBar=document.getElementById('bar-bop');if(bopBar)bopBar.style.width=bop+'%';
  // BOP subsection badges  
  const b33=calcBop33PctV2(),b66=calcBop66PctV2(),pss=calcPssPct(),gss=calcGssPct();
  [['bop33-pct','bop33-bar',b33,'var(--kv3)'],['bop66-pct','bop66-bar',b66,'var(--kv6)'],['boppss-pct','boppss-bar',pss,'var(--pss)'],['bopgss-pct','bopgss-bar',gss,'var(--gss)']].forEach(([p,b,v,c])=>{const pe=document.getElementById(p);if(pe)pe.textContent=v+'%';const be=document.getElementById(b);if(be){be.style.width=v+'%';be.style.background=c;}});
  return {sol,wtg,land,bop,tot};
}
function rndrHome(){
  const {sol,wtg,land,bop,tot}=updateOverallBars();
  const ready=DB.wtg.turbines.filter(t=>t.status==='ready').length;
  const totalMp=14+DB.mp.sol+DB.mp.wtg+DB.mp.bop;
  const rowCnt=DB.rowIssues.length;

  // ── CIRCULAR KPI CARDS (spec: Overall, Land only, Solar only, WTG only, BOP only, Manpower, ROW) ──
  document.getElementById('home-circ-kr').innerHTML=`
    <div style="text-align:center;">
      <div class="circ-kpi" style="border-color:#00c8ff;" onclick="nav('home')">
        <div class="kl">Overall</div><div class="kv" style="color:var(--ac)">${tot}%</div><div class="km">140.6 MW</div>
      </div><div style="font-size:9px;color:var(--t3);margin-top:5px;">📈 Total</div>
    </div>
    <div style="text-align:center;">
      <div class="circ-kpi" style="border-color:var(--land);" onclick="nav('land')">
        <div class="kl">Land Only</div><div class="kv" style="color:var(--land)">${land}%</div><div class="km">WTG+Sol</div>
      </div><div style="font-size:9px;color:var(--t3);margin-top:5px;">🌍 Land</div>
    </div>
    <div style="text-align:center;">
      <div class="circ-kpi" style="border-color:var(--sol);" onclick="nav('solar')">
        <div class="kl">Solar Only</div><div class="kv" style="color:var(--sol)">${sol}%</div><div class="km">70.4 MW</div>
      </div><div style="font-size:9px;color:var(--t3);margin-top:5px;">☀️ Solar</div>
    </div>
    <div style="text-align:center;">
      <div class="circ-kpi" style="border-color:var(--wtg);" onclick="nav('wtg')">
        <div class="kl">WTG Only</div><div class="kv" style="color:var(--wtg)">${wtg}%</div><div class="km">70.2 MW</div>
      </div><div style="font-size:9px;color:var(--t3);margin-top:5px;">🌬️ WTG</div>
    </div>
    <div style="text-align:center;">
      <div class="circ-kpi" style="border-color:var(--bop);" onclick="nav('bop')">
        <div class="kl">BOP Only</div><div class="kv" style="color:var(--bop)">${bop}%</div><div class="km">4 Sections</div>
      </div><div style="font-size:9px;color:var(--t3);margin-top:5px;">⚙️ BOP</div>
    </div>
    <div style="text-align:center;">
      <div class="circ-kpi" style="border-color:var(--ok);" onclick="nav('manpower')">
        <div class="kl">Manpower</div><div class="kv" style="color:var(--ok)" id="kpi-mp">${totalMp}</div><div class="km">On site</div>
      </div><div style="font-size:9px;color:var(--t3);margin-top:5px;">👷 Workers</div>
    </div>
    <div style="text-align:center;">
      <div class="circ-kpi" style="border-color:var(--er);" onclick="nav('home')">
        <div class="kl">ROW Issues</div><div class="kv" style="color:var(--er)">${rowCnt}</div><div class="km">Locations</div>
      </div><div style="font-size:9px;color:var(--t3);margin-top:5px;">🚧 ROW</div>
    </div>`;

  // ── POD Summary (left lower panel) ──
  const podEl=document.getElementById('home-pod-summary');
  if(podEl){
    const allPod=[...DB.pod.s,...DB.pod.w,...DB.pod.l,...DB.pod.b];
    podEl.innerHTML= allPod.length===0
      ? `<div style="color:var(--t3);font-size:10px;padding:8px 0;">No entries today. <span style="color:var(--ac);cursor:pointer;" onclick="nav('pod')">Submit POD →</span></div>`
      : allPod.slice(-4).map(p=>`<div class="ir"><div class="irl">${p.module||'—'} | ${p.act||'—'}</div><div class="irr" style="color:var(--ok);">+${p.td||0}%</div></div>`).join('')
        + `<div style="font-size:8px;color:var(--t3);margin-top:6px;">${allPod.length} total entries | <span style="color:var(--ac);cursor:pointer;" onclick="nav('pod')">View all →</span></div>`;
  }

  // ── Manpower Summary (left panel) ──
  const mpEl=document.getElementById('home-mp-summary');
  if(mpEl){
    mpEl.innerHTML=`
      <div class="pr"><div class="prl">Solar Team</div><div class="prt"><div class="prf" style="width:${Math.min(100,((DB.mp.sol+6)/20)*100)}%;background:var(--sol)"></div></div><div class="prp" style="color:var(--sol);">${6+DB.mp.sol}</div></div>
      <div class="pr"><div class="prl">WTG Team</div><div class="prt"><div class="prf" style="width:${Math.min(100,((DB.mp.wtg+4)/20)*100)}%;background:var(--wtg)"></div></div><div class="prp" style="color:var(--wtg);">${4+DB.mp.wtg}</div></div>
      <div class="pr"><div class="prl">BOP Team</div><div class="prt"><div class="prf" style="width:${Math.min(100,((DB.mp.bop+3)/20)*100)}%;background:var(--bop)"></div></div><div class="prp" style="color:var(--bop);">${3+DB.mp.bop}</div></div>
      <div class="pr"><div class="prl">Mgmt & HSE</div><div class="prt"><div class="prf" style="width:5%;background:var(--ac)"></div></div><div class="prp" style="color:var(--ac);">1</div></div>
      <div style="font-size:8px;color:var(--t3);margin-top:4px;">Total on site: <b style="color:var(--ok);">${totalMp}</b> workers</div>`;
  }

  // ITC C/WIP/R + WTG charts
  const itcIds=Object.keys(DB.solar.itcs);
  const sP=itcIds.map(id=>calcITCProg(id));
  mkCWIP('ch-sol-cwip',itcIds,sP);
  const twIds=DB.wtg.turbines.slice(0,12).map(t=>t.id);
  const twP=DB.wtg.turbines.slice(0,12).map(t=>calcTurbProg(t));
  mkCWIP('ch-wtg-cwip',twIds,twP);
  mkDo('pie-ov',tot,'#00c8ff');mkDo('pie-sol',sol,'#ffaa00');mkDo('pie-wtg',wtg,'#7c4dff');mkDo('pie-land',land,'#00c853');mkDo('pie-bop',bop,'#ff5722');mkDo('pie-td',0.12,'#00ffb3');
  document.getElementById('mc-pod').textContent=DB.pod.s.length+DB.pod.w.length+DB.pod.l.length+DB.pod.b.length;

  // Planned vs Actual curve
  const sc=DB.schedule;
  const forecastIdx=sc.actual.findLastIndex(v=>v!==null);
  const forecastData=sc.labels.map((_,i)=>{
    if(i<=forecastIdx)return null;
    const base=sc.actual[forecastIdx];
    const rem=100-base;const remSteps=sc.labels.length-1-forecastIdx;
    return R(base+rem*(i-forecastIdx)/remSteps);
  });
  mkC('ch-pva',{type:'line',data:{labels:sc.labels,datasets:[
    {label:'📅 Planned',data:sc.planned,borderColor:'rgba(0,200,255,.9)',backgroundColor:'rgba(0,200,255,.07)',tension:.4,pointRadius:3,fill:true},
    {label:'✅ Actual',data:sc.actual,borderColor:'rgba(0,230,118,.9)',backgroundColor:'rgba(0,230,118,.07)',tension:.4,pointRadius:4,fill:true,spanGaps:false},
    {label:'🔮 Forecast',data:forecastData,borderColor:'rgba(255,202,40,.8)',backgroundColor:'transparent',tension:.4,pointRadius:3,borderDash:[6,3],fill:false,spanGaps:false},
  ]},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{position:'top'},tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: ${ctx.raw!==null?ctx.raw+'%':'—'}`}}},scales:{y:{min:0,max:100,ticks:{callback:v=>v+'%'},title:{display:true,text:'Cumulative Progress %',font:{size:9}}},x:{title:{display:true,text:'Month',font:{size:9}}}}}});

  // ROW table
  const rowTbl=document.getElementById('row-tbl');
  const rowCntEl=document.getElementById('row-count');
  if(rowTbl){rowTbl.innerHTML=`<thead><tr><th>Location</th><th>Type</th><th>Issue</th><th>Opened</th><th>Duration</th><th>Status</th></tr></thead><tbody>${DB.rowIssues.map(r=>`<tr><td><b>${r.loc}</b></td><td>${r.type}</td><td>${r.issue}</td><td>${r.opened}</td><td><span class="chip cr">${rowDuration(r.opened)}</span></td><td><span class="chip cy">🔴 Open</span></td></tr>`).join('')}</tbody>`;}
  if(rowCntEl)rowCntEl.textContent=DB.rowIssues.length+' Open';
}

// ═══════════════════════════════════════════════════════════