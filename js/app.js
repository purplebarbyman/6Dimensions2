/* ────────────────────────── GLOBAL STATE ────────────────────────── */
const state = {
  answers:{}, scores:{}, strengths:[], focus:null, hero:{}
};
const dims = ['physical','emotional','intellectual','social','spiritual','occupational'];

/* ────────────────────────── SECTION NAV ────────────────────────── */
function goto(id){
  document.querySelectorAll('section.card').forEach(s=>s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}
document.getElementById('beginBtn').onclick = ()=>goto('assessment');

/* ────────────────────────── 1 ASSESSMENT ───────────────────────── */
document.getElementById('assessmentForm').addEventListener('submit',e=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  fd.forEach((v,k)=>state.answers[k]=Number(v||0));

  dims.forEach(dim=>{
    const vals = Object.entries(state.answers)
      .filter(([k])=>k.startsWith(dim))
      .map(([,v])=>v);
    state.scores[dim] = Math.round(vals.reduce((a,b)=>a+b,0)/(vals.length*10)*100);
  });
  buildFocusPage();
  goto('focus');
});

/* ────────────────────────── 2 FOCUS SELECT ─────────────────────── */
function buildFocusPage(){
  const list = document.getElementById('scoreList');
  const sel  = document.getElementById('focusSelect');
  list.innerHTML = sel.innerHTML = '';
  dims.forEach(dim=>{
    list.insertAdjacentHTML('beforeend',
      `<li>${cap(dim)} — <strong>${state.scores[dim]}</strong></li>`);
    sel.insertAdjacentHTML('beforeend',
      `<option value="${dim}">${cap(dim)}</option>`);
  });
}
document.querySelector('#focus .next').onclick = ()=>{
  state.focus = document.getElementById('focusSelect').value;
  populateSymbols();
  goto('creator');
};

/* ────────────────────────── 3 AVATAR CREATOR ───────────────────── */
const cvs = document.getElementById('heroCanvas');
const ctx = cvs.getContext('2d');
const opt = {skin:'#ffdbac',hair:'#3a2c24',hairStyle:'short',
             cape:'none',capeColor:'#1e90ff',symbol:'none'};

/* UI bindings */
document.getElementById('skinTone').oninput   =e=>{opt.skin=e.target.value; draw();}
document.getElementById('hairColor').oninput  =e=>{opt.hair=e.target.value; draw();}
document.getElementById('hairStyle').onchange =e=>{opt.hairStyle=e.target.value; draw();}
document.getElementById('capeStyle').onchange =e=>{opt.cape=e.target.value; draw();}
document.getElementById('chestSymbol').onchange=e=>{opt.symbol=e.target.value; draw();}

function populateSymbols(){
  const map={
    physical:['heartbeat','dumbbell','bolt'],
    emotional:['lotus','heart','yinyang'],
    intellectual:['brain','lightbulb','book'],
    social:['network','handshake','community'],
    spiritual:['om','tree','mountain'],
    occupational:['gear','arrow','briefcase']
  };
  const sel = document.getElementById('chestSymbol');
  sel.innerHTML = '<option value="none">None</option>';
  map[state.focus].forEach(sym=>{
    sel.insertAdjacentHTML('beforeend',`<option value="${sym}">${sym}</option>`);
  });
}

