//  MASTER DATA MODEL (exact spec values)
// ═══════════════════════════════════════════════════════════
// ITC Map images (stored as data URLs after upload)
const ITC_MAPS = {
  'ITC-1': null, 'ITC-2': null, 'ITC-3': null,
  'ITC-4': null, 'ITC-5': null, 'ITC-6': null,
};

const USERS={solar_user:{pwd:'Solar@123',role:'solar',name:'Solar Engr'},wtg_user:{pwd:'WTG@123',role:'wtg',name:'WTG Engr'},bop_user:{pwd:'BOP@123',role:'bop',name:'BOP Engr'},site_mgr:{pwd:'Site@123',role:'all',name:'Site Manager'}};

// ── SOLAR ACTIVITIES (11 activities, weight = 100%) ────────
function mkSolActs(seed){
  const defs=[
    {n:'Piling – Marking',    w:4,  col:'#ab47bc'},
    {n:'Piling – Drilling',   w:6,  col:'#9c27b0'},
    {n:'Column Casting',      w:6,  col:'#7b1fa2'},
    {n:'Roads (Civil)',       w:4,  col:'#6a1b9a'},
    {n:'Boundary Wall',       w:3,  col:'#4a148c'},
    {n:'MMS Erection',        w:10, col:'#ffaa00'},
    {n:'Module Mounting',     w:14, col:'#ff8800'},
    {n:'DC Cable 4sqmm',      w:5,  col:'#00c8ff'},
    {n:'DC Cable 400sqmm',    w:8,  col:'#0099cc'},
    {n:'DC Trenching',        w:7,  col:'#00acc1'},
    {n:'SCB Installation',    w:4,  col:'#00bcd4'},
    {n:'Inverter Installation',w:7, col:'#00897b'},
    {n:'IDT Works',           w:5,  col:'#00c853'},
    {n:'LA & Earthing',       w:4,  col:'#69f0ae'},
    {n:'Pre-commissioning',   w:7,  col:'#651fff'},
    {n:'CEIG Approval',       w:4,  col:'#7c4dff'},
    {n:'HOTO',                w:2,  col:'#b39ddb'},
  ];
  const s=seed||{};
  return defs.map(d=>({...d, done:s[d.n]||0, today:0}));
}

