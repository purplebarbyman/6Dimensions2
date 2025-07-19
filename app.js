
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start-journey")?.addEventListener("click", () => goto("assessment"));
  renderFocusCards();
  setupHeroForm();
});

function goto(sectionId) {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
  const target = document.getElementById(sectionId);
  if (target) target.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
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

function setupHeroForm() {
  const form = document.getElementById("hero-form");
  const preview = document.getElementById("hero-avatar");

  if (!form) return;

  form.addEventListener("input", () => {
    const name = document.getElementById("hero-name").value || "Your Hero";
    const skin = document.getElementById("skin-tone").value;
    const hair = document.getElementById("hair-style").value;
    const cape = document.getElementById("cape-style").value;
    const emblem = document.getElementById("emblem").value;

    const topDims = JSON.parse(localStorage.getItem("topDimensions")) || [];
    const focus = localStorage.getItem("focusArea") || "N/A";

    preview.innerHTML = `
      <div class="preview-card">
        <h4>${name}</h4>
        <p>🖌️ Skin: ${skin}, Hair: ${hair}, Cape: ${cape}, Emblem: ${emblem}</p>
        <p>🧬 Strengths: ${topDims.join(", ")}</p>
        <p>🎯 Focus Area: ${focus}</p>
      </div>
    `;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Hero Created! (You can implement export/email next)");
  });
}

const DIMENSION_DETAILS = {
  physical: { name: "Physical", emoji: "💪", description: "Boost your energy and endurance." },
  emotional: { name: "Emotional", emoji: "💖", description: "Manage stress and express emotions." },
  intellectual: { name: "Intellectual", emoji: "🧠", description: "Engage your mind and curiosity." },
  social: { name: "Social", emoji: "🤝", description: "Build strong relationships." },
  spiritual: { name: "Spiritual", emoji: "🧘", description: "Find purpose and peace." },
  occupational: { name: "Occupational", emoji: "🛠️", description: "Pursue meaning in your work." }
};
