//  TODAY'S PROGRESS (SOLAR & WTG)
// ═══════════════════════════════════════════════════════════
function openSolProg(id){
  const acts=DB.solar.itcs[id].acts;
  document.getElementById('p-t').textContent='📊 Solar Today\'s Progress – '+id;
  document.getElementById('p-b').innerHTML=`<div class="al al-w" style="margin-bottom:9px;">⚠️ Authorized entry. Updates live calculations.</div>
  <form onsubmit="subSolProg(event,'${id}')">
    <div class="fr"><div class="fg"><label class="fl">Activity</label><select class="fs" id="tp-act">${acts.map(a=>`<option value="${a.n}">${a.n} (${a.done}%)</option>`).join('')}</select></div>
    <div class="fg"><label class="fl">New Cumulative %</label><input class="fi" id="tp-cum" type="number" min="0" max="100" step="0.1" placeholder="New total %" required></div></div>
    <div class="fr3"><div class="fg"><label class="fl">Today's Progress %</label><input class="fi" id="tp-td" type="number" min="0" max="100" step="0.1" placeholder="e.g. 2.5"></div>
    <div class="fg"><label class="fl">Manpower</label><input class="fi" id="tp-mp" type="number" min="0" placeholder="Workers" required></div>
    <div class="fg"><label class="fl">Contractor</label><input class="fi" id="tp-con" placeholder="Contractor"></div></div>
    <div class="fr"><div class="fg"><label class="fl">Work Permit</label><input class="fi" id="tp-wp" placeholder="WP-2026-XXX"></div>
    <div class="fg"><label class="fl">TBT Done?</label><select class="fs" id="tp-tbt"><option>Yes</option><option>No</option></select></div></div>
    <div class="fg"><label class="fl">Safety Status</label><select class="fs" id="tp-saf"><option>All Clear</option><option>Near Miss</option><option>Observation Raised</option></select></div>
    <div class="fg"><label class="fl">Remarks</label><textarea class="fta" id="tp-rem" placeholder="Constraints, material, issues..."></textarea></div>
    <div style="display:flex;gap:7px;margin-top:7px;"><button type="button" class="btn" style="flex:1;" onclick="cov('pov')">Cancel</button><button type="submit" class="btn btsol" style="flex:1;">✅ Submit</button></div>
  </form>`;ov('pov');
}
function subSolProg(e,id){
  e.preventDefault();const actName=document.getElementById('tp-act').value;const cum=+document.getElementById('tp-cum').value;const td=+document.getElementById('tp-td').value;const mp=+document.getElementById('tp-mp').value;
  const act=DB.solar.itcs[id].acts.find(a=>a.n===actName);if(act){act.done=Math.min(100,cum);act.today=td;}
  DB.mp.sol+=mp;updateKpiMp();cov('pov');alert(`✅ Solar Progress Saved!\n${actName}: ${cum}%\nMP: ${mp}\nBy: ${CU?.name}`);
  rndrITC(id);updateOverallBars();
}
function openWtgProg(id){
  const t=DB.wtg.turbines.find(x=>x.id===id);if(!t)return;
  document.getElementById('p-t').textContent='📊 WTG Progress – '+id;
  const allActs=[...DB.wtg.civil.map((a,i)=>({...a,type:'civil',idx:i})),...DB.wtg.mech.map((a,i)=>({...a,type:'mech',idx:i})),{n:'USS Works',type:'uss'},{n:'Supply Complete',type:'sup'}];
  document.getElementById('p-b').innerHTML=`<div class="al al-w" style="margin-bottom:9px;">⚠️ Authorized. Updates turbine progress.</div>
  <form onsubmit="subWtgProg(event,'${id}')">
    <div class="fr"><div class="fg"><label class="fl">Activity</label><select class="fs" id="wtp-act">${allActs.map(a=>`<option value="${a.type}:${a.idx||0}">${a.n} (${a.type==='civil'?t.civil[a.idx]:a.type==='mech'?t.mech[a.idx]:a.type==='uss'?t.uss:t.sup}%)</option>`).join('')}</select></div>
    <div class="fg"><label class="fl">New Progress %</label><input class="fi" id="wtp-p" type="number" min="0" max="100" placeholder="0-100" required></div></div>
    <div class="fr3"><div class="fg"><label class="fl">Manpower</label><input class="fi" id="wtp-mp" type="number" min="0" placeholder="Workers" required></div>
    <div class="fg"><label class="fl">Contractor</label><input class="fi" id="wtp-con" placeholder="Contractor"></div>
    <div class="fg"><label class="fl">Work Permit</label><input class="fi" id="wtp-wp" placeholder="WP-XXX"></div></div>
    <div class="fr"><div class="fg"><label class="fl">TBT Done?</label><select class="fs" id="wtp-tbt"><option>Yes</option><option>No</option></select></div>
    <div class="fg"><label class="fl">Safety</label><select class="fs" id="wtp-saf"><option>All Clear</option><option>Near Miss</option><option>Observation</option></select></div></div>
    <div class="fg"><label class="fl">Remarks</label><textarea class="fta" id="wtp-rem" placeholder="Status, issues..."></textarea></div>
    <div style="display:flex;gap:7px;margin-top:7px;"><button type="button" class="btn" style="flex:1;" onclick="cov('pov')">Cancel</button><button type="submit" class="btn btwt" style="flex:1;">✅ Submit</button></div>
  </form>`;ov('pov');
}
function subWtgProg(e,id){
  e.preventDefault();const [type,idx]=document.getElementById('wtp-act').value.split(':');const p=+document.getElementById('wtp-p').value;const mp=+document.getElementById('wtp-mp').value;
  const t=DB.wtg.turbines.find(x=>x.id===id);
  if(t){if(type==='civil')t.civil[+idx]=p;else if(type==='mech')t.mech[+idx]=p;else if(type==='uss')t.uss=p;else t.sup=p;}
  DB.mp.wtg+=mp;updateKpiMp();cov('pov');cov('tov');alert(`✅ WTG Progress Saved!\n${id} | ${type}: ${p}%\nMP: ${mp}`);
  if(CV==='wtg'){rndrWtg();wTab(curWT);}updateOverallBars();
}
function updateKpiMp(){const el=document.getElementById('kpi-mp');if(el)el.textContent=14+DB.mp.sol+DB.mp.wtg+DB.mp.bop;}

