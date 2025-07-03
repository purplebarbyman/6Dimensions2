// Global state
const state = {
  answers: {},
  scores: {},
  strengths: [],
  focus: null,
  hero: {}
};

// Utility: show section
function goto(id) {
  document.querySelectorAll('section.card').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

// Start button
document.getElementById('beginBtn').addEventListener('click', () => {
  goto('assessment');
});

// Assessment form submission
document.getElementById('assessmentForm').addEventListener('submit', e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  fd.forEach((v, k) => (state.answers[k] = Number(v)));

  const dims = [
    'physical',
    'emotional',
    'intellectual',
    'social',
    'spiritual',
    'occupational'
  ];

  dims.forEach(dim => {
    const qVals = Object.entries(state.answers)
      .filter(([k]) => k.startsWith(dim))
      .map(([, v]) => v);
    const total = qVals.reduce((a, b) => a + b, 0);
    const max = qVals.length * 10; // max per question
    state.scores[dim] = Math.round((total / max) * 100);
  });

  // Populate score list and focus options
  const list = document.getElementById('scoreList');
  const sel = document.getElementById('focusSelect');
  list.innerHTML = '';
  sel.innerHTML = '';
  dims.forEach(dim => {
    list.innerHTML += `<li>${capitalize(dim)}: <strong>${state.scores[dim]}</strong></li>`;
    sel.innerHTML += `<option value="${dim}">${capitalize(dim)}</option>`;
  });

  goto('focus');
});

// Focus selection
document.querySelector('#focus .next').addEventListener('click', () => {
  const sel = document.getElementById('focusSelect');
  if (!sel.value) {
    alert('Please select a focus area.');
    return;
  }
  state.focus = sel.value;
  populateChestSymbols();
  goto('creator');
});

// Avatar creation
const cvs = document.getElementById('heroCanvas');
const ctx = cvs.getContext('2d');

const opts = {
  skin: '#ffdbac',
  hair: '#3a2c24',
  hairStyle: 'short',
  cape: 'none',
  capeColor: '#1e90ff',
  symbol: 'none'
};

// UI bindings
document.getElementById('skinTone').addEventListener('input', e => { opts.skin = e.target.value; draw(); });
document.getElementById('hairStyle').addEventListener('change', e => { opts.hairStyle = e.target.value; draw(); });
document.getElementById('hairColor').addEventListener('input', e => { opts.hair = e.target.value; draw(); });
document.getElementById('capeStyle').addEventListener('change', e => { opts.cape = e.target.value; draw(); });
document.getElementById('chestSymbol').addEventListener('change', e => { opts.symbol = e.target.value; draw(); });

// Populate chest symbols based on focus
function populateChestSymbols() {
  const map = {
    physical: ['heartbeat', 'bolt', 'dumbbell'],
    emotional: ['lotus', 'heart', 'yin-yang'],
    intellectual: ['brain', 'lightbulb', 'book'],
    social: ['network', 'handshake', 'community'],
    spiritual: ['om', 'tree', 'mountain'],
    occupational: ['gear', 'arrow', 'briefcase']
  };
  const sel = document.getElementById('chestSymbol');
  sel.innerHTML = '';
  if (map[state.focus]) {
    map[state.focus].forEach(sym => {
      sel.innerHTML += `<option value="${sym}">${sym}</option>`;
    });
  }
}

