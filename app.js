/* === Global State === */
const state = {
  answers:{}, scores:{}, strengths:[], focus:null, hero:{}
};

/* == 1. ASSESSMENT ======================================================= */
document.getElementById('assessmentForm').addEventListener('submit', e=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  fd.forEach((v,k)=>state.answers[k]=Number(v));

  // crude scoring: sum per dimension / max → 0-100
  const dims = ['physical','emotional','intellectual','social','spiritual','occupational'];
  dims.forEach(dim=>{
    const qVals = Object.entries(state.answers)
      .filter(([k])=>k.startsWith(dim))
      .map(([,v])=>v);
    state.scores[dim] = Math.round(qVals.reduce((a,b)=>a+b,0)/(qVals.length*10)*100);
  });

  /* populate score table & select */
  const list = document.getElementById('scoreList');
  const sel  = document.getElementById('focusSelect');
  list.innerHTML = sel.innerHTML = '';
  dims.forEach(dim=>{
    list.insertAdjacentHTML('beforeend',
      `<li>${dim.toUpperCase()}: <strong>${state.scores[dim]}</strong></li>`);
    sel.insertAdjacentHTML('beforeend',
      `<option value="${dim}">${dim.charAt(0).toUpperCase()+dim.slice(1)}</option>`);
  });

  goto('focus');
});

/* == 2. FOCUS AREA SELECTION ============================================ */
document.querySelector('#focus .next').onclick = ()=> {
  state.focus = document.getElementById('focusSelect').value;
  populateChestSymbols();
  goto('creator');
};

/* == 3. AVATAR CREATOR =================================================== */
const cvs = document.getElementById('heroCanvas');
const ctx = cvs.getContext('2d');
const opts = {
  skin:'#ffdbac', hair:'#3a2c24', hairStyle:'short',
  cape:'none', capeColor:'#1e90ff', symbol:'none'
};

/* UI Bindings */
document.getElementById('skinTone').oninput   = e=>{opts.skin=e.target.value; draw();}
document.getElementById('hairStyle').onchange = e=>{opts.hairStyle=e.target.value; draw();}
document.getElementById('hairColor').oninput  = e=>{opts.hair=e.target.value; draw();}
document.getElementById('capeStyle').onchange = e=>{opts.cape=e.target.value; draw();}
document.getElementById('chestSymbol').onchange=e=>{opts.symbol=e.target.value; draw();}

function draw(){
  ctx.clearRect(0,0,cvs.width,cvs.height);

  /* Cape (behind) */
  if(opts.cape!='none'){
    ctx.fillStyle=opts.capeColor;
    if(opts.cape==='flowing'){
      ctx.beginPath();
      ctx.moveTo(140,80); ctx.bezierCurveTo(300,100,20,350,140,380); ctx.closePath();
      ctx.fill();
    } else if(opts.cape==='armored'){
      ctx.fillRect(100,80,80,300);
    }
  }

  /* Body */
  ctx.fillStyle='#4b6cb7'; ctx.fillRect(100,120,80,200);

  /* Chest symbol */
  if(opts.symbol!=='none'){
    const img = new Image();
    img.src = `assets/icons/${opts.symbol}.svg`;
    img.onload=()=>ctx.drawImage(img,120,180,40,40);
  }

  /* Head */
  ctx.fillStyle=opts.skin; ctx.beginPath(); ctx.arc(140,100,40,0,Math.PI*2); ctx.fill();

  /* Hair */
  ctx.fillStyle=opts.hair;
  if(opts.hairStyle==='short'){
    ctx.beginPath(); ctx.arc(140,80,42,Math.PI,0); ctx.fill();
  }else if(opts.hairStyle==='long'){
    ctx.fillRect(100,70,80,70);
  }else if(opts.hairStyle==='bun'){
    ctx.beginPath(); ctx.arc(140,60,24,0,Math.PI*2); ctx.fill();
  }
}
draw();

function populateChestSymbols(){
  const map={
    physical:['heartbeat','dumbbell','bolt'],
    emotional:['lotus','heart','yinyang'],
    intellectual:['brain','lightbulb','book'],
    social:['network','handshake','community'],
    spiritual:['om','tree','mountain'],
    occupational:['gear','arrow','briefcase']
  };
  const sel=document.getElementById('chestSymbol');
  sel.innerHTML='<option value="none">None</option>';
  map[state.focus].forEach(sym=>{
    sel.insertAdjacentHTML('beforeend',`<option value="${sym}">${sym}</option>`);
  });
}

/* == 4. RESULTS & SHARE ================================================== */
document.querySelector('#creator .next').onclick = ()=> {
  state.hero = {
    name: document.getElementById('heroName').value.trim() || 'Unnamed Hero',
    avatar: cvs.toDataURL('image/png'),
    strengths: topTwo(),
    focus: state.focus,
    scores: state.scores,
    created: Date.now()
  };
  buildResultPage();
  goto('results');
};

function goto(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function topTwo(){
  return Object.entries(state.scores)
    .sort((a,b)=>b[1]-a[1]).slice(0,2).map(([d])=>d);
}

function buildResultPage(){
  const sBlock = document.getElementById('strengthsBlock');
  const iBlock = document.getElementById('improveBlock');
  sBlock.innerHTML = `<h3>🏆 Strengths</h3><ul>`+
    state.hero.strengths.map(d=>`<li>${caps(d)} – evidence-based boosters inside email</li>`).join('')+
    `</ul>`;

  iBlock.innerHTML = `<h3>⚡ Focus Area: ${caps(state.focus)}</h3>
    <p>Try these evidence-based activities:</p>
    <ul>${recommend(state.focus).map(a=>`<li>${a}</li>`).join('')}</ul>`;
}

function recommend(dim){
  const rec={
    physical:['150 min cardio / wk','2 × strength sessions','7-9 h sleep','hourly stretch breaks'],
    emotional:['10 min mindfulness','mood journaling','deep breathing sets','talk to a friend'],
    intellectual:['20 min reading daily','learn a new skill monthly','logic puzzles weekly'],
    social:['schedule friend call','join interest group','practice active listening'],
    spiritual:['5 min reflection','nature walk','define core values'],
    occupational:['set 3 monthly goals','daily shut-down ritual','skill course enrollment']
  };
  return rec[dim];
}

/* == DOWNLOAD, EMAIL, EXPORT ============================================ */
document.getElementById('downloadBtn').onclick=()=>{
  const link=document.createElement('a');
  link.href=state.hero.avatar;
  link.download=`${state.hero.name}.png`;
  link.click();
};

document.getElementById('jsonBtn').onclick=()=>{
  const file=new Blob([JSON.stringify(state.hero)],{type:'application/json'});
  const link=document.createElement('a');
  link.href=URL.createObjectURL(file);
  link.download=`${state.hero.name}.json`;
  link.click();
};

document.getElementById('emailBtn').onclick=()=>{
  const mail=`mailto:?subject=${encodeURIComponent(state.hero.name)}&body=`+
  encodeURIComponent(emailBody());
  window.location.href=mail;
};

function emailBody(){
  return `
${state.hero.name}

Strengths: ${state.hero.strengths.join(', ')}
Focus Area: ${caps(state.focus)}

Evidence-based tips:
${recommend(state.focus).map(a=>'- '+a).join('\n')}

(Attach the PNG you downloaded!)
`;
}

/* == VIEW SWITCHER ======================================================= */
function goto(id){
  document.querySelectorAll('section.card').forEach(s=>s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}
function caps(s){return s.charAt(0).toUpperCase()+s.slice(1);}
// On load, show welcome screen
window.onload = () => goto('welcome');
