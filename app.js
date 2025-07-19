
const DIMENSION_DETAILS = {
  physical: { name: "Physical Wellness", emoji: "💪", description: "Energy, activity, nutrition" },
  emotional: { name: "Emotional Wellness", emoji: "😊", description: "Mood, stress, resilience" },
  intellectual: { name: "Intellectual Wellness", emoji: "🧠", description: "Learning, creativity, curiosity" },
  social: { name: "Social Wellness", emoji: "🤝", description: "Relationships, community" },
  spiritual: { name: "Spiritual Wellness", emoji: "🧘", description: "Purpose, inner peace, values" },
  occupational: { name: "Occupational Wellness", emoji: "💼", description: "Work, purpose, satisfaction" }
};

function goto(step) {
  document.querySelectorAll("section").forEach(section => section.classList.add("hidden"));
  document.getElementById(step)?.classList.remove("hidden");
  window.scrollTo(0, 0);
}

function startJourney() {
  goto("quiz");
}

function submitAssessment() {
  const scores = {};
  document.querySelectorAll(".quiz-slider").forEach(slider => {
    scores[slider.name] = parseInt(slider.value, 10);
  });

  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  const topTwo = sorted.slice(0, 2);
  localStorage.setItem("topDimensions", JSON.stringify(topTwo));

  renderFocusCards();  // Critical fix
  goto("focus");
}

function renderFocusCards() {
  const top = JSON.parse(localStorage.getItem("topDimensions")) || [];
  const all = Object.keys(DIMENSION_DETAILS);
  const choices = all.filter(d => !top.includes(d));

  const container = document.getElementById("focus-options");
  if (!container) return;

  container.innerHTML = "";
  choices.forEach(dimension => {
    const { name, description, emoji } = DIMENSION_DETAILS[dimension];
    const card = document.createElement("div");
    card.className = "focus-card";
    card.innerHTML = `
      <div class="card-header">${emoji} <strong>${name}</strong></div>
      <p>${description}</p>
      <button class="btn small" data-dimension="${dimension}">Focus Here</button>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const selected = btn.getAttribute("data-dimension");
      localStorage.setItem("focusArea", selected);
      goto("hero");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const target = btn.getAttribute("data-target");
      if (target) goto(target);
    });
  });
});
