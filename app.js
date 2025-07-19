
function goto(section) {
  document.querySelectorAll('.card').forEach(c => c.classList.add('hidden'));
  document.getElementById(section).classList.remove('hidden');
}

function submitAssessment() {
  const sliders = document.querySelectorAll("#sliders input[type='range']");
  const scores = {};
  sliders.forEach(slider => {
    scores[slider.name] = parseInt(slider.value);
  });
  localStorage.setItem("wellnessScores", JSON.stringify(scores));
  goto("focus");
}

function renderSliders() {
  const dimensions = ["physical", "emotional", "intellectual", "social", "spiritual", "occupational"];
  const container = document.getElementById("sliders");
  if (!container) return;

  container.innerHTML = "";
  dimensions.forEach(dimension => {
    const label = document.createElement("label");
    label.innerText = dimension.charAt(0).toUpperCase() + dimension.slice(1);
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = 1;
    slider.max = 10;
    slider.name = dimension;
    slider.value = 5;
    container.appendChild(label);
    container.appendChild(slider);
    container.appendChild(document.createElement("br"));
  });
}

function renderFocusCards() {
  const scores = JSON.parse(localStorage.getItem("wellnessScores")) || {};
  const sorted = Object.entries(scores).sort((a,b)=>b[1]-a[1]);
  const top = sorted.slice(0, 2).map(entry => entry[0]);
  localStorage.setItem("topDimensions", JSON.stringify(top));

  const all = ["physical", "emotional", "intellectual", "social", "spiritual", "occupational"];
  const choices = all.filter(d => !top.includes(d));
  const container = document.getElementById("focus-options");
  if (!container) return;

  container.innerHTML = "";
  choices.forEach(dimension => {
    const card = document.createElement("div");
    card.className = "focus-card";
    card.innerHTML = `
      <div><strong>${dimension.toUpperCase()}</strong></div>
      <p>Focus on improving your ${dimension} wellness.</p>
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
  renderSliders();
  renderFocusCards();

  const heroForm = document.getElementById("heroForm");
  if (heroForm) {
    heroForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(heroForm).entries());
      console.log("Hero Data:", data);
      alert(`Hero Created!
Name: ${data.powerWord}
Tagline: "${data.tagline}"
Emoji: ${data.emoji}`);
    });
  }
});
