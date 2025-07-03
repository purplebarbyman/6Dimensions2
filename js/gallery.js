const gallery = document.getElementById('gallery');
const TTL = 30 * 60 * 1000; // 30 minutes

// Import heroes
document.getElementById('importFiles').addEventListener('change', e => {
  [...e.target.files].forEach(f => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const hero = JSON.parse(reader.result);
        addHero(hero);
      } catch (err) {
        alert('Invalid hero file.');
      }
    };
    reader.readAsText(f);
  });
});

// Add hero card
function addHero(h) {
  const endTime = h.created + TTL;
  const card = document.createElement('div');
  card.className = 'heroCard';
  card.innerHTML = `
    <img src="${h.avatar}" alt="${h.name}" width="150" />
    <h4>${h.name}</h4>
    <p><strong>Strengths</strong><br>${h.strengths.join(', ')}</p>
    <p><strong>Focus</strong><br>${capitalize(h.focus)}</p>
    <span class="timer"></span>`;
  gallery.appendChild(card);

  // Countdown
  const timerEl = card.querySelector('.timer');
  const intervalId = setInterval(() => {
    const left = endTime - Date.now();
    if (left <= 0) {
      clearInterval(intervalId);
      card.remove();
    } else {
      const m = Math.floor(left / 60000).toString().padStart(2, '0');
      const s = Math.floor((left % 60000) / 1000).toString().padStart(2, '0');
      timerEl.textContent = `⏳ ${m}:${s}`;
    }
  }, 1000);
}

// Utility
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