// ═══════════════════════════════════════════════════════════
//  POD
// ═══════════════════════════════════════════════════════════
function rndrPod(){podTab(curPT);}
function podTab(t){
  curPT=t;['s','w','l','b'].forEach(k=>{const el=document.getElementById('ptb-'+k);if(el)el.className='stb'+(k===t?` on-${k}`:'' );});
  const el=document.getElementById('pod-ct');if(!el)return;
  const btnMap={s:`<button class="btn btsol bts" onclick="openPODForm('s')">📋 Submit Solar POD</button>`,w:`<button class="btn btwt bts" onclick="openPODForm('w')">📋 Submit WTG POD</button>`,l:`<button class="btn btla bts" onclick="openPODForm('l')">📋 Submit Land POD</button>`,b:`<button class="btn btbo bts" onclick="openPODForm('b')">📋 Submit BOP POD</button>`};
  const entries=DB.pod[t];
  el.innerHTML=`<div class="pnl"><div class="ph2"><div class="pt">Plan of Day — No login required</div>${btnMap[t]}</div>
    <div class="al al-i">ℹ️ POD = Planned work. Today's Progress (actual) = Login required from module pages.</div>
    ${entries.length?entries.map(x=>`<div style="background:var(--card3);border:1px solid var(--b2);border-radius:7px;padding:9px;margin-bottom:6px;font-size:10px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:3px;"><b>${x.activity}</b><span class="chip cg">✓ Planned</span></div>
      <div class="mst"><div class="ms">Qty:<b>${x.qty}</b></div><div class="ms">MP:<b>${x.mp}</b></div><div class="ms">Contractor:<b>${x.contractor||'—'}</b></div><div class="ms">By:<b>${x.by}</b></div><div class="ms">At:<b>${x.time}</b></div></div>
      ${x.notes?`<div style="color:var(--t3);margin-top:2px;font-size:9px;">📝 ${x.notes}</div>`:''}
    </div>`).join(''):`<div style="color:var(--t3);font-size:10px;padding:8px;">No POD entries yet.</div>`}
  </div>`;
}
function openPODForm(t){
  const frms={
    s:`<form onsubmit="subPOD(event,'s')">
      <div class="fr"><div class="fg"><label class="fl">ITC</label><select class="fs" id="pf-itc">${Object.keys(DB.solar.itcs).map(i=>`<option>${i}</option>`).join('')}</select></div>
      <div class="fg"><label class="fl">Activity</label><select class="fs" id="pf-act">${DB.solar.itcs['ITC-1'].acts.map(a=>`<option>${a.n}</option>`).join('')}</select></div></div>
      <div class="fr"><div class="fg"><label class="fl">Planned Qty (%)</label><input class="fi" id="pf-qty" type="number" min="0" max="100" placeholder="%" required></div>
      <div class="fg"><label class="fl">Manpower</label><input class="fi" id="pf-mp" type="number" min="0" placeholder="Workers" required></div></div>
      <div class="fg"><label class="fl">Contractor</label><input class="fi" id="pf-con" placeholder="Contractor / Agency"></div>
      <div class="fg"><label class="fl">Submitted By</label><input class="fi" id="pf-by" placeholder="Name" required></div>
      <div class="fg"><label class="fl">Remarks</label><textarea class="fta" id="pf-nt" placeholder="Notes..."></textarea></div>
      <div style="display:flex;gap:7px;margin-top:7px;"><button type="button" class="btn" style="flex:1;" onclick="cov('pov')">Cancel</button><button type="submit" class="btn btsol" style="flex:1;">✅ Submit POD</button></div>
    </form>`,
    w:`<form onsubmit="subPOD(event,'w')">
      <div class="fr"><div class="fg"><label class="fl">Turbine</label><select class="fs" id="pf-act">${DB.wtg.turbines.map(t=>`<option>${t.id}</option>`).join('')}</select></div>
      <div class="fg"><label class="fl">Activity</label><select class="fs" id="pf-wact">${[...DB.wtg.civil,...DB.wtg.mech,...DB.wtg.uss,...DB.wtg.supply].map(a=>`<option>${a.n}</option>`).join('')}</select></div></div>
      <div class="fr"><div class="fg"><label class="fl">Planned Progress %</label><input class="fi" id="pf-qty" type="number" min="0" max="100" placeholder="%" required></div>
      <div class="fg"><label class="fl">Manpower</label><input class="fi" id="pf-mp" type="number" min="0" placeholder="Workers" required></div></div>
      <div class="fg"><label class="fl">Contractor</label><input class="fi" id="pf-con" placeholder="Contractor"></div>
      <div class="fg"><label class="fl">Submitted By</label><input class="fi" id="pf-by" placeholder="Name" required></div>
      <div class="fg"><label class="fl">Remarks</label><textarea class="fta" id="pf-nt" placeholder="Notes..."></textarea></div>
      <div style="display:flex;gap:7px;margin-top:7px;"><button type="button" class="btn" style="flex:1;" onclick="cov('pov')">Cancel</button><button type="submit" class="btn btwt" style="flex:1;">✅ Submit POD</button></div>
    </form>`,
    l:`<form onsubmit="subPOD(event,'l')">
      <div class="fr"><div class="fg"><label class="fl">Type</label><select class="fs" id="pf-type"><option>WTG Land</option><option>Solar Land</option></select></div>
      <div class="fg"><label class="fl">Location/Block</label><select class="fs" id="pf-act">${[...DB.wtgLand.locs.map(l=>l.id),...Object.keys(DB.solLand.blocks)].map(i=>`<option>${i}</option>`).join('')}</select></div></div>
      <div class="fg"><label class="fl">Stage/Activity</label><select class="fs" id="pf-stage">${DB.wtgLand.stages.map(s=>`<option>${s}</option>`).join('')}</select></div>
      <div class="fr"><div class="fg"><label class="fl">Manpower</label><input class="fi" id="pf-mp" type="number" min="0" placeholder="Workers" required></div>
      <div class="fg"><label class="fl">Submitted By</label><input class="fi" id="pf-by" placeholder="Name" required></div></div>
      <div class="fg"><label class="fl">Contractor</label><input class="fi" id="pf-con" placeholder="Contractor"></div>
      <div class="fg"><label class="fl">Remarks</label><textarea class="fta" id="pf-nt" placeholder="Notes..."></textarea></div>
      <div style="display:flex;gap:7px;margin-top:7px;"><button type="button" class="btn" style="flex:1;" onclick="cov('pov')">Cancel</button><button type="submit" class="btn btla" style="flex:1;">✅ Submit POD</button></div>
    </form>`,
    b:`<form onsubmit="subPOD(event,'b')">
      <div class="fr"><div class="fg"><label class="fl">Section</label><select class="fs" id="pf-sec"><option>33kV</option><option>66kV</option><option>PSS</option><option>GSS</option></select></div>
      <div class="fg"><label class="fl">Activity</label><input class="fi" id="pf-act" placeholder="Activity name" required></div></div>
      <div class="fr"><div class="fg"><label class="fl">Planned Qty</label><input class="fi" id="pf-qty" type="number" min="0" placeholder="Qty" required></div>
      <div class="fg"><label class="fl">Manpower</label><input class="fi" id="pf-mp" type="number" min="0" placeholder="Workers" required></div></div>
      <div class="fg"><label class="fl">Contractor</label><input class="fi" id="pf-con" placeholder="Contractor"></div>
      <div class="fg"><label class="fl">Submitted By</label><input class="fi" id="pf-by" placeholder="Name" required></div>
      <div class="fg"><label class="fl">Remarks</label><textarea class="fta" id="pf-nt" placeholder="Notes..."></textarea></div>
      <div style="display:flex;gap:7px;margin-top:7px;"><button type="button" class="btn" style="flex:1;" onclick="cov('pov')">Cancel</button><button type="submit" class="btn btbo" style="flex:1;">✅ Submit POD</button></div>
    </form>`
  };
  document.getElementById('p-t').textContent={s:'☀️ Solar POD',w:'🌬️ WTG POD',l:'🌍 Land POD',b:'⚙️ BOP POD'}[t]+' – Plan of Day';
  document.getElementById('p-b').innerHTML=frms[t]||'';ov('pov');
}
function subPOD(e,t){
  e.preventDefault();
  const act=document.getElementById('pf-act')?.value||document.getElementById('pf-stage')?.value||'';
  const qty=document.getElementById('pf-qty')?.value||'—';const mp=document.getElementById('pf-mp')?.value||0;
  const by=document.getElementById('pf-by')?.value||'—';const nt=document.getElementById('pf-nt')?.value||'';const con=document.getElementById('pf-con')?.value||'';
  DB.pod[t].push({activity:act,qty,mp,contractor:con,by,notes:nt,time:new Date().toLocaleTimeString()});
  document.getElementById('mc-pod').textContent=DB.pod.s.length+DB.pod.w.length+DB.pod.l.length+DB.pod.b.length;
  cov('pov');alert('✅ POD Submitted!');rndrPod();
}

