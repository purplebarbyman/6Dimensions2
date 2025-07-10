// Global state management
const state = {
  answers: {},
  scores: {},
  strengths: [],
  focus: null,
  hero: {}
};

const dimensions = ['physical', 'emotional', 'intellectual', 'social', 'spiritual', 'occupational'];

// Navigation system
function goto(sectionId) {
  document.querySelectorAll('section.card').forEach(section => {
    section.classList.add('hidden');
  });
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.remove('hidden');
    console.log(`Navigated to: ${sectionId}`);
  } else {
    console.error(`Section not found: ${sectionId}`);
  }
}

// Initialize application
document.addEventListener('DOMContentLoaded', function () {
  console.log('Wellness Superhero Builder loaded successfully!');

  // Begin button
  const beginBtn = document.getElementById('beginBtn');
  if (beginBtn) {
    beginBtn.addEventListener('click', () => {
      console.log('Begin button clicked');
      goto('assessment');
    });
  }

  // Assessment form
  const assessmentForm = document.getElementById('assessmentForm');
  if (assessmentForm) {
    assessmentForm.addEventListener('submit', handleAssessment);
  }

  // Focus selection
  const focusNext = document.querySelector('#focus .next');
  if (focusNext) {
    focusNext.addEventListener('click', handleFocusSelection);
  }

  // Creator section
  const creatorNext = document.querySelector('#creator .next');
  if (creatorNext) {
    creatorNext.addEventListener('click', generateResults);
  }

  // Initialize canvas and customization
  initializeCanvas();
  setupCustomization();

  // Result buttons
  setupResultButtons();
});

// Assessment processing
function handleAssessment(event) {
  event.preventDefault();
  console.log('Processing assessment...');

  const formData = new FormData(event.target);
  state.answers = {};

  // Collect all answers
  formData.forEach((value, key) => {
    state.answers[key] = parseInt(value) || 0;
  });

  // Calculate scores for each dimension
  dimensions.forEach(dimension => {
    const dimensionAnswers = Object.entries(state.answers)
      .filter(([key]) => key.startsWith(dimension))
      .map(([, value]) => value);

    if (dimensionAnswers.length > 0) {
      const average = dimensionAnswers.reduce((sum, val) => sum + val, 0) / dimensionAnswers.length;
      state.scores[dimension] = Math.round((average / 10) * 100);
    }
  });

  console.log('Calculated scores:', state.scores);
  buildFocusPage();
  goto('focus');
}

// Build focus selection page
function buildFocusPage() {
  const scoreList = document.getElementById('scoreList');
  const focusSelect = document.getElementById('focusSelect');

  if (!scoreList || !focusSelect) return;

  scoreList.innerHTML = '';
  focusSelect.innerHTML = '<option value="">Select focus area...</option>';

  // Sort dimensions by score to show strengths first
  const sortedDimensions = dimensions.sort((a, b) => (state.scores[b] || 0) - (state.scores[a] || 0));

  sortedDimensions.forEach(dimension => {
    const score = state.scores[dimension] || 0;
    const capitalizedDim = dimension.charAt(0).toUpperCase() + dimension.slice(1);

    scoreList.innerHTML += `<li><strong>${capitalizedDim}:</strong> ${score}%</li>`;
    focusSelect.innerHTML += `<option value="${dimension}">${capitalizedDim}</option>`;
  });

  // Identify top strengths
  state.strengths = sortedDimensions.slice(0, 2);
}

// Handle focus area selection
function handleFocusSelection() {
  const focusSelect = document.getElementById('focusSelect');
  if (!focusSelect || !focusSelect.value) {
    alert('Please select a focus area to continue.');
    return;
  }

  state.focus = focusSelect.value;
  console.log('Focus area selected:', state.focus);

  populateChestSymbols();
  goto('creator');
}

// Canvas and superhero creation
const canvasOptions = {
  skin: '#ffdbac',
  hair: '#8B4513',
  hairStyle: 'short',
  cape: 'none',
  capeColor: '#2563eb',
  symbol: 'none'
};

function initializeCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  drawSuperhero(ctx);
}

function setupCustomization() {
  const elements = {
    skinTone: 'skin',
    hairColor: 'hair',
    hairStyle: 'hairStyle',
    capeStyle: 'cape',
    chestSymbol: 'symbol'
  };

  Object.entries(elements).forEach(([elementId, property]) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.addEventListener('change', (e) => {
        canvasOptions[property] = e.target.value;
        const canvas = document.getElementById('heroCanvas');
        if (canvas) {
          drawSuperhero(canvas.getContext('2d'));
        }
      });
    }
  });
}