// Draw avatar
function draw() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  // Cape
  if (opts.cape !== 'none') {
    ctx.fillStyle = opts.capeColor;
    if (opts.cape === 'flowing') {
      ctx.beginPath();
      ctx.moveTo(140, 80);
      ctx.bezierCurveTo(300, 100, 20, 350, 140, 380);
      ctx.closePath();
      ctx.fill();
    } else if (opts.cape === 'armored') {
      ctx.fillRect(100, 80, 80, 300);
    }
  }
  // Body
  ctx.fillStyle = '#4b6cb7';
  ctx.fillRect(100, 120, 80, 200);
  // Chest symbol
  if (opts.symbol !== 'none') {
    const img = new Image();
    img.src = `assets/icons/${opts.symbol}.svg`;
    img.onload = () => ctx.drawImage(img, 120, 180, 40, 40);
  }
  // Head
  ctx.fillStyle = opts.skin;
  ctx.beginPath();
  ctx.arc(140, 100, 40, 0, Math.PI * 2);
  ctx.fill();
  // Hair
  ctx.fillStyle = opts.hair;
  if (opts.hairStyle === 'short') {
    ctx.beginPath();
    ctx.arc(140, 80, 42, Math.PI, 0);
    ctx.fill();
  } else if (opts.hairStyle === 'long') {
    ctx.fillRect(100, 70, 80, 70);
  } else if (opts.hairStyle === 'bun') {
    ctx.beginPath();
    ctx.arc(140, 60, 24, 0, Math.PI * 2);
    ctx.fill();
  }
}
draw();

// Save avatar
document.querySelector('#creator .next').addEventListener('click', () => {
  const heroName = document.getElementById('heroName').value.trim() || 'Unnamed Hero';
  const avatarData = cvs.toDataURL('image/png');
  const hero = {
    name: heroName,
    avatar: avatarData,
    strengths: getTopTwo(),
    focus: state.focus,
    scores: { ...state.scores },
    created: Date.now()
  };
  state.hero = hero;
  buildResultPage();
  goto('results');
});

// Get top two scores
function getTopTwo() {
  return Object.entries(state.scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([d]) => d);
}

// Build results page
function buildResultPage() {
  const sBlock = document.getElementById('strengthsBlock');
  const iBlock = document.getElementById('improveBlock');
  sBlock.innerHTML = `<h3>🏆 Strengths</h3><ul>` +
    state.hero.strengths.map(d => `<li>${capitalize(d)}</li>`).join('') +
    `</ul>`;
  iBlock.innerHTML = `<h3>⚡ Focus Area: ${capitalize(state.focus)}</h3>
    <p>Evidence-based activities to improve:</p>
    <ul>${recommend(state.focus).map(a => `<li>${a}</li>`).join('')}</ul>`;
}

// Recommendations
function recommend(dim) {
  const rec = {
    physical: [
      '150 min cardio/week',
      '2x strength training',
      '7-9 hrs sleep',
      'hourly movement'
    ],
    emotional: [
      '10 min mindfulness',
      'journaling',
      'deep breathing',
      'social support'
    ],
    intellectual: [
      '20 min reading daily',
      'monthly learning',
      'creative activities'
    ],
    social: [
      'weekly social time',
      'community groups',
      'active listening'
    ],
    spiritual: [
      'daily reflection',
      'nature walks',
      'values clarification'
    ],
    occupational: [
      'balance strategies',
      'career goals',
      'professional growth'
    ]
  };
  return rec[dim] || [];
}

// Download PNG
document.getElementById('downloadBtn').onclick = () => {
  const link = document.createElement('a');
  link.href = state.hero.avatar;
  link.download = `${state.hero.name}.png`;
  link.click();
};

// Export JSON
document.getElementById('jsonBtn').onclick = () => {
  const blob = new Blob([JSON.stringify(state.hero)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${state.hero.name}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Share via email
document.getElementById('emailBtn').onclick = () => {
  const emailBodyContent = emailBody();
  const mailtoLink = `mailto:?subject=${encodeURIComponent(state.hero.name)}&body=${encodeURIComponent(emailBodyContent)}`;
  window.location.href = mailtoLink;
};

function emailBody() {
  return `
${state.hero.name}

Strengths: ${state.hero.strengths.join(', ')}
Focus Area: ${capitalize(state.focus)}

Evidence-based activities:
${recommend(state.focus).map(a => '- ' + a).join('\n')}

Superhero image: [attached PNG or download link]
`;
}

// Utility
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