// ═══════════════════════════════════════════════════════════
//  SAFETY
// ═══════════════════════════════════════════════════════════
function rndrSafety(){
  document.getElementById('safety-ct').innerHTML=`
    <div class="ph"><div class="pht">🦺 Safety & HSE Dashboard</div></div>
    <div class="kr">
      <div class="kpi"><div class="kb" style="background:var(--ok)"></div><div class="kl">Safety Score</div><div class="kv" style="color:var(--ok)">98%</div></div>
      <div class="kpi"><div class="kb" style="background:var(--ok)"></div><div class="kl">LTI</div><div class="kv" style="color:var(--ok)">0</div></div>
      <div class="kpi"><div class="kb" style="background:var(--wn)"></div><div class="kl">Near Misses</div><div class="kv" style="color:var(--wn)">2</div></div>
      <div class="kpi"><div class="kb" style="background:var(--ok)"></div><div class="kl">PPE OK</div><div class="kv" style="color:var(--ok)">100%</div></div>
      <div class="kpi"><div class="kb" style="background:var(--ac)"></div><div class="kl">TBT Done</div><div class="kv" style="color:var(--ac)">12</div></div>
      <div class="kpi"><div class="kb" style="background:var(--sol)"></div><div class="kl">Safe Man-Hrs</div><div class="kv" style="color:var(--sol);font-size:16px;">4,800</div></div>
    </div>
    <div class="g2">
      <div class="pnl"><div class="ph2"><div class="pt">📋 Observations</div><span class="pb cy">2 Open</span></div>
        <div class="al al-w">⚠️ Obs #001: Signage missing MKD-253 – Due 05-Apr</div>
        <div class="al al-w">⚠️ Obs #002: Slip hazard MKD-211 – Due 04-Apr</div>
        <div class="al al-s">✅ Obs #003: PPE CDP-221 – CLOSED</div>
      </div>
      <div class="pnl"><div class="ph2"><div class="pt">📊 HSE KPIs</div></div>
        <div class="ir"><div class="irl">TBT Conducted</div><div class="irr">12/12 ✅</div></div>
        <div class="ir"><div class="irl">Work Permits Issued</div><div class="irr">24</div></div>
        <div class="ir"><div class="irl">Work Permits Closed</div><div class="irr">22</div></div>
        <div class="ir"><div class="irl">First Aid Cases</div><div class="irr">0</div></div>
        <div class="ir"><div class="irl">Emergency Drill</div><div class="irr">15-Mar-2026 ✅</div></div>
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════════════════
//  MANPOWER
// ═══════════════════════════════════════════════════════════
function rndrMp(){
  const tot=14+DB.mp.sol+DB.mp.wtg+DB.mp.bop;
  document.getElementById('mp-ct').innerHTML=`
    <div class="ph"><div class="pht">👷 Manpower & Equipment</div></div>
    <div class="kr">
      <div class="kpi"><div class="kb" style="background:var(--ac)"></div><div class="kl">Total Today</div><div class="kv" style="color:var(--ac)">${tot}</div></div>
      <div class="kpi"><div class="kb" style="background:var(--sol)"></div><div class="kl">Solar</div><div class="kv" style="color:var(--sol)">8</div></div>
      <div class="kpi"><div class="kb" style="background:var(--wtg)"></div><div class="kl">WTG</div><div class="kv" style="color:var(--wtg)">4</div></div>
      <div class="kpi"><div class="kb" style="background:var(--bop)"></div><div class="kl">BOP</div><div class="kv" style="color:var(--bop)">2</div></div>
      <div class="kpi"><div class="kb" style="background:var(--ok)"></div><div class="kl">Skilled</div><div class="kv" style="color:var(--ok)">8</div></div>
      <div class="kpi"><div class="kb" style="background:var(--wn)"></div><div class="kl">Unskilled</div><div class="kv" style="color:var(--wn)">6</div></div>
    </div>
    <div class="g2">
      <div class="pnl"><div class="ph2"><div class="pt">📊 Distribution</div></div><div class="ch h240"><canvas id="ch-mpd"></canvas></div></div>
      <div class="pnl"><div class="ph2"><div class="pt">🧑‍🔧 Skilled vs Unskilled</div></div><div class="ch h240"><canvas id="ch-mps"></canvas></div></div>
    </div>
    <div class="pnl"><div class="ph2"><div class="pt">🔧 Equipment on Site</div></div>
      <div class="eqg">${[['🏗️','Crane','1','100T Mobile'],['🚜','JCB','3','2 Active+1 Standby'],['🚛','Transit Mixer','2','Casting Support'],['🔩','Hitch/Trailer','2','Blade Transport'],['🏎️','Concrete Pump','1','Foundation'],['🚧','Dewatering Pump','2','MKD-211'],['🛻','Piling Rig','1','ITC-1'],['⚙️','Compactor','2','Roads'],['🛢️','Water Tanker','1','Curing'],['🚒','Pickup','4','Transport'],['🔦','DG Set','2','Power'],['🏗️','Tower Crane','0','Not Mobilized']].map(([e,n,v,s])=>`<div class="eqc"><div class="eqe">${e}</div><div class="eqn">${n}</div><div class="eqv" style="color:${v==='0'?'var(--er)':'var(--ac)'};">${v}</div><div class="eqs">${s}</div></div>`).join('')}</div>
    </div>
    <div class="pnl"><div class="ph2"><div class="pt">👷 Crew Breakdown</div></div>
      <div class="tsc"><table class="tbl"><thead><tr><th>Category</th><th>Team</th><th>Count</th><th>Type</th><th>Location</th></tr></thead>
      <tbody>
        <tr><td>Site Manager</td><td>Mgmt</td><td>1</td><td><span class="chip cb">Management</span></td><td>All</td></tr>
        <tr><td>Civil Engineers</td><td>Solar+WTG</td><td>2</td><td><span class="chip cb">Skilled</span></td><td>ITC-1, WTG</td></tr>
        <tr><td>Supervisors</td><td>All</td><td>2</td><td><span class="chip cb">Skilled</span></td><td>Multi</td></tr>
        <tr><td>Piling Crew</td><td>Solar</td><td>3</td><td><span class="chip cy">Skilled</span></td><td>ITC-1</td></tr>
        <tr><td>MMS Erection</td><td>Solar</td><td>2</td><td><span class="chip cy">Skilled</span></td><td>ITC-1</td></tr>
        <tr><td>Foundation Workers</td><td>WTG</td><td>4</td><td><span class="chip cy">Semi</span></td><td>MOB-142</td></tr>
        <tr><td>BOP Roads Crew</td><td>BOP</td><td>2</td><td><span class="chip cr">Unskilled</span></td><td>Roads</td></tr>
        <tr><td>General Labour</td><td>All</td><td>4</td><td><span class="chip cr">Unskilled</span></td><td>Various</td></tr>
        <tr><td>Safety Officer</td><td>HSE</td><td>1</td><td><span class="chip cg">Certified</span></td><td>All</td></tr>
      </tbody></table></div>
    </div>`;
  setTimeout(()=>{
    mkC('ch-mpd',{type:'doughnut',data:{labels:['Piling','MMS','WTG Civil','BOP 33kV','BOP 66kV','Engineers','Safety'],datasets:[{data:[3,2,4,1,1,2,1],backgroundColor:['#ffaa00','#ff8800','#7c4dff','#9c27b0','#ff9800','#00c8ff','#00c853'],borderWidth:2,borderColor:'var(--bg2)'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{font:{size:9}}}}}});
    mkC('ch-mps',{type:'bar',data:{labels:['Solar','WTG','BOP','Mgmt','HSE'],datasets:[{label:'Skilled',data:[4,2,1,3,1],backgroundColor:'rgba(0,200,255,.72)',borderRadius:4},{label:'Semi',data:[1,2,0,0,0],backgroundColor:'rgba(255,170,0,.72)',borderRadius:4},{label:'Unskilled',data:[3,0,1,0,0],backgroundColor:'rgba(255,82,82,.72)',borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top'}},scales:{x:{stacked:true},y:{stacked:true,beginAtZero:true}}}});
  },80);
}

// ═══════════════════════════════════════════════════════════
//  MAP
// ═══════════════════════════════════════════════════════════
// ── 66kV EHV Line Tower data (UTM Zone 43P converted to WGS84) ──────────────
const EHV_66KV_TOWERS=[
  {id:"GSS",      type:"terminal", lat:14.862627, lng:76.357685},
  {id:"GANT-1",   type:"gantry",   lat:14.862263, lng:76.358147},
  {id:"AP-1",     type:"tower",    lat:14.862500, lng:76.357870},
  {id:"AP-2",     type:"tower",    lat:14.861936, lng:76.359837},
  {id:"AP-3",     type:"tower",    lat:14.861274, lng:76.360242},
  {id:"GANT-2",   type:"gantry",   lat:14.861038, lng:76.360472},
  {id:"GANT-3",   type:"gantry",   lat:14.860720, lng:76.360805},
  {id:"AP-4",     type:"tower",    lat:14.860601, lng:76.360934},
  {id:"AP-5",     type:"tower",    lat:14.859198, lng:76.362849},
  {id:"AP-6",     type:"tower",    lat:14.859155, lng:76.365488},
  {id:"AP-7",     type:"tower",    lat:14.858057, lng:76.366290},
  {id:"GANT-4",   type:"gantry",   lat:14.857533, lng:76.366231},
  {id:"GANT-5",   type:"gantry",   lat:14.857018, lng:76.366181},
  {id:"AP-8",     type:"tower",    lat:14.856566, lng:76.366169},
  {id:"AP-9",     type:"tower",    lat:14.854184, lng:76.366953},
  {id:"AP-10",    type:"tower",    lat:14.852208, lng:76.367898},
  {id:"AP-11",    type:"tower",    lat:14.850732, lng:76.368260},
  {id:"GANT-6",   type:"gantry",   lat:14.850605, lng:76.368455},
  {id:"GANT-7",   type:"gantry",   lat:14.850404, lng:76.368751},
  {id:"AP-12",    type:"tower",    lat:14.850240, lng:76.369029},
  {id:"AP-12A",   type:"tower",    lat:14.848463, lng:76.369845},
  {id:"AP-13",    type:"tower",    lat:14.847199, lng:76.369632},
  {id:"AP-14",    type:"tower",    lat:14.842834, lng:76.370933},
  {id:"AP-15",    type:"tower",    lat:14.838733, lng:76.372097},
  {id:"AP-16",    type:"tower",    lat:14.836544, lng:76.375233},
  {id:"16/1",     type:"tower",    lat:14.836180, lng:76.377266},
  {id:"AP-17",    type:"tower",    lat:14.835824, lng:76.379252},
  {id:"17/1",     type:"tower",    lat:14.835810, lng:76.381659},
  {id:"17/2",     type:"tower",    lat:14.835804, lng:76.384066},
  {id:"AP-17A",   type:"tower",    lat:14.835790, lng:76.386472},
  {id:"17A/1",    type:"tower",    lat:14.835784, lng:76.388879},
  {id:"17A/2",    type:"tower",    lat:14.835770, lng:76.391332},
  {id:"AP-17B",   type:"tower",    lat:14.835764, lng:76.393692},
  {id:"17B/1",    type:"tower",    lat:14.835750, lng:76.396099},
  {id:"AP-17A2",  type:"tower",    lat:14.835744, lng:76.398505},
  {id:"AP-18",    type:"tower",    lat:14.837161, lng:76.400317},
  {id:"AP-18A",   type:"tower",    lat:14.837470, lng:76.403005},
  {id:"AP-18B",   type:"tower",    lat:14.836316, lng:76.404010},
  {id:"AP-19",    type:"tower",    lat:14.835663, lng:76.405929},
  {id:"AP-20",    type:"tower",    lat:14.835973, lng:76.406935},
  {id:"AP-21",    type:"tower",    lat:14.836434, lng:76.408378},
  {id:"AP-22",    type:"tower",    lat:14.837221, lng:76.409740},
  {id:"AP-22A",   type:"tower",    lat:14.837499, lng:76.411665},
  {id:"AP-23",    type:"tower",    lat:14.837829, lng:76.413740},
  {id:"23/1",     type:"tower",    lat:14.836991, lng:76.416317},
  {id:"AP-23A",   type:"tower",    lat:14.836171, lng:76.418867},
  {id:"AP-23B",   type:"tower",    lat:14.835397, lng:76.421241},
  {id:"AP-24",    type:"tower",    lat:14.834268, lng:76.423966},
  {id:"AP-25",    type:"tower",    lat:14.833297, lng:76.426022},
  {id:"AP-25A",   type:"tower",    lat:14.833252, lng:76.427564},
  {id:"AP-26",    type:"tower",    lat:14.833183, lng:76.429970},
  {id:"AP-27",    type:"tower",    lat:14.832729, lng:76.431761},
  {id:"AP-27A",   type:"tower",    lat:14.834405, lng:76.433909},
  {id:"AP-27B",   type:"tower",    lat:14.835841, lng:76.435665},
  {id:"AP-28",    type:"tower",    lat:14.837239, lng:76.437496},
  {id:"AP-28A",   type:"tower",    lat:14.838041, lng:76.439332},
  {id:"AP-29",    type:"tower",    lat:14.838788, lng:76.441306},
  {id:"AP-30",    type:"tower",    lat:14.839770, lng:76.441917},
  {id:"AP-30A",   type:"tower",    lat:14.839995, lng:76.443415},
  {id:"AP-31",    type:"tower",    lat:14.840212, lng:76.444903},
  {id:"AP-32",    type:"tower",    lat:14.840801, lng:76.447592},
  {id:"AP-33",    type:"tower",    lat:14.840644, lng:76.449561},
  {id:"AP-34",    type:"tower",    lat:14.840014, lng:76.450523},
  {id:"AP-35",    type:"tower",    lat:14.839700, lng:76.451599},
  {id:"PSS",      type:"terminal", lat:14.839608, lng:76.451821},
];

function rndrMap(){
  if(mapInst){mapInst.remove();mapInst=null;}

  // Helper: turbine icon (uses turbine.png if available, else styled div)
  function mkTurbIcon(col,glow,size=20){
    const hasPng=window._turbinePng; // set by turbine.png if file exists
    if(hasPng){
      return L.divIcon({className:'',html:`<div style="position:relative;width:${size}px;height:${size}px;"><img src="turbine.png" style="width:100%;height:100%;filter:drop-shadow(0 0 4px ${col});"/><div style="position:absolute;bottom:-2px;right:-2px;width:7px;height:7px;background:${col};border-radius:50%;border:1px solid #fff;${glow}"></div></div>`,iconSize:[size,size],iconAnchor:[size/2,size/2]});
    }
    // Fallback: styled turbine symbol
    return L.divIcon({className:'',html:`<div style="background:${col};border:2px solid #fff;border-radius:50%;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;font-size:${Math.round(size*0.6)}px;${glow}cursor:pointer;">⚡</div>`,iconSize:[size,size],iconAnchor:[size/2,size/2]});
  }
  function mkSolarIcon(size=24){
    const hasPng=window._solarPng;
    if(hasPng){
      return L.divIcon({className:'',html:`<img src="solar.png" style="width:${size}px;height:${size}px;filter:drop-shadow(0 0 6px rgba(255,170,0,.7));">`,iconSize:[size,size],iconAnchor:[size/2,size/2]});
    }
    return L.divIcon({className:'',html:`<div style="background:#ffaa00;border:2px solid #fff;border-radius:5px;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;font-size:${Math.round(size*0.55)}px;box-shadow:0 0 10px rgba(255,170,0,.6);">☀️</div>`,iconSize:[size,size],iconAnchor:[size/2,size/2]});
  }

  setTimeout(()=>{
    // Center map to show full 66kV line + WTG area
    mapInst=L.map('sitemap').setView([14.849,76.405],12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(mapInst);

    // ── PSS – square marker ──────────────────────────────────────────────
    const pssLat=14.839608,pssLng=76.451821;
    const pssIcon=L.divIcon({className:'',html:`<div style="width:18px;height:18px;background:#00bcd4;border:2px solid #fff;box-shadow:0 0 12px rgba(0,188,212,.7);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff;">P</div>`,iconSize:[18,18],iconAnchor:[9,9]});
    L.marker([pssLat,pssLng],{icon:pssIcon}).addTo(mapInst)
      .bindPopup(`<b>🏭 PSS – Power Sub Station</b><br>UTM E:656212 N:1641093<br>66kV Line Termination<br>Progress: ${calcPssPct()}%`);

    // PSS square boundary (approx 100m box)
    const d=0.0005;
    L.rectangle([[pssLat-d,pssLng-d],[pssLat+d,pssLng+d]],{color:'#00bcd4',weight:2,fillOpacity:0.15,dashArray:'4,2'}).addTo(mapInst)
      .bindPopup('<b>🏭 PSS Compound</b>');

    // ── GSS – square marker ──────────────────────────────────────────────
    const gssLat=14.862627,gssLng=76.357685;
    const gssIcon=L.divIcon({className:'',html:`<div style="width:18px;height:18px;background:#8bc34a;border:2px solid #fff;box-shadow:0 0 12px rgba(139,195,74,.7);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff;">G</div>`,iconSize:[18,18],iconAnchor:[9,9]});
    L.marker([gssLat,gssLng],{icon:gssIcon}).addTo(mapInst)
      .bindPopup(`<b>⚡ GSS – Grid Sub Station</b><br>UTM E:646066 N:1643576<br>66kV Line Origin<br>Progress: ${calcGssPct()}%`);
    L.rectangle([[gssLat-d,gssLng-d],[gssLat+d,gssLng+d]],{color:'#8bc34a',weight:2,fillOpacity:0.15,dashArray:'4,2'}).addTo(mapInst)
      .bindPopup('<b>⚡ GSS Compound</b>');

    // ── 66kV EHV Line – polyline through all towers ─────────────────────
    const lineCoords=EHV_66KV_TOWERS.map(t=>[t.lat,t.lng]);
    L.polyline(lineCoords,{color:'#ff9800',weight:2.5,opacity:.85}).addTo(mapInst)
      .bindPopup('<b>🔌 66kV EHV Line – PSS to GSS</b><br>Total Length: 12.75 km<br>65 Towers + 7 Gantries');

    // ── Individual 66kV tower markers ───────────────────────────────────
    EHV_66KV_TOWERS.forEach(tw=>{
      if(tw.type==='terminal') return; // PSS/GSS already marked
      const isGantry=tw.type==='gantry';
      const col=isGantry?'#ff9800':'#ffd54f';
      const size=isGantry?14:10;
      const ic=L.divIcon({className:'',html:`<div style="width:${size}px;height:${size}px;background:${col};border:1.5px solid #fff;${isGantry?'border-radius:3px;':'border-radius:50%;'}opacity:.9;"></div>`,iconSize:[size,size],iconAnchor:[size/2,size/2]});
      L.marker([tw.lat,tw.lng],{icon:ic}).addTo(mapInst)
        .bindPopup(`<b>🔌 ${tw.id}</b><br>Type: ${tw.type}<br>Lat: ${tw.lat.toFixed(6)}<br>Lng: ${tw.lng.toFixed(6)}`);
    });

    // ── Solar ITC-1 (exact coord) ────────────────────────────────────────
    L.marker([14.832892,76.468903],{icon:mkSolarIcon(26)}).addTo(mapInst)
      .bindPopup(`<b>☀️ ITC-1 – 13.2MW</b><br>Progress: ${calcITCProg('ITC-1')}%<br>Piling: 99.5% | MMS: 51.3%`);

    // ── WTG turbine markers ──────────────────────────────────────────────
    const WTG_COORDS=[
      {id:'MBI-12',  lat:14.7426, lng:76.4535},
      {id:'MKD-258', lat:14.7274, lng:76.4779},
      {id:'KDK-462', lat:14.7419, lng:76.4657},
      {id:'MOB-403', lat:14.8576, lng:76.3799},
      {id:'BDK-85',  lat:14.8767, lng:76.3509},
      {id:'MKD-253', lat:14.7255, lng:76.4843},
      {id:'AMK-264', lat:14.8710, lng:76.4035},
      {id:'CDP-221', lat:14.8215, lng:76.4113},
      {id:'MOB-142', lat:14.8661, lng:76.4045},
      {id:'MKD-211', lat:14.7328, lng:76.4889},
      {id:'BDK-165', lat:14.8686, lng:76.3643},
      {id:'BLK-400', lat:14.7047, lng:76.4570},
      {id:'CDP-193', lat:14.8172, lng:76.4066},
      {id:'MKD-52',  lat:14.7424, lng:76.4861},
      {id:'BDK-25',  lat:14.8630, lng:76.3446},
    ];
    const cm={ready:'#00e676',casting:'#00c8ff',wip:'#ffca28',row:'#ff5252',pending:'#4a6a8a',delayed:'#ff9800'};
    WTG_COORDS.forEach(c=>{
      const t=DB.wtg.turbines.find(x=>x.id===c.id);
      const p=t?calcTurbProg(t):0;
      const col=cm[t?.status||'pending'];
      const glow=t?.status==='wip'||t?.status==='casting'?`box-shadow:0 0 8px ${col};`:'';
      L.marker([c.lat,c.lng],{icon:mkTurbIcon(col,glow,22)}).addTo(mapInst)
        .bindPopup(`<b>🌬️ ${c.id}</b><br>Progress: ${p}%<br>Status: <b>${(t?.status||'pending').toUpperCase()}</b><br>LP: ${t?.lp?'✅':'⏳'} | PP: ${t?.pp?'✅':'⏳'}<br>${t?.notes||''}`);
    });
    // Remaining LOC turbines (spread)
    [13,14,15,16,17,18,19,20,21,22,23,24,25,26].forEach((n,i)=>{
      const lat=14.72+Math.sin(i*0.7)*0.05,lng=76.35+Math.cos(i*0.7)*0.06;
      L.marker([lat,lng],{icon:mkTurbIcon('#4a6a8a','',16)}).addTo(mapInst)
        .bindPopup(`<b>🌬️ LOC-${n}</b><br>Status: PENDING`);
    });

    // ── 33kV line approximate route ──────────────────────────────────────
    L.polyline([[14.82,76.41],[14.84,76.42],[14.86,76.43],[14.88,76.44]],{color:'#9c27b0',weight:2,dashArray:'8,4',opacity:.8}).addTo(mapInst)
      .bindPopup('<b>🔋 33kV – SPDC Line (13km)</b>');

    // Add legend control
    const legend=L.control({position:'bottomright'});
    legend.onAdd=function(){
      const d=L.DomUtil.create('div','');
      d.style.cssText='background:rgba(7,16,31,.9);border:1px solid #1a2e4a;border-radius:8px;padding:8px 10px;font-size:9px;color:#8aaccf;line-height:1.7;';
      d.innerHTML=`<b style="color:#ddeeff;font-size:10px;">Map Legend</b><br>
        <span style="color:#ff9800;">━━</span> 66kV EHV Line<br>
        <span style="color:#9c27b0;">╌╌</span> 33kV Line<br>
        <span style="color:#ffd54f;">●</span> 66kV Tower<br>
        <span style="color:#ff9800;">■</span> Gantry Tower<br>
        <span style="color:#00bcd4;">■</span> PSS &nbsp;&nbsp;<span style="color:#8bc34a;">■</span> GSS<br>
        <span style="color:#00e676;">●</span> WTG Ready &nbsp;<span style="color:#ffca28;">●</span> WIP<br>
        <span style="color:#ff5252;">●</span> ROW Hold &nbsp;<span style="color:#ffaa00;">☀</span> Solar ITC`;
      return d;
    };
    legend.addTo(mapInst);
  },280);
}

// ═══════════════════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════════════════
function reqLogin(role,cb){
  if(CU&&(CU.role===role||CU.role==='all')){cb();return;}
  LCB=cb;LR=role;
  const ico={solar:'☀️',wtg:'🌬️',bop:'⚙️',all:'🔐'};
  document.getElementById('l-i').textContent=ico[role]||'🔐';
  document.getElementById('l-t').textContent={solar:'Solar Engineer',wtg:'WTG Engineer',bop:'BOP Engineer',all:'Site Manager'}[role]+' Login';
  document.getElementById('l-s').textContent="Today's Progress requires "+role.toUpperCase()+" authorization";
  document.getElementById('l-u').value='';document.getElementById('l-p').value='';document.getElementById('l-e').textContent='';
  document.getElementById('lw').style.display='flex';
}
function doLogin(){const u=document.getElementById('l-u').value.trim();const p=document.getElementById('l-p').value;const usr=USERS[u];if(usr&&usr.pwd===p&&(usr.role===LR||usr.role==='all')){CU={...usr,uid:u};document.getElementById('lw').style.display='none';if(LCB)LCB();}else document.getElementById('l-e').textContent='❌ Invalid credentials.';}
function closeLW(){document.getElementById('lw').style.display='none';}

// MODALS
function ov(id){document.getElementById(id)?.classList.add('open');}
function cov(id){document.getElementById(id)?.classList.remove('open');}
// Modal listeners wired in loader.js after partials are injected

// UI
let sbOpen=true;
function toggleSB(){sbOpen=!sbOpen;document.getElementById('sb').classList.toggle('col',!sbOpen);document.getElementById('mn').classList.toggle('wide',!sbOpen);}
let dark=true;
function toggleTheme(){dark=!dark;document.documentElement.setAttribute('data-theme',dark?'':'light');document.getElementById('th-i').textContent=dark?'🌙':'☀️';rndr(CV,{});}

// Open WTG progress form for a specific turbine (from right panel)
function openWtgProgFor(id){
  openWtgProg(id);
}

// ═══════════════════════════════════════════════════════════
//  EXPORT EXCEL
// ═══════════════════════════════════════════════════════════
function exportExcel(){
  // Build CSV content (universal — opens in Excel)
  const now=new Date().toLocaleDateString('en-GB');
  let csv='CONTINUUM GREEN ENERGY – SWPPL 140MW Hybrid EPC Dashboard Export\n';
  csv+=`Export Date,${now}\n\n`;

  // Overall KPIs
  csv+='MODULE,PROGRESS %\n';
  csv+=`Overall,${calcOverall()}%\n`;
  csv+=`Solar,${calcSolarProg()}%\n`;
  csv+=`WTG,${calcWtgProg()}%\n`;
  csv+=`Land,${calcLandProg()}%\n`;
  csv+=`BOP,${calcBopProg()}%\n\n`;

  // Solar ITCs
  csv+='SOLAR ITCs\nITC,MW,Progress %\n';
  Object.entries(DB.solar.itcs).forEach(([id,d])=>csv+=`${id},${d.mw},${calcITCProg(id)}%\n`);
  csv+='\n';

  // WTG Turbines
  csv+='WTG TURBINES\nID,Status,LP,PP,Overall %\n';
  DB.wtg.turbines.forEach(t=>csv+=`${t.id},${t.status},${t.lp?'Yes':'No'},${t.pp?'Yes':'No'},${calcTurbProg(t)}%\n`);
  csv+='\n';

  // ROW Issues
  csv+='ROW ISSUES\nLocation,Type,Issue,Opened,Duration\n';
  DB.rowIssues.forEach(r=>csv+=`${r.loc},${r.type},"${r.issue}",${r.opened},${rowDuration(r.opened)}\n`);

  // Download
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='SWPPL_EPC_Dashboard_'+now.replace(/\//g,'-')+'.csv';
  document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);
  showToast('📊 Excel export downloaded!','ok');
}

// INIT: handled by js/loader.js