function populateChestSymbols() {
  const symbolMap = {
    physical: [
      { value: 'heartbeat', label: 'Heartbeat' },
      { value: 'dumbbell', label: 'Dumbbell' },
      { value: 'lightning', label: 'Lightning' }
    ],
    emotional: [
      { value: 'heart', label: 'Heart' },
      { value: 'lotus', label: 'Lotus' },
      { value: 'peace', label: 'Peace' }
    ],
    intellectual: [
      { value: 'brain', label: 'Brain' },
      { value: 'lightbulb', label: 'Lightbulb' },
      { value: 'book', label: 'Book' }
    ],
    social: [
      { value: 'people', label: 'People' },
      { value: 'handshake', label: 'Handshake' },
      { value: 'network', label: 'Network' }
    ],
    spiritual: [
      { value: 'mountain', label: 'Mountain' },
      { value: 'tree', label: 'Tree' },
      { value: 'star', label: 'Star' }
    ],
    occupational: [
      { value: 'gear', label: 'Gear' },
      { value: 'briefcase', label: 'Briefcase' },
      { value: 'target', label: 'Target' }
    ]
  };

  const chestSymbol = document.getElementById('chestSymbol');
  if (!chestSymbol || !state.focus) return;

  chestSymbol.innerHTML = '<option value="none">None</option>';

  const symbols = symbolMap[state.focus] || [];
  symbols.forEach(symbol => {
    chestSymbol.innerHTML += `<option value="${symbol.value}">${symbol.label}</option>`;
  });
}

function drawSuperhero(ctx) {
  if (!ctx) return;

  const canvas = ctx.canvas;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw cape (behind character)
  if (canvasOptions.cape !== 'none') {
    ctx.fillStyle = canvasOptions.capeColor;
    if (canvasOptions.cape === 'flowing') {
      drawFlowingCape(ctx);
    } else if (canvasOptions.cape === 'short') {
      drawShortCape(ctx);
    }
  }

  // Draw body
  ctx.fillStyle = '#4338ca';
  ctx.fillRect(110, 150, 60, 120);

  // Draw head
  ctx.fillStyle = canvasOptions.skin;
  ctx.beginPath();
  ctx.arc(140, 120, 35, 0, Math.PI * 2);
  ctx.fill();

  // Draw hair (behind head)
  drawHair(ctx);

  // Draw chest symbol
  if (canvasOptions.symbol !== 'none') {
    drawChestSymbol(ctx);
  }

  // Draw simple mask
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(125, 110, 30, 8);
}

