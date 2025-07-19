
function goto(sectionId) {
  document.querySelectorAll("section").forEach((s) => s.classList.add("hidden"));
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.remove("hidden");
    target.scrollIntoView({ behavior: "smooth" });
  } else {
    console.warn(`Section with ID "${sectionId}" not found.`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  goto("welcome");

  const startButton = document.getElementById("start-btn");
  if (startButton) {
    startButton.addEventListener("click", () => {
      goto("assessment");
    });
  }

  const form = document.getElementById("quiz-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const scores = {
        physical: parseInt(document.getElementById("physical").value, 10),
        emotional: parseInt(document.getElementById("emotional").value, 10),
        intellectual: parseInt(document.getElementById("intellectual").value, 10),
        social: parseInt(document.getElementById("social").value, 10),
        spiritual: parseInt(document.getElementById("spiritual").value, 10),
        occupational: parseInt(document.getElementById("occupational").value, 10)
      };
      const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      const topTwo = sorted.slice(0, 2).map(entry => entry[0]);
      localStorage.setItem("topDimensions", JSON.stringify(topTwo));
      goto("focus");
    });
  }

  renderFocusCards();
});

const DIMENSION_DETAILS = {
  physical: {
    name: "Physical Wellness",
    description: "Improve strength, flexibility, sleep, and energy through exercise and healthy habits.",
    emoji: "💪"
  },
  emotional: {
    name: "Emotional Wellness",
    description: "Build emotional resilience, stress management, and self-awareness.",
    emoji: "💖"
  },
  intellectual: {
    name: "Intellectual Wellness",
    description: "Stimulate your mind with creativity, critical thinking, and continuous learning.",
    emoji: "🧠"
  },
  social: {
    name: "Social Wellness",
    description: "Strengthen relationships, build community, and improve communication skills.",
    emoji: "🤝"
  },
  spiritual: {
    name: "Spiritual Wellness",
    description: "Connect with your values, find purpose, and explore mindfulness or meaning.",
    emoji: "🧘"
  },
  occupational: {
    name: "Occupational Wellness",
    description: "Pursue meaningful work, maintain work-life balance, and grow professionally.",
    emoji: "🛠️"
  }
};

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
