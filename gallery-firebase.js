
const gallery = document.getElementById('gallery');

// Load all heroes from Firebase
async function loadHeroes() {
  const snapshot = await db.collection("heroes").orderBy("created", "desc").get();
  snapshot.forEach(doc => addHero(doc.data()));
}

// Render each hero card
function addHero(h) {
  const card = document.createElement('div');
  card.className = 'heroCard';
  card.innerHTML = `
    <img src="${h.avatar}" alt="${h.name}" width="150">
    <h4>${h.name}</h4>
    <p><strong>Strengths</strong><br>${h.strengths.join(', ')}</p>
    <p><strong>Focus</strong><br>${h.focus}</p>
    <span class="timer"></span>`;
  gallery.appendChild(card);
}

// Auto-load all heroes on page load
document.addEventListener('DOMContentLoaded', () => {
  loadHeroes();
});