function drawHair(ctx) {
  ctx.fillStyle = canvasOptions.hair;

  switch (canvasOptions.hairStyle) {
    case 'short':
      ctx.beginPath();
      ctx.arc(140, 100, 38, Math.PI, 0);
      ctx.fill();
      break;
    case 'long':
      ctx.fillRect(110, 85, 60, 80);
      break;
    case 'bun':
      ctx.beginPath();
      ctx.arc(140, 85, 20, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
}

function drawFlowingCape(ctx) {
  ctx.beginPath();
  ctx.moveTo(110, 160);
  ctx.bezierCurveTo(80, 200, 50, 300, 90, 350);
  ctx.lineTo(190, 350);
  ctx.bezierCurveTo(230, 300, 200, 200, 170, 160);
  ctx.closePath();
  ctx.fill();
}

function drawShortCape(ctx) {
  ctx.fillRect(95, 160, 90, 100);
}

function drawChestSymbol(ctx) {
  // Simple symbol representation
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(130, 180, 20, 20);

  // Add symbol initial
  ctx.fillStyle = '#1e293b';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(canvasOptions.symbol.charAt(0).toUpperCase(), 140, 195);
}

// Generate results
function generateResults() {
  const heroName = document.getElementById('heroName');
  if (!heroName || !heroName.value.trim()) {
    alert('Please enter a hero name.');
    return;
  }

  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  state.hero = {
    name: heroName.value.trim(),
    avatar: canvas.toDataURL('image/png'),
    strengths: state.strengths,
    focus: state.focus,
    scores: state.scores,
    created: Date.now()
  };

  buildResultsPage();
  goto('results');
}

function buildResultsPage() {
  const strengthsBlock = document.getElementById('strengthsBlock');
  const improveBlock = document.getElementById('improveBlock');

  if (strengthsBlock) {
    strengthsBlock.innerHTML = `
      <h3>🏆 Your Top Strengths</h3>
      <ul>
        ${state.hero.strengths.map(dim =>
      `<li><strong>${capitalize(dim)}:</strong> ${state.scores[dim]}%</li>`
    ).join('')}
      </ul>
      <p>These are your wellness superpowers! Consider how you can use these strengths to support your teammates.</p>
    `;
  }

  if (improveBlock) {
    const recommendations = getRecommendations(state.focus);
    improveBlock.innerHTML = `
      <h3>⚡ Focus Area: ${capitalize(state.focus)}</h3>
      <p>Evidence-based strategies to develop this superpower:</p>
      <ul>
        ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
    `;
  }
}

function getRecommendations(dimension) {
  const recommendations = {
    physical: [
      '150 minutes of moderate aerobic activity per week (WHO guidelines)',
      '2-3 strength training sessions weekly',
      '7-9 hours of quality sleep nightly',
      'Take hourly movement breaks during work',
      'Eat 5-9 servings of fruits and vegetables daily'
    ],
    emotional: [
      'Practice 10-15 minutes of daily mindfulness meditation',
      'Keep an emotion journal to track patterns',
      'Use deep breathing exercises during stress',
      'Maintain regular contact with supportive friends',
      'Engage in weekly self-care activities'
    ],
    intellectual: [
      'Read for 20-30 minutes daily',
      'Learn a new skill each month',
      'Engage in weekly puzzles or brain games',
      'Join discussion groups or book clubs',
      'Take online courses in areas of interest'
    ],
    social: [
      'Schedule weekly quality time with friends/family',
      'Join community groups or clubs',
      'Practice active listening skills',
      'Volunteer for meaningful causes monthly',
      'Attend social events regularly'
    ],
    spiritual: [
      'Spend 5-10 minutes daily in reflection or prayer',
      'Take weekly nature walks',
      'Clarify and write down your core values',
      'Practice gratitude journaling',
      'Engage in activities that provide meaning and purpose'
    ],
    occupational: [
      'Set 3 specific professional goals each quarter',
      'Create a daily work shutdown ritual',
      'Enroll in skill-building courses',
      'Take regular breaks throughout the workday',
      'Seek feedback and mentorship opportunities'
    ]
  };

  return recommendations[dimension] || [];
}

// Result action buttons
function setupResultButtons() {
  // Download PNG
  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const canvas = document.getElementById('heroCanvas');
      if (canvas && state.hero) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${state.hero.name}.png`;
        link.click();
      }
    });
  }

  // Export JSON
  const jsonBtn = document.getElementById('jsonBtn');
  if (jsonBtn) {
    jsonBtn.addEventListener('click', () => {
      if (state.hero) {
        const blob = new Blob([JSON.stringify(state.hero, null, 2)], {
          type: 'application/json'
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${state.hero.name}.json`;
        link.click();
      }
    });
  }

  // Email sharing
  const emailBtn = document.getElementById('emailBtn');
  if (emailBtn) {
    emailBtn.addEventListener('click', () => {
      if (state.hero) {
        const subject = encodeURIComponent(`My Wellness Superhero: ${state.hero.name}`);
        const body = encodeURIComponent(createEmailBody());
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
      }
    });
  }
}

function createEmailBody() {
  if (!state.hero) return '';

  const strengthsList = state.hero.strengths.map(dim =>
    `• ${capitalize(dim)}: ${state.scores[dim]}%`
  ).join('\n');

  const recommendations = getRecommendations(state.focus).map(rec => `• ${rec}`).join('\n');

  return `🦸 ${state.hero.name} - My Wellness Superhero Profile

TOP STRENGTHS:
${strengthsList}

FOCUS AREA: ${capitalize(state.focus)}

EVIDENCE-BASED IMPROVEMENT STRATEGIES:
${recommendations}

Created with the Wellness Superhero Builder
Generated on: ${new Date().toLocaleDateString()}

(Download the superhero image to see my avatar!)`;
}

// Utility functions
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Error handling
window.addEventListener('error', (event) => {
  console.error('JavaScript Error:', event.error);
  alert('An error occurred. Please refresh the page and try again.');
});

console.log('App.js loaded successfully!');
