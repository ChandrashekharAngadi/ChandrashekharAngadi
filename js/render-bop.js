//  BOP
// ═══════════════════════════════════════════════════════════
function rndrBop(){
  const b33=calcBop33PctV2(),b66=calcBop66PctV2(),pss=calcPssPct(),gss=calcGssPct(),tot=calcBopProg();
  document.getElementById('bop-kr').innerHTML=`
    <div class="kpi"><div class="kb" style="background:var(--bop)"></div><div class="kl">BOP Overall</div><div class="kv" style="color:var(--bop)">${tot}%</div></div>
    <div class="kpi"><div class="kb" style="background:var(--kv3)"></div><div class="kl">33kV Lines</div><div class="kv" style="color:var(--kv3)">${b33}%</div></div>
    <div class="kpi"><div class="kb" style="background:var(--kv6)"></div><div class="kl">66kV Towers</div><div class="kv" style="color:var(--kv6)">${b66}%</div></div>
    <div class="kpi"><div class="kb" style="background:var(--pss)"></div><div class="kl">PSS</div><div class="kv" style="color:var(--pss)">${pss}%</div></div>
    <div class="kpi"><div class="kb" style="background:var(--gss)"></div><div class="kl">GSS</div><div class="kv" style="color:var(--gss)">${gss}%</div></div>`;
  // Update BOP section badge pcts
  [['bop33-pct','bop33-bar',b33,'var(--kv3)'],['bop66-pct','bop66-bar',b66,'var(--kv6)'],['boppss-pct','boppss-bar',pss,'var(--pss)'],['bopgss-pct','bopgss-bar',gss,'var(--gss)']].forEach(([p,b,v,c])=>{const pe=document.getElementById(p);if(pe)pe.textContent=v+'%';const be=document.getElementById(b);if(be){be.style.width=v+'%';be.style.background=c;}});
  setTimeout(()=>mkC('ch-bop-sec',{type:'bar',data:{labels:['33kV Lines','66kV Towers','PSS','GSS'],datasets:[{label:'Progress %',data:[b33,b66,pss,gss],backgroundColor:['rgba(156,39,176,.75)','rgba(255,152,0,.75)','rgba(0,188,212,.75)','rgba(139,195,74,.75)'],borderRadius:5}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:0,max:100,ticks:{callback:v=>v+'%'}}}}}),80);
}
function rndrBopSec(sec){
  const SM={
    '33kv':{label:'33 kV Lines',color:'var(--kv3)',icon:'🔋',render:rndr33kv},
    '66kv':{label:'66 kV Towers',color:'var(--kv6)',icon:'🔌',render:rndr66kv},
    'pss': {label:'PSS',color:'var(--pss)',icon:'🏭',render:rndrPSS},
    'gss': {label:'GSS',color:'var(--gss)',icon:'⚡',render:rndrGSS},
  };
  const s=SM[sec];if(!s)return;
  const el=document.getElementById('bop-'+sec+'-ct');if(!el)return;
  el.innerHTML=`<div class="bk" onclick="nav('bop')">← BOP</div>
    <div class="ph"><div class="pht" style="color:${s.color}">${s.icon} ${s.label}</div></div>
    <div id="bop-sec-body-${sec}"></div>`;
  s.render(sec);
}
function rndr33kv(sec){
  const el=document.getElementById('bop-sec-body-'+sec);if(!el)return;
  const lines=DB.bop33.lines;
  const defs=DB.bopActDefs['33kv'];
  // Overall KPIs
  el.innerHTML=`<div class="kr">${lines.map(l=>{const p=calcBopLinePct('33kv',l.id);return`
    <div class="kpi"><div class="kb" style="background:var(--kv3)"></div><div class="kl">${l.id} Line</div><div class="kv" style="color:var(--kv3)">${p}%</div><div class="km">${l.km}km | ROW: ${l.row} | MP: ${l.mp}</div></div>`;}).join('')}
    <div class="kpi"><div class="kb" style="background:var(--kv3)"></div><div class="kl">Section Overall</div><div class="kv" style="color:var(--kv3)">${calcBop33PctV2()}%</div></div>
  </div>
  <div class="stabs" id="tabs-33kv">${lines.map((l,i)=>`<div class="stb ${i===0?'on-b':''}" id="tab33-${l.id.replace(/\s/g,'_')}" onclick="show33Line('${l.id}')">${l.id} Line (${l.km}km)</div>`).join('')}</div>
  <div id="content-33kv"></div>`;
  show33Line(lines[0].id);
}
function show33Line(lineId){
  DB.bop33.lines.forEach(l=>{
    const el=document.getElementById('tab33-'+l.id.replace(/\s/g,'_'));
    if(el)el.className='stb'+(l.id===lineId?' on-b':'');
  });
  const line=DB.bop33.lines.find(l=>l.id===lineId);
  const defs=DB.bopActDefs['33kv'];
  const acts=DB.bopActs['33kv'][lineId]||defs.map(()=>0);
  const p=calcBopLinePct('33kv',lineId);
  const el=document.getElementById('content-33kv');if(!el)return;
  const detId='det-33-'+lineId.replace(/\s/g,'_');
  el.innerHTML=`<div class="pnl">
    <div class="ph2">
      <div class="pt">🔋 ${lineId} Line — ${line.km}km | ${p}% Complete</div>
      <button class="btn btbo bts" onclick="reqLogin('bop',()=>open33LineProg('${lineId}'))">📊 Today's Progress</button>
    </div>
    <div class="g2" style="margin-bottom:11px;">
      <div><div class="ch h200"><canvas id="ch33-pie-${lineId.replace(/\s/g,'_')}"></canvas></div></div>
      <div>
        <div class="ir"><div class="irl">Route Length</div><div class="irr">${line.km} km</div></div>
        <div class="ir"><div class="irl">ROW Issues</div><div class="irr"><span class="chip cr">${line.row}</span></div></div>
        <div class="ir"><div class="irl">Manpower</div><div class="irr">${line.mp}</div></div>
        <div class="ir"><div class="irl">Vendor</div><div class="irr">${line.vendor||'TBD'}</div></div>
        <div class="ir"><div class="irl">Poles Scope/Done</div><div class="irr">${line.poles.done}/${line.poles.scope}</div></div>
        <div class="ir"><div class="irl">Stringing Done</div><div class="irr">${line.stringing.done}/${line.stringing.scope} km</div></div>
      </div>
    </div>
    <div style="font-family:var(--f2);font-size:11px;font-weight:600;margin-bottom:8px;">📋 All Activities — Click for detail</div>
    <div class="actg" id="actg-33-${lineId.replace(/\s/g,'_')}"></div>
    <div id="${detId}"></div>
  </div>`;
  setTimeout(()=>{
    const g=document.getElementById('actg-33-'+lineId.replace(/\s/g,'_'));if(!g)return;
    g.innerHTML=defs.map((d,i)=>{const v=acts[i]||0;const bal=100-v;return`<div class="actc" onclick="show33ActDet('${lineId}',${i})">
      <div style="display:flex;justify-content:space-between;margin-bottom:5px;"><div class="actc-nm">${d.n}</div><div class="actc-pct" style="color:${d.col}">${v}%</div></div>
      <div class="actc-bar"><div class="actc-fill" style="width:${v}%;background:${d.col}"></div></div>
      <div class="mst"><div class="ms">W:<b>${d.w}%</b></div><div class="ms">Done:<b style="color:var(--ok)">${v}%</b></div><div class="ms">Bal:<b style="color:var(--er)">${bal}%</b></div></div>
      <div class="actc-hint">Click →</div>
    </div>`;}).join('');
    const cid='ch33-pie-'+lineId.replace(/\s/g,'_');
    mkC(cid,{type:'doughnut',data:{labels:['Done','Remaining'],datasets:[{data:[p,100-p],backgroundColor:['rgba(156,39,176,.8)','rgba(26,46,74,.55)'],borderWidth:0,cutout:'70%'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:9}}},tooltip:{callbacks:{label:ctx=>` ${ctx.label}: ${ctx.raw}%`}}}}});
  },80);
}
function show33ActDet(lineId,idx){
  const defs=DB.bopActDefs['33kv'];const d=defs[idx];
  const acts=DB.bopActs['33kv'][lineId]||defs.map(()=>0);
  const v=acts[idx]||0;const bal=100-v;
  const detId='det-33-'+lineId.replace(/\s/g,'_');
  const el=document.getElementById(detId);if(!el)return;
  const cid='ch-33det-'+lineId.replace(/\s/g,'_')+'_'+idx;
  el.innerHTML=`<div class="det">
    <div style="display:flex;justify-content:space-between;margin-bottom:9px;">
      <div><div style="font-family:var(--f2);font-size:14px;font-weight:700;color:${d.col}">${d.n}</div><div style="font-size:8px;color:var(--t3);">${lineId} | Weight: ${d.w}%</div></div>
      <button onclick="document.getElementById('${detId}').innerHTML=''" style="background:none;border:1px solid var(--b1);color:var(--t3);width:22px;height:22px;border-radius:5px;cursor:pointer;font-size:10px;">✕</button>
    </div>
    <div class="g4" style="margin-bottom:9px;">
      <div class="kpi" style="padding:8px;"><div class="kl">Done</div><div class="kv" style="font-size:16px;color:var(--ok)">${v}%</div></div>
      <div class="kpi" style="padding:8px;"><div class="kl">Remaining</div><div class="kv" style="font-size:16px;color:var(--er)">${bal}%</div></div>
      <div class="kpi" style="padding:8px;"><div class="kl">Weight</div><div class="kv" style="font-size:16px;color:${d.col}">${d.w}%</div></div>
      <div class="kpi" style="padding:8px;"><div class="kl">Status</div><div class="kv" style="font-size:13px;">${v>=100?'<span class="chip cg">✔ Done</span>':v>0?'<span class="chip cy">🟡 WIP</span>':'<span class="chip cr">🔴 Pending</span>'}</div></div>
    </div>
    <div class="g2"><div class="ch h160"><canvas id="${cid}"></canvas></div>
    <div><div class="ir"><div class="irl">Activity</div><div class="irr">${d.n}</div></div><div class="ir"><div class="irl">Line</div><div class="irr">${lineId}</div></div><div class="ir"><div class="irl">Done</div><div class="irr" style="color:var(--ok)">${v}%</div></div><div class="ir"><div class="irl">Balance</div><div class="irr" style="color:var(--er)">${bal}%</div></div></div></div>
  </div>`;
  setTimeout(()=>mkC(cid,{type:'doughnut',data:{labels:['Done','Remaining'],datasets:[{data:[v,bal],backgroundColor:[d.col,'rgba(26,46,74,.65)'],borderWidth:0,cutout:'70%'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:9}}}}}}),45);
  el.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function open33LineProg(lineId){
  const defs=DB.bopActDefs['33kv'];
  document.getElementById('p-t').textContent='📊 33kV '+lineId+' – Progress Entry';
  document.getElementById('p-b').innerHTML=`<form onsubmit="submit33LineActProg(event,'${lineId}')">
    <div class="al al-w" style="margin-bottom:9px;">⚠️ Authorized entry. Updates live calculations.</div>
    <div class="fr"><div class="fg"><label class="fl">Activity</label><select class="fs" id="p33l-act">${defs.map((d,i)=>`<option value="${i}">${d.n} (${DB.bopActs['33kv'][lineId]?.[i]||0}%)</option>`).join('')}</select></div>
    <div class="fg"><label class="fl">New Cumulative %</label><input class="fi" id="p33l-cum" type="number" min="0" max="100" step="0.1" placeholder="New total %" required></div></div>
    <div class="fr"><div class="fg"><label class="fl">Today's Progress %</label><input class="fi" id="p33l-td" type="number" min="0" max="100" step="0.1" placeholder="e.g. 5"></div>
    <div class="fg"><label class="fl">Manpower</label><input class="fi" id="p33l-mp" type="number" min="0" placeholder="Workers" required></div></div>
    <div class="fg"><label class="fl">ROW Issues</label><input class="fi" id="p33l-row" type="number" min="0" placeholder="0"></div>
    <div class="fg"><label class="fl">Remarks</label><textarea class="fta" id="p33l-rem" placeholder="Notes..."></textarea></div>
    <div style="display:flex;gap:7px;margin-top:7px;"><button type="button" class="btn" style="flex:1;" onclick="cov('pov')">Cancel</button><button type="submit" class="btn btbo" style="flex:1;">✅ Submit</button></div>
  </form>`;ov('pov');
}
function submit33LineActProg(e,lineId){
  e.preventDefault();
  const idx=+document.getElementById('p33l-act').value;
  const cum=+document.getElementById('p33l-cum').value;
  const mp=+document.getElementById('p33l-mp').value;
  const row=document.getElementById('p33l-row').value;
  if(!DB.bopActs['33kv'][lineId])DB.bopActs['33kv'][lineId]=DB.bopActDefs['33kv'].map(()=>0);
  DB.bopActs['33kv'][lineId][idx]=Math.min(100,cum);
  // Also sync legacy poles/stringing
  const line=DB.bop33.lines.find(l=>l.id===lineId);
  if(line){if(idx===3)line.poles.done=Math.round(cum/100*line.poles.scope);if(idx===4)line.stringing.done=R(cum/100*line.stringing.scope);if(row)line.row=+row;line.mp=mp;}
  DB.mp.bop+=mp;updateKpiMp();cov('pov');
  alert(`✅ 33kV ${lineId} Progress Saved!\n${DB.bopActDefs['33kv'][idx].n}: ${cum}%`);
  updateOverallBars();rndrBopSec('33kv');
}
function rndr66kv(sec){
  const el=document.getElementById('bop-sec-body-'+sec);if(!el)return;
  const vendors=DB.bop66.vendors;
  const defs=DB.bopActDefs['66kv'];
  const totDone=vendors.reduce((s,v)=>s+v.towers.done,0);

  // Tower count from Excel: 65 AP/intermediate towers + 7 gantries = 72 structures, 66 billable towers
  const towerRows=[
    {sl:1,loc:'GANT-1',type:'Gantry',e:646116,n:1643536,span:58,cum:58},
    {sl:2,loc:'AP-1',type:'DD+0',e:646086,n:1643562,span:40,cum:98,dev:"3°39'31\"R"},
    {sl:3,loc:'AP-2',type:'DD+6',e:646298,n:1643501,span:145,cum:243,dev:"46°59'36\"R"},
    {sl:4,loc:'AP-3',type:'DD+0',e:646342,n:1643428,span:85,cum:328,dev:"13°38'8\"L"},
    {sl:5,loc:'GANT-2',type:'Dwarf',e:646367,n:1643402,span:51,cum:379},
    {sl:6,loc:'GANT-3',type:'Dwarf',e:646403,n:1643367,span:35,cum:414},
    {sl:7,loc:'AP-4',type:'DD+0',e:646417,n:1643354,span:24,cum:438,dev:"7°58'4\"L"},
    {sl:8,loc:'AP-5',type:'DD+6',e:646624,n:1643200,span:260,cum:698,dev:"36°2'33\"L"},
    {sl:9,loc:'AP-6',type:'DD+3',e:646908,n:1643197,span:285,cum:983,dev:"53°40'42\"R"},
    {sl:10,loc:'AP-7',type:'DD+0',e:646995,n:1643076,span:150,cum:1133,dev:"39°52'34\"R"},
    {sl:11,loc:'GANT-4',type:'Dwarf',e:646989,n:1643018,span:49,cum:1182},
    {sl:12,loc:'GANT-5',type:'Dwarf',e:646984,n:1642961,span:55,cum:1237},
    {sl:13,loc:'AP-8',type:'DD+3',e:646983,n:1642911,span:66,cum:1303,dev:"22°16'2\"L"},
    {sl:14,loc:'AP-9',type:'DC+3',e:647069,n:1642648,span:280,cum:1583,dev:"7°10'56\"L"},
    {sl:15,loc:'AP-10',type:'DC+3',e:647172,n:1642430,span:245,cum:1828,dev:"11°30'7\"R"},
    {sl:16,loc:'AP-11',type:'DD+0',e:647212,n:1642267,span:170,cum:1998,dev:"43°9'50\"L"},
    {sl:17,loc:'GANT-6',type:'Dwarf',e:647233,n:1642253,span:27,cum:2025},
    {sl:18,loc:'GANT-7',type:'Dwarf',e:647265,n:1642231,span:35,cum:2060},
    {sl:19,loc:'AP-12',type:'DD+0',e:647295,n:1642213,span:38,cum:2098,dev:"31°52'59\"R"},
    {sl:20,loc:'AP-12A',type:'DD+3',e:647384,n:1642017,span:216,cum:2314,dev:"33°15'53\"R"},
    {sl:21,loc:'AP-13',type:'DC+3',e:647362,n:1641877,span:145,cum:2459,dev:"25°15'2\"L"},
    {sl:22,loc:'AP-14',type:'DC+6',e:647505,n:1641395,span:216,cum:2675,dev:"-"},
    {sl:23,loc:'AP-15',type:'DD+3',e:647633,n:1640942,span:265,cum:2940,dev:"1°26'32\"R"},
    {sl:24,loc:'AP-16',type:'DC+6',e:647972,n:1640702,span:240,cum:3180,dev:"41°23'32\"L"},
    {sl:25,loc:'16/1',type:'DA+6',e:648191,n:1640663,span:255,cum:3435,dev:"-"},
    {sl:26,loc:'AP-17',type:'DC+3',e:648405,n:1640625,span:185,cum:3620,dev:"21°16'22\"L"},
    {sl:27,loc:'17/1',type:'DA+6',e:648664,n:1640625,span:240,cum:3860,dev:"-"},
    {sl:28,loc:'17/2',type:'DA+6',e:648923,n:1640626,span:210,cum:4070,dev:"-"},
    {sl:29,loc:'AP-17A',type:'DC+3',e:649182,n:1640626,span:220,cum:4290,dev:"11°39'26\"L"},
    {sl:30,loc:'17A/1',type:'DA+3',e:649441,n:1640627,span:260,cum:4550,dev:"-"},
    {sl:31,loc:'17A/2',type:'DA+3',e:649705,n:1640627,span:260,cum:4810,dev:"-"},
    {sl:32,loc:'AP-17B',type:'DC+3',e:649959,n:1640628,span:260,cum:5070,dev:"0°0'0\""},
    {sl:33,loc:'17B/1',type:'DA+6',e:650218,n:1640628,span:260,cum:5330,dev:"-"},
    {sl:34,loc:'AP-17A2',type:'DD+6',e:650477,n:1640629,span:265,cum:5595,dev:"39°3'0\"L"},
    {sl:35,loc:'AP-18',type:'DD+6',e:650671,n:1640787,span:255,cum:5850,dev:"32°3'36\"R"},
    {sl:36,loc:'AP-18A',type:'DD+3',e:650960,n:1640823,span:285,cum:6110,dev:"56°27'44\"R"},
    {sl:37,loc:'AP-18B',type:'DD+9',e:651069,n:1640696,span:172,cum:6370,dev:"30°25'47\"L"},
    {sl:38,loc:'AP-19',type:'DS',e:651276,n:1640625,span:220,cum:6635,dev:"36°53'16\"L"},
    {sl:39,loc:'AP-20',type:'DS',e:651384,n:1640660,span:116,cum:6920,dev:"0°35'23\"L"},
    {sl:40,loc:'AP-21',type:'DD+12',e:651539,n:1640712,span:170,cum:7092,dev:"12°32'0\"L"},
    {sl:41,loc:'AP-22',type:'DD+12',e:651685,n:1640800,span:175,cum:7312,dev:"21°49'59\"R"},
    {sl:42,loc:'AP-22A',type:'DC+6',e:651892,n:1640832,span:210,cum:7428,dev:"0°0'0\""},
    {sl:43,loc:'AP-23',type:'DD+6',e:652115,n:1640870,span:235,cum:7598,dev:"30°34'48\"R"},
    {sl:44,loc:'23/1',type:'DA+6',e:652393,n:1640779,span:290,cum:7773,dev:"-"},
    {sl:45,loc:'AP-23A',type:'DC+6',e:652668,n:1640690,span:290,cum:7983,dev:"0°0'0\""},
    {sl:46,loc:'AP-23B',type:'DC+6',e:652924,n:1640606,span:290,cum:8218,dev:"0°0'0\""},
    {sl:47,loc:'AP-24',type:'DC+6',e:653218,n:1640483,span:290,cum:8508,dev:"6°11'22\"R"},
    {sl:48,loc:'AP-25',type:'DD+6',e:653440,n:1640377,span:250,cum:8798,dev:"30°10'32\"L"},
    {sl:49,loc:'AP-25A',type:'DD+9',e:653606,n:1640373,span:165,cum:9088,dev:"0°0'0\""},
    {sl:50,loc:'AP-26',type:'DD+9',e:653865,n:1640367,span:260,cum:9378,dev:"12°53'52\"R"},
    {sl:51,loc:'AP-27',type:'DD+9',e:654058,n:1640318,span:200,cum:9628,dev:"53°21'30\"L"},
    {sl:52,loc:'AP-27A',type:'DC+6',e:654288,n:1640505,span:295,cum:9793,dev:"1°20'6\"L"},
    {sl:53,loc:'AP-27B',type:'DC+6',e:654476,n:1640665,span:245,cum:10053,dev:"0°0'0\""},
    {sl:54,loc:'AP-28',type:'DC+6',e:654672,n:1640821,span:245,cum:10253,dev:"16°24'19\"R"},
    {sl:55,loc:'AP-28A',type:'DC+6',e:654869,n:1640911,span:230,cum:10548,dev:"0°0'0\""},
    {sl:56,loc:'AP-29',type:'DD+25',e:655081,n:1640995,span:230,cum:10793,dev:"36°8'41\"L"},
    {sl:57,loc:'AP-30',type:'DD+15',e:655146,n:1641104,span:130,cum:11038,dev:"50°9'49\"R"},
    {sl:58,loc:'AP-30A',type:'DC+6',e:655307,n:1641130,span:165,cum:11268,dev:"0°0'0\""},
    {sl:59,loc:'AP-31',type:'DC+6',e:655467,n:1641155,span:165,cum:11498,dev:"4°1'30\"L"},
    {sl:60,loc:'AP-32',type:'DD+9',e:655756,n:1641222,span:295,cum:11628,dev:"17°22'7\"R"},
    {sl:61,loc:'AP-33',type:'DD+9',e:655968,n:1641206,span:215,cum:11958,dev:"30°8'40\"R"},
    {sl:62,loc:'AP-34',type:'DC+3',e:656072,n:1641137,span:130,cum:12253,dev:"17°3'13\"L"},
    {sl:63,loc:'AP-35',type:'DD+0',e:656188,n:1641103,span:125,cum:12468,dev:"6°12'47\"R"},
    {sl:64,loc:'PSS BAY',type:'Terminal',e:656212,n:1641093,span:30,cum:12753,dev:"-"},
  ];

  el.innerHTML=`<div class="kr">
    <div class="kpi"><div class="kb" style="background:var(--kv6)"></div><div class="kl">Total Towers</div><div class="kv" style="color:var(--kv6)">${DB.bop66.totalTowers}</div></div>
    <div class="kpi"><div class="kb" style="background:var(--ok)"></div><div class="kl">Foundation Done</div><div class="kv" style="color:var(--ok)">${totDone}/${DB.bop66.totalTowers}</div></div>
    <div class="kpi"><div class="kb" style="background:var(--kv6)"></div><div class="kl">Route Length</div><div class="kv" style="color:var(--kv6)">12.75 km</div></div>
    <div class="kpi"><div class="kb" style="background:var(--pss)"></div><div class="kl">PSS → GSS</div><div class="kv" style="font-size:10px;color:var(--pss)">EHV Line</div></div>
    <div class="kpi"><div class="kb" style="background:var(--kv6)"></div><div class="kl">Section Overall</div><div class="kv" style="color:var(--kv6)">${calcBop66PctV2()}%</div></div>
  </div>
  <div class="stabs" id="tabs-66kv">
    ${vendors.map((v,i)=>`<div class="stb ${i===0?'on-b':''}" id="tab66-${v.n.replace(/\s/g,'_')}" onclick="show66Vendor('${v.n}')">${v.n} (${v.towers.scope} towers)</div>`).join('')}
    <div class="stb" id="tab66-towertable" onclick="show66TowerTable()">📋 All Towers (${towerRows.length})</div>
  </div>
  <div id="content-66kv"></div>
  <div id="tower-table-66kv" style="display:none;">
    <div class="pnl" style="margin-top:11px;">
      <div class="ph2"><div class="pt">📋 66kV EHV Line – Complete Tower Schedule (GSS → PSS)</div><span class="chip cb">12.753 km | Zone 43P UTM</span></div>
      <div class="tsc"><table class="tbl">
        <thead><tr><th>#</th><th>Location</th><th>Tower Type</th><th>Deviation</th><th>Span (m)</th><th>Cum.(m)</th><th>Easting</th><th>Northing</th><th>Status</th></tr></thead>
        <tbody>
          ${towerRows.map(r=>{
            const isGantry=r.type.toLowerCase().includes('gantry')||r.type.toLowerCase().includes('dwarf')||r.loc.startsWith('GANT');
            const isTerminal=r.type==='Terminal';
            const col=isTerminal?'var(--pss)':isGantry?'var(--kv6)':'var(--t2)';
            return`<tr>
              <td>${r.sl}</td>
              <td><b style="color:${col}">${r.loc}</b></td>
              <td><span class="chip ${isTerminal?'cb':isGantry?'cy':'cr'}" style="font-size:7px;">${r.type}</span></td>
              <td style="font-size:9px;color:var(--t3);">${r.dev||'—'}</td>
              <td>${r.span}</td>
              <td>${r.cum}</td>
              <td style="font-size:9px;color:var(--t3);">${r.e}</td>
              <td style="font-size:9px;color:var(--t3);">${r.n}</td>
              <td><span class="chip cr">Pending</span></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table></div>
    </div>
  </div>`;
  show66Vendor(vendors[0].n);
}
function show66TowerTable(){
  // Toggle tabs
  document.querySelectorAll('#tabs-66kv .stb').forEach(el=>el.className='stb');
  const ttab=document.getElementById('tab66-towertable');if(ttab)ttab.className='stb on-b';
  const ct=document.getElementById('content-66kv');if(ct)ct.style.display='none';
  const tt=document.getElementById('tower-table-66kv');if(tt)tt.style.display='block';
}
function show66Vendor(vendorN){
  // Hide tower table, show vendor content
  const tt=document.getElementById('tower-table-66kv');if(tt)tt.style.display='none';
  const ct=document.getElementById('content-66kv');if(ct)ct.style.display='';
  DB.bop66.vendors.forEach(v=>{
    const el=document.getElementById('tab66-'+v.n.replace(/\s/g,'_'));
    if(el)el.className='stb'+(v.n===vendorN?' on-b':'');
  });
  const vendor=DB.bop66.vendors.find(v=>v.n===vendorN);
  const defs=DB.bopActDefs['66kv'];
  const acts=DB.bopActs['66kv'][vendorN]||defs.map(()=>0);
  const p=calcBopLinePct('66kv',vendorN);
  const el=document.getElementById('content-66kv');if(!el)return;
  const detId='det-66-'+vendorN.replace(/\s/g,'_');
  el.innerHTML=`<div class="pnl">
    <div class="ph2">
      <div class="pt">🔌 ${vendorN} — ${vendor.towers.scope} Towers | ${p}% Complete</div>
      <button class="btn btbo bts" onclick="reqLogin('bop',()=>open66VendorProg('${vendorN}'))">📊 Today's Progress</button>
    </div>
    <div class="g2" style="margin-bottom:11px;">
      <div><div class="ch h200"><canvas id="ch66-pie-${vendorN.replace(/\s/g,'_')}"></canvas></div></div>
      <div>
        <div class="ir"><div class="irl">Total Towers</div><div class="irr">${vendor.towers.scope}</div></div>
        <div class="ir"><div class="irl">Foundation Done</div><div class="irr" style="color:var(--ok)">${vendor.towers.done}</div></div>
        <div class="ir"><div class="irl">Stringing Done</div><div class="irr">${vendor.stringing.done}/${vendor.stringing.scope} km</div></div>
        <div class="ir"><div class="irl">Vendor</div><div class="irr">${vendorN}</div></div>
      </div>
    </div>
    <div style="font-family:var(--f2);font-size:11px;font-weight:600;margin-bottom:8px;">📋 All Activities — Click for detail</div>
    <div class="actg" id="actg-66-${vendorN.replace(/\s/g,'_')}"></div>
    <div id="${detId}"></div>
  </div>`;
  setTimeout(()=>{
    const g=document.getElementById('actg-66-'+vendorN.replace(/\s/g,'_'));if(!g)return;
    g.innerHTML=defs.map((d,i)=>{const v=acts[i]||0;const bal=100-v;return`<div class="actc" onclick="show66ActDet('${vendorN}',${i})">
      <div style="display:flex;justify-content:space-between;margin-bottom:5px;"><div class="actc-nm">${d.n}</div><div class="actc-pct" style="color:${d.col}">${v}%</div></div>
      <div class="actc-bar"><div class="actc-fill" style="width:${v}%;background:${d.col}"></div></div>
      <div class="mst"><div class="ms">W:<b>${d.w}%</b></div><div class="ms">Done:<b style="color:var(--ok)">${v}%</b></div><div class="ms">Bal:<b style="color:var(--er)">${bal}%</b></div></div>
      <div class="actc-hint">Click →</div>
    </div>`;}).join('');
    const cid='ch66-pie-'+vendorN.replace(/\s/g,'_');
    mkC(cid,{type:'doughnut',data:{labels:['Done','Remaining'],datasets:[{data:[p,100-p],backgroundColor:['rgba(255,152,0,.8)','rgba(26,46,74,.55)'],borderWidth:0,cutout:'70%'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:9}}}}}});
  },80);
}
function show66ActDet(vendorN,idx){
  const defs=DB.bopActDefs['66kv'];const d=defs[idx];
  const acts=DB.bopActs['66kv'][vendorN]||defs.map(()=>0);
  const v=acts[idx]||0;const bal=100-v;
  const detId='det-66-'+vendorN.replace(/\s/g,'_');
  const el=document.getElementById(detId);if(!el)return;
  const cid='ch-66det-'+vendorN.replace(/\s/g,'_')+'_'+idx;
  el.innerHTML=`<div class="det">
    <div style="display:flex;justify-content:space-between;margin-bottom:9px;">
      <div><div style="font-family:var(--f2);font-size:14px;font-weight:700;color:${d.col}">${d.n}</div><div style="font-size:8px;color:var(--t3);">${vendorN} | Weight: ${d.w}%</div></div>
      <button onclick="document.getElementById('${detId}').innerHTML=''" style="background:none;border:1px solid var(--b1);color:var(--t3);width:22px;height:22px;border-radius:5px;cursor:pointer;font-size:10px;">✕</button>
    </div>
    <div class="g4" style="margin-bottom:9px;">
      <div class="kpi" style="padding:8px;"><div class="kl">Done</div><div class="kv" style="font-size:16px;color:var(--ok)">${v}%</div></div>
      <div class="kpi" style="padding:8px;"><div class="kl">Remaining</div><div class="kv" style="font-size:16px;color:var(--er)">${bal}%</div></div>
      <div class="kpi" style="padding:8px;"><div class="kl">Weight</div><div class="kv" style="font-size:16px;color:${d.col}">${d.w}%</div></div>
      <div class="kpi" style="padding:8px;"><div class="kl">Status</div><div class="kv" style="font-size:13px;">${v>=100?'<span class="chip cg">✔ Done</span>':v>0?'<span class="chip cy">🟡 WIP</span>':'<span class="chip cr">🔴 Pending</span>'}</div></div>
    </div>
    <div class="g2"><div class="ch h160"><canvas id="${cid}"></canvas></div>
    <div><div class="ir"><div class="irl">Activity</div><div class="irr">${d.n}</div></div><div class="ir"><div class="irl">Vendor</div><div class="irr">${vendorN}</div></div><div class="ir"><div class="irl">Done</div><div class="irr" style="color:var(--ok)">${v}%</div></div><div class="ir"><div class="irl">Balance</div><div class="irr" style="color:var(--er)">${bal}%</div></div></div></div>
  </div>`;
  setTimeout(()=>mkC(cid,{type:'doughnut',data:{labels:['Done','Remaining'],datasets:[{data:[v,bal],backgroundColor:[d.col,'rgba(26,46,74,.65)'],borderWidth:0,cutout:'70%'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:9}}}}}}),45);
  el.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function open66VendorProg(vendorN){
  const defs=DB.bopActDefs['66kv'];
  document.getElementById('p-t').textContent='📊 66kV '+vendorN+' – Progress Entry';
  document.getElementById('p-b').innerHTML=`<form onsubmit="submit66VendorActProg(event,'${vendorN}')">
    <div class="al al-w" style="margin-bottom:9px;">⚠️ Authorized entry. Updates live calculations.</div>
    <div class="fr"><div class="fg"><label class="fl">Activity</label><select class="fs" id="p66v-act">${defs.map((d,i)=>`<option value="${i}">${d.n} (${DB.bopActs['66kv'][vendorN]?.[i]||0}%)</option>`).join('')}</select></div>
    <div class="fg"><label class="fl">New Cumulative %</label><input class="fi" id="p66v-cum" type="number" min="0" max="100" step="0.1" placeholder="New total %" required></div></div>
    <div class="fr"><div class="fg"><label class="fl">Today's Progress %</label><input class="fi" id="p66v-td" type="number" min="0" max="100" step="0.1" placeholder="e.g. 5"></div>
    <div class="fg"><label class="fl">Manpower</label><input class="fi" id="p66v-mp" type="number" min="0" placeholder="Workers" required></div></div>
    <div class="fg"><label class="fl">Remarks</label><textarea class="fta" id="p66v-rem" placeholder="Notes..."></textarea></div>
    <div style="display:flex;gap:7px;margin-top:7px;"><button type="button" class="btn" style="flex:1;" onclick="cov('pov')">Cancel</button><button type="submit" class="btn btbo" style="flex:1;">✅ Submit</button></div>
  </form>`;ov('pov');
}
function submit66VendorActProg(e,vendorN){
  e.preventDefault();
  const idx=+document.getElementById('p66v-act').value;
  const cum=+document.getElementById('p66v-cum').value;
  const mp=+document.getElementById('p66v-mp').value;
  if(!DB.bopActs['66kv'][vendorN])DB.bopActs['66kv'][vendorN]=DB.bopActDefs['66kv'].map(()=>0);
  DB.bopActs['66kv'][vendorN][idx]=Math.min(100,cum);
  // Sync legacy
  const vendor=DB.bop66.vendors.find(v=>v.n===vendorN);
  if(vendor&&idx===2)vendor.towers.done=Math.round(cum/100*vendor.towers.scope);
  if(vendor&&idx===4)vendor.stringing.done=R(cum/100*vendor.stringing.scope);
  DB.mp.bop+=mp;updateKpiMp();cov('pov');
  alert(`✅ 66kV ${vendorN} Progress Saved!\n${DB.bopActDefs['66kv'][idx].n}: ${cum}%`);
  updateOverallBars();rndrBopSec('66kv');
}
function rndrPSS(sec){
  const el=document.getElementById('bop-sec-body-'+sec);if(!el)return;
  const acts=DB.pss.acts;const aks=Object.keys(acts);
  el.innerHTML=`<div style="display:flex;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
    <div style="font-family:var(--f2);font-size:12px;font-weight:600;">PSS Activities</div>
    <button class="btn btbo bts" onclick="reqLogin('bop',()=>openPSSProg())">📊 Today's Progress</button>
  </div>
  <div class="actg">${aks.map(nm=>{const a=acts[nm];const pct=R(Math.min(100,a.done/a.scope*100));const bal=R(a.scope-a.done);return`<div class="actc" onclick="showBopAct('pss','${nm.replace(/'/g,"\\'")}')">
    <div style="display:flex;justify-content:space-between;margin-bottom:5px;"><div class="actc-nm">${nm}</div><div class="actc-pct" style="color:${a.col}">${pct}%</div></div>
    <div class="actc-bar"><div class="actc-fill" style="width:${pct}%;background:${a.col}"></div></div>
    <div class="mst"><div class="ms">Scope:<b>${a.scope} ${a.unit}</b></div><div class="ms">Done:<b style="color:var(--ok)">${a.done}</b></div><div class="ms">Bal:<b style="color:var(--er)">${bal}</b></div></div>
    <div class="actc-hint">Click →</div>
  </div>`;}).join('')}
  </div>
  <div class="pnl" style="margin-top:11px;"><div class="ph2"><div class="pt">📊 PSS Progress</div></div><div class="ch h240"><canvas id="ch-pss"></canvas></div></div>`;
  setTimeout(()=>{const pcts=aks.map(nm=>R(Math.min(100,acts[nm].done/acts[nm].scope*100)));mkC('ch-pss',{type:'bar',data:{labels:aks.map(k=>k.substr(0,16)),datasets:[{label:'%',data:pcts,backgroundColor:aks.map(k=>acts[k].col+'cc'),borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:0,max:100,ticks:{callback:v=>v+'%'}}}}});},80);
}
function rndrGSS(sec){
  const el=document.getElementById('bop-sec-body-'+sec);if(!el)return;
  const acts=DB.gss.acts;const aks=Object.keys(acts);
  el.innerHTML=`<div style="display:flex;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
    <div style="font-family:var(--f2);font-size:12px;font-weight:600;">GSS Activities</div>
    <button class="btn btbo bts" onclick="reqLogin('bop',()=>openGSSProg())">📊 Today's Progress</button>
  </div>
  <div class="actg">${aks.map(nm=>{const a=acts[nm];const pct=R(Math.min(100,a.done/a.scope*100));return`<div class="actc">
    <div style="display:flex;justify-content:space-between;margin-bottom:5px;"><div class="actc-nm">${nm}</div><div class="actc-pct" style="color:${a.col}">${pct}%</div></div>
    <div class="actc-bar"><div class="actc-fill" style="width:${pct}%;background:${a.col}"></div></div>
    <div class="mst"><div class="ms">Scope:<b>${a.scope} ${a.unit}</b></div><div class="ms">Done:<b style="color:var(--ok)">${a.done}</b></div></div>
  </div>`;}).join('')}
  </div>
  <div class="pnl" style="margin-top:11px;"><div class="ph2"><div class="pt">📊 GSS Progress</div></div><div class="ch h240"><canvas id="ch-gss"></canvas></div></div>`;
  setTimeout(()=>{const pcts=aks.map(nm=>R(Math.min(100,acts[nm].done/acts[nm].scope*100)));mkC('ch-gss',{type:'bar',data:{labels:aks,datasets:[{label:'%',data:pcts,backgroundColor:aks.map(k=>acts[k].col+'cc'),borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:0,max:100,ticks:{callback:v=>v+'%'}}}}});},80);
}
function showBopAct(secKey,nm){
  const acts=secKey==='pss'?DB.pss.acts:DB.gss.acts;
  const a=acts[nm];if(!a)return;
  const pct=R(Math.min(100,a.done/a.scope*100));const bal=R(a.scope-a.done);
  ov('tov');
  document.getElementById('t-t').textContent=`⚙️ ${nm}`;
  document.getElementById('t-b').innerHTML=`
    <div class="g4" style="margin-bottom:9px;">
      <div class="kpi" style="padding:7px;"><div class="kl">Scope</div><div class="kv" style="font-size:14px;">${a.scope} ${a.unit}</div></div>
      <div class="kpi" style="padding:7px;"><div class="kl">Done</div><div class="kv" style="font-size:14px;color:var(--ok)">${a.done}</div></div>
      <div class="kpi" style="padding:7px;"><div class="kl">Balance</div><div class="kv" style="font-size:14px;color:var(--er)">${bal}</div></div>
      <div class="kpi" style="padding:7px;"><div class="kl">%</div><div class="kv" style="font-size:14px;color:${a.col}">${pct}%</div></div>
    </div>
    <div style="height:7px;background:var(--b1);border-radius:4px;overflow:hidden;"><div style="width:${pct}%;height:100%;background:${a.col};border-radius:4px;"></div></div>`;
}

// (33kV and 66kV progress forms are now inline via open33LineProg / open66VendorProg)
function openPSSProg(){
  document.getElementById('p-t').textContent='📊 PSS Progress';
  document.getElementById('p-b').innerHTML=`<form onsubmit="submitPSSGSSProg(event,'pss')">
    <div class="fr"><div class="fg"><label class="fl">Activity</label><select class="fs" id="ppss-act">${Object.keys(DB.pss.acts).map(a=>`<option>${a}</option>`).join('')}</select></div>
    <div class="fg"><label class="fl">Qty Done</label><input class="fi" id="ppss-qty" type="number" min="0" placeholder="Qty" required></div></div>
    <div class="fr"><div class="fg"><label class="fl">Cumulative</label><input class="fi" id="ppss-cum" type="number" min="0" placeholder="Total" required></div>
    <div class="fg"><label class="fl">Manpower</label><input class="fi" id="ppss-mp" type="number" min="0" placeholder="Workers" required></div></div>
    <div class="fg"><label class="fl">Contractor</label><input class="fi" id="ppss-con" placeholder="Contractor name"></div>
    <div class="fg"><label class="fl">Work Permit</label><input class="fi" id="ppss-wp" placeholder="WP-2026-XXX"></div>
    <div class="fg"><label class="fl">Remarks</label><textarea class="fta" id="ppss-rem" placeholder="Notes..."></textarea></div>
    <div style="display:flex;gap:7px;margin-top:7px;"><button type="button" class="btn" style="flex:1;" onclick="cov('pov')">Cancel</button><button type="submit" class="btn btbo" style="flex:1;">✅ Submit</button></div>
  </form>`;ov('pov');
}
function openGSSProg(){
  document.getElementById('p-t').textContent='📊 GSS Progress';
  document.getElementById('p-b').innerHTML=`<form onsubmit="submitPSSGSSProg(event,'gss')">
    <div class="fr"><div class="fg"><label class="fl">Activity</label><select class="fs" id="pgss-act">${Object.keys(DB.gss.acts).map(a=>`<option>${a}</option>`).join('')}</select></div>
    <div class="fg"><label class="fl">Qty Done</label><input class="fi" id="pgss-qty" type="number" min="0" placeholder="Qty" required></div></div>
    <div class="fr"><div class="fg"><label class="fl">Cumulative</label><input class="fi" id="pgss-cum" type="number" min="0" placeholder="Total" required></div>
    <div class="fg"><label class="fl">Manpower</label><input class="fi" id="pgss-mp" type="number" min="0" placeholder="Workers" required></div></div>
    <div class="fg"><label class="fl">Contractor</label><input class="fi" id="pgss-con" placeholder="Name"></div>
    <div class="fg"><label class="fl">Remarks</label><textarea class="fta" id="pgss-rem" placeholder="Notes..."></textarea></div>
    <div style="display:flex;gap:7px;margin-top:7px;"><button type="button" class="btn" style="flex:1;" onclick="cov('pov')">Cancel</button><button type="submit" class="btn btbo" style="flex:1;">✅ Submit</button></div>
  </form>`;ov('pov');
}
function submitPSSGSSProg(e,sec){
  e.preventDefault();const prefix='p'+sec;const act=document.getElementById(prefix+'-act').value;const cum=+document.getElementById(prefix+'-cum').value;const mp=+document.getElementById(prefix+'-mp').value;
  const acts=sec==='pss'?DB.pss.acts:DB.gss.acts;if(acts[act])acts[act].done=cum;
  DB.mp.bop+=mp;updateKpiMp();cov('pov');alert(`✅ ${sec.toUpperCase()} Progress Saved!\n${act}: ${cum}`);updateOverallBars();rndrBopSec(sec);
}

// ═══════════════════════════════════════════════════════════