function draw(){
  ctx.clearRect(0,0,cvs.width,cvs.height);

  /* Cape (behind) */
  if(opt.cape!=='none'){
    ctx.fillStyle = opt.capeColor;
    if(opt.cape==='flowing'){
      ctx.beginPath();
      ctx.moveTo(140,80);
      ctx.bezierCurveTo(300,100,20,350,140,380);
      ctx.closePath(); ctx.fill();
    }else if(opt.cape==='armored'){
      ctx.fillRect(100,80,80,300);
    }
  }

  /* Body */
  ctx.fillStyle='#4b6cb7';
  ctx.fillRect(100,120,80,200);

  /* Chest symbol */
  if(opt.symbol!=='none'){
    const img = new Image();
    img.src = `assets/icons/${opt.symbol}.svg`;
    img.onload = ()=>ctx.drawImage(img,120,180,40,40);
  }

  /* Head */
  ctx.fillStyle = opt.skin;
  ctx.beginPath(); ctx.arc(140,100,40,0,Math.PI*2); ctx.fill();

  /* Hair (behind face) */
  ctx.fillStyle = opt.hair;
  if(opt.hairStyle==='short'){
    ctx.beginPath(); ctx.arc(140,80,42,Math.PI,0); ctx.fill();
  }else if(opt.hairStyle==='long'){
    ctx.fillRect(100,70,80,70);
  }else if(opt.hairStyle==='bun'){
    ctx.beginPath(); ctx.arc(140,60,24,0,Math.PI*2); ctx.fill();
  }
}
draw();

/* Save hero & move on */
document.querySelector('#creator .next').onclick = ()=>{
  state.hero = {
    name: document.getElementById('heroName').value.trim()||'Unnamed Hero',
    avatar: cvs.toDataURL('image/png'),
    strengths: getTopTwo(),
    focus: state.focus,
    scores: state.scores,
    created: Date.now()
  };
  buildResults();
  goto('results');
};

/* ────────────────────────── 4 RESULTS PAGE ─────────────────────── */
function buildResults(){
  const sBlock = document.getElementById('strengthsBlock');
  const iBlock = document.getElementById('improveBlock');

  sBlock.innerHTML = `<h3>🏆 Strengths</h3>
    <ul>${state.hero.strengths.map(d=>`<li>${cap(d)}</li>`).join('')}</ul>`;

  const rec = recommendations(state.focus);
  iBlock.innerHTML = `<h3>⚡ Focus Area: ${cap(state.focus)}</h3>
    <p>Evidence-based activities:</p>
    <ul>${rec.map(r=>`<li>${r}</li>`).join('')}</ul>`;
}

/* Buttons */
document.getElementById('downloadBtn').onclick = ()=>{
  const a = document.createElement('a');
  a.href = state.hero.avatar;
  a.download = `${state.hero.name}.png`; a.click();
};
document.getElementById('jsonBtn').onclick = ()=>{
  const blob = new Blob([JSON.stringify(state.hero)],{type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${state.hero.name}.json`; a.click();
};
document.getElementById('emailBtn').onclick = ()=>{
  const body = encodeURIComponent(emailBody());
  location.href = `mailto:?subject=${encodeURIComponent(state.hero.name)}&body=${body}`;
};

/* ────────────────────────── HELPERS ────────────────────────────── */
function getTopTwo(){
  return Object.entries(state.scores)
    .sort((a,b)=>b[1]-a[1]).slice(0,2).map(([d])=>d);
}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}
function recommendations(dim){
  const r={
    physical:['≥150 min cardio/week','Strength train 2×/week','7-9 h quality sleep','Hourly stretch break'],
    emotional:['10-min mindfulness','Mood journaling','Deep-breathing sets','Weekly friend call'],
    intellectual:['20-min reading daily','Monthly new skill','Weekly puzzles','Join a discussion club'],
    social:['Join community group','Practice active listening','Volunteer monthly','Schedule friend time'],
    spiritual:['5-min reflection daily','Nature walk','Clarify core values','Gratitude journal'],
    occupational:['Set 3 monthly goals','Daily shutdown ritual','Upskill course','Regular breaks']
  };
  return r[dim];
}
function emailBody(){
  return `${state.hero.name}\n\nStrengths: ${state.hero.strengths.join(', ')}\nFocus: ${cap(state.focus)}\n\nEvidence-based tips:\n${recommendations(state.focus).map(r=>'• '+r).join('\n')}\n\n(PNG attached)`;
}

/* ────────────────────────── SMALL SPANISH BREAK ──────────────────
Una pequeña lección: “fortalezas” = strengths, “mejoras” = improvements.
¡Practica estas palabras mientras desarrollas tus superpoderes!
─────────────────────────────────────────────────────────────────── */