// ITC spec per PPT: ITC-1..4 = 13.2MW each, ITC-5..6 = 8.8MW each → 4×13.2 + 2×8.8 = 70.4MW
const DB = {
  solar:{
    totalMW:70.4,
    itcs:{
      'ITC-1':{mw:13.2, pct:9.4, lat:14.832892, lng:76.468903,
        acts:mkSolActs({'Piling – Marking':100,'Piling – Drilling':99.5,'Column Casting':81.4,'Roads (Civil)':45,'Boundary Wall':9,'MMS Erection':51.3,'Module Mounting':0.2,'DC Cable 4sqmm':0,'DC Cable 400sqmm':0.1,'DC Trenching':20.4,'SCB Installation':0,'Inverter Installation':0,'IDT Works':25,'LA & Earthing':5,'Pre-commissioning':0,'CEIG Approval':0,'HOTO':0})},
      'ITC-2':{mw:13.2, pct:9.4, lat:null, lng:null, acts:mkSolActs({'Piling – Marking':30,'Piling – Drilling':10})},
      'ITC-3':{mw:13.2, pct:9.4, lat:null, lng:null, acts:mkSolActs({'Piling – Marking':5})},
      'ITC-4':{mw:13.2, pct:9.4, lat:null, lng:null, acts:mkSolActs({})},
      'ITC-5':{mw:8.8,  pct:6.3, lat:null, lng:null, acts:mkSolActs({})},
      'ITC-6':{mw:8.8,  pct:6.3, lat:null, lng:null, acts:mkSolActs({})},
    }
  },

  // ROW tracking
  rowIssues:[
    {loc:'MKD-258', type:'WTG', issue:'Pathway ROW – Land owner dispute', opened:'2026-03-01'},
    {loc:'MKD-52',  type:'WTG', issue:'Logistic path ROW – Not cleared', opened:'2026-03-10'},
    {loc:'CDP-193', type:'WTG', issue:'Road width restriction', opened:'2026-03-20'},
  ],

  // Planned vs Actual timeline
  schedule:{
    planned:[0,2,5,9,14,20,27,35,43,52,61,70,78,85,91,96,100],
    actual: [0,1,3,7,11,16,22,28,null,null,null,null,null,null,null,null,null],
    labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan27','Feb27','Mar27','Apr27','May27'],
  },

  // WTG: Civil 30% + Mechanical 50% + USS 10% + Supply 10% = 100%
  wtg:{
    totalMW:70.2, count:26,
    civil:   [{n:'Excavation',w:6,col:'#7c4dff'},{n:'PCC',w:5,col:'#651fff'},{n:'Anchor Cage',w:5,col:'#b39ddb'},{n:'Reinforcement',w:7,col:'#9575cd'},{n:'Casting',w:7,col:'#673ab7'}],
    mech:    [{n:'Tower Erection',w:15,col:'#00c8ff'},{n:'Nacelle Install',w:15,col:'#0099cc'},{n:'Blade Assembly',w:12,col:'#00acc1'},{n:'Torque & Final',w:8,col:'#00bcd4'}],
    uss:     [{n:'USS Works',w:10,col:'#00c853'}],
    supply:  [{n:'Supply Complete',w:10,col:'#69f0ae'}],
    turbines:[
      {id:'MBI-12', status:'ready',  lp:true,  pp:true,  civil:[100,100,100,100,100],mech:[0,0,0,0],uss:0,sup:100,notes:'Ready for erection'},
      {id:'MKD-258',status:'row',    lp:true,  pp:false, civil:[100,100,100,100,100],mech:[0,0,0,0],uss:0,sup:0,  notes:'ROW – On hold'},
      {id:'MKD-253',status:'ready',  lp:true,  pp:true,  civil:[100,100,100,100,100],mech:[0,0,0,0],uss:0,sup:100,notes:'Crane arrived'},
      {id:'MOB-403',status:'casting',lp:false, pp:false, civil:[100,100,100,100,100],mech:[0,0,0,0],uss:0,sup:0,  notes:'Backfilling WIP'},
      {id:'KDK-462',status:'wip',    lp:true,  pp:false, civil:[100,100,100,100,0],  mech:[0,0,0,0],uss:0,sup:0,  notes:'Pathway done – casting 05-Apr'},
      {id:'BDK-85', status:'casting',lp:false, pp:false, civil:[100,100,100,100,100],mech:[0,0,0,0],uss:0,sup:0,  notes:'Pipe fixing done'},
      {id:'AMK-264',status:'wip',    lp:false, pp:false, civil:[100,100,100,60,0],   mech:[0,0,0,0],uss:0,sup:0,  notes:'Shuttering 60%'},
      {id:'CDP-221',status:'casting',lp:true,  pp:false, civil:[100,100,100,100,100],mech:[0,0,0,0],uss:0,sup:0,  notes:'Curing done 17-Mar'},
      {id:'MOB-142',status:'wip',    lp:false, pp:false, civil:[100,100,100,100,0],  mech:[0,0,0,0],uss:0,sup:0,  notes:'Casting 03-Apr'},
      {id:'MKD-211',status:'wip',    lp:false, pp:false, civil:[80,50,0,0,0],        mech:[0,0,0,0],uss:0,sup:0,  notes:'GSB supply started'},
      {id:'MKD-52', status:'row',    lp:false, pp:false, civil:[0,0,0,0,0],          mech:[0,0,0,0],uss:0,sup:0,  notes:'ROW – pathway needed'},
      {id:'BDK-25', status:'wip',    lp:false, pp:false, civil:[50,0,0,0,0],         mech:[0,0,0,0],uss:0,sup:0,  notes:'Excavation 50%'},
      ...[13,14,15,16,17,18,19,20,21,22,23,24,25,26].map(n=>({id:`LOC-${String(n).padStart(2,'0')}`,status:'pending',lp:false,pp:false,civil:[0,0,0,0,0],mech:[0,0,0,0],uss:0,sup:0,notes:'Not started'}))
    ]
  },

  // WTG Land: 10 stages each = 100%, 1 WTG = 1.92% of WTG Land
  wtgLand:{
    stages:['Land Agreement','Land Registration','Land Demarcation','Soil Test','DGPS Survey','Permanent Pathway Agreement','Permanent Pathway Dev','Logistic Path Agreement','Logistic Pathway Dev','RFC Approval'],
    locs:[
      ...['MBI-12','MKD-258','MKD-253','MOB-403','KDK-462'].map((id,i)=>({id,svy:`SY.${101+i}/1`,pa:1.2,la:4.2,ls:'Executed',comp:'Paid',stages:[true,true,true,true,true,true,true,true,true,true],notes:''})),
      ...['BDK-85','AMK-264','CDP-221','MOB-142','MKD-211'].map((id,i)=>({id,svy:`SY.${110+i}/2`,pa:1.1,la:4.0,ls:'In Progress',comp:'Partial',stages:[true,true,true,true,false,false,true,true,false,false],notes:''})),
      ...['MKD-52','BDK-25',...[13,14,15,16,17,18,19,20,21,22,23,24,25,26].map(n=>`LOC-${String(n).padStart(2,'0')}`)].map((id,i)=>({id,svy:`SY.${120+i}/3`,pa:1.0,la:3.8,ls:'Pending',comp:'Not Started',stages:new Array(10).fill(false),notes:''}))
    ]
  },

  // Solar Land: 10 activities per block (per spec weights)
  solLand:{
    actDef:[
      {n:'Document Agreement',w:10},{n:'Registration',w:40},{n:'Demarcation',w:5},
      {n:'Leveling',w:5},{n:'Soil Test',w:5},{n:'DGPS Survey',w:5},
      {n:'Permanent Pathway Agreement',w:5},{n:'Permanent Pathway Dev',w:10},
      {n:'Logistic Pathway Agreement',w:5},{n:'Logistic Pathway Dev',w:10},
    ],
    blocks:{
      'ITC-1':{mw:13.2,area:52.5,acts:[100,100,80,50,100,90,30,0,20,0],leases:[{own:'Rameshu',svy:'SY.45/1',dur:'30yr',ls:'Executed',doc:'Complete',reg:'Done',rem:'All clear'}]},
      'ITC-2':{mw:13.2,area:52.5,acts:[100,80,60,0,0,0,50,0,0,0],leases:[]},
      'ITC-3':{mw:13.2,area:52.5,acts:[100,20,0,0,0,0,0,0,0,0],leases:[]},
      'ITC-4':{mw:13.2,area:52.5,acts:[50,0,0,0,0,0,0,0,0,0],leases:[]},
      'ITC-5':{mw:8.8, area:35.0,acts:[30,0,0,0,0,0,0,0,0,0],leases:[]},
      'ITC-6':{mw:8.8, area:35.0,acts:[0,0,0,0,0,0,0,0,0,0],leases:[]},
    }
  },

  // BOP – 33kV: 3 lines with exact km from spec
  bop33:{
    lines:[
      {id:'SPDC',   km:13, vendor:'TBD',   poles:{scope:130,done:45}, stringing:{scope:13,done:0,unit:'km'}, row:3, mp:12, notes:''},
      {id:'SPSC',   km:9,  vendor:'TBD',   poles:{scope:90, done:12}, stringing:{scope:9, done:0,unit:'km'}, row:1, mp:8,  notes:''},
      {id:'Sai Sreeja',km:14,vendor:'TBD', poles:{scope:140,done:8},  stringing:{scope:14,done:0,unit:'km'}, row:2, mp:10, notes:''},
    ]
  },

  // BOP – 66kV: 66 towers, 2 vendors
  bop66:{
    totalTowers:66,
    vendors:[
      {n:'Krishna Electricals', towers:{scope:33,done:5},  stringing:{scope:16.5,done:0,unit:'km'}},
      {n:'Zelvo',               towers:{scope:33,done:3},  stringing:{scope:16.5,done:0,unit:'km'}},
    ]
  },

  // PSS: Gantry + Equipment + Earth Mat + Cable + MCR Building
  pss:{
    acts:{
      'Gantry Works':        {scope:1,done:0,col:'#00bcd4',unit:'Lot'},
      'Equipment Installation':{scope:1,done:0,col:'#0097a7',unit:'Lot'},
      'Earth Mat':           {scope:1,done:0,col:'#00acc1',unit:'Lot'},
      'Cable Works':         {scope:5,done:0,col:'#4dd0e1',unit:'km'},
      'MCR – Raft':          {scope:100,done:0,col:'#80deea',unit:'%'},
      'MCR – Columns':       {scope:100,done:0,col:'#006064',unit:'%'},
      'MCR – Slab':          {scope:100,done:0,col:'#00838f',unit:'%'},
      'MCR – Flooring':      {scope:100,done:0,col:'#0097a7',unit:'%'},
      'T&C':                 {scope:1,done:0,col:'#00bcd4',unit:'Lot'},
    }
  },

  // GSS: Transformer + Switchyard + Protection + Earthing
  gss:{
    acts:{
      'Transformer':          {scope:1,done:0,col:'#8bc34a',unit:'Nos'},
      'Switchyard Civil':     {scope:100,done:0,col:'#689f38',unit:'%'},
      'Switchyard Equipment': {scope:1,done:0,col:'#33691e',unit:'Lot'},
      'Protection System':    {scope:1,done:0,col:'#aed581',unit:'Lot'},
      'Earthing':             {scope:1,done:0,col:'#c5e1a5',unit:'Lot'},
      'Bay Equipment':        {scope:4,done:0,col:'#9ccc65',unit:'Nos'},
      'T&C':                  {scope:1,done:0,col:'#dcedc8',unit:'Lot'},
    }
  },

  // BOP activity definitions for 33kV and 66kV (matching Solar style)
  bopActDefs:{
    '33kv':[
      {n:'Survey & Design',    w:5,  col:'#9c27b0'},
      {n:'ROW Clearance',      w:8,  col:'#7b1fa2'},
      {n:'Pole Foundation',    w:15, col:'#6a1b9a'},
      {n:'Pole Erection',      w:20, col:'#4a148c'},
      {n:'Stringing',          w:25, col:'#ab47bc'},
      {n:'Insulators & Fittings',w:10,col:'#ce93d8'},
      {n:'Earthing',           w:7,  col:'#e1bee7'},
      {n:'Testing & Commissioning',w:10,col:'#f3e5f5'},
    ],
    '66kv':[
      {n:'Survey & Design',    w:5,  col:'#ff9800'},
      {n:'ROW Clearance',      w:8,  col:'#f57c00'},
      {n:'Tower Foundation',   w:18, col:'#e65100'},
      {n:'Tower Erection',     w:22, col:'#ff6d00'},
      {n:'Stringing',          w:25, col:'#ffb300'},
      {n:'Insulators & Fittings',w:10,col:'#ffd54f'},
      {n:'Earthing',           w:7,  col:'#ffe082'},
      {n:'Testing & Commissioning',w:5,col:'#fff8e1'},
    ],
  },

  // BOP 33kV / 66kV per-line activity progress (seeded)
  bopActs:{
    '33kv':{
      'SPDC':  [100,30,20,5,0,0,0,0],
      'SPSC':  [100,15,8,2,0,0,0,0],
      'Sai Sreeja':[100,10,5,1,0,0,0,0],
    },
    '66kv':{
      'Krishna Electricals':[100,20,8,0,0,0,0,0],
      'Zelvo':              [100,15,5,0,0,0,0,0],
    },
  },

  // POD & progress logs
  pod:{s:[],w:[],l:[],b:[]},
  mp:{sol:0,wtg:0,bop:0},
};

// ═══════════════════════════════════════════════════════════