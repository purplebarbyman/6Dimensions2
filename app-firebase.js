
function goto(section) {
  document.querySelectorAll('.card').forEach(c => c.classList.add('hidden'));
  const active = document.getElementById(section);
  if (active) {
    active.classList.remove('hidden');
    if (section === "assessment") renderSliders();
    if (section === "focus") renderFocusCards();
  }
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
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 2).map(entry => entry[0]);
  showTopStrengths(top);
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
  const heroForm = document.getElementById("heroForm");

  if (heroForm) {
    heroForm.onsubmit = async (e) => {
      e.preventDefault();

      const formData = new FormData(heroForm);
      const heroData = {
        powerWord: formData.get("powerWord"),
        costume: formData.get("costume"),
        tagline: formData.get("tagline"),
        emoji: formData.get("emoji"),
        timestamp: new Date()
      };

      try {
        const docRef = await firebase.firestore().collection("heroes").add(heroData);
        await captureAndUploadPreview(docRef.id);
        alert("✅ Superhero saved!");
      } catch (err) {
        console.error("❌ Error saving superhero:", err);
        alert("There was an error saving your superhero.");
      }
    };

    // 👇 Live Preview Listeners
    document.querySelector('input[name="powerWord"]')?.addEventListener("input", updateHeroPreview);
    document.querySelectorAll('input[name="costume"]').forEach(el =>
      el.addEventListener("change", updateHeroPreview)
    );
    document.querySelectorAll('input[name="emoji"]').forEach(el =>
      el.addEventListener("change", updateHeroPreview)
    );
    document.querySelector('select[name="tagline"]')?.addEventListener("change", updateHeroPreview);
  }

  // 👇 Tagline options
  const focusArea = localStorage.getItem("focusArea");
  if (focusArea) populateTaglines(focusArea);
});

function populateTaglines(focusArea) {
  const taglineSelect = document.getElementById("tagline-select");
  if (!taglineSelect) return;

  const taglinesByFocus = {
    physical: ["Strong body, strong mind.", "Fueling my fire.", "Movement is my power."],
    emotional: ["I lead with resilience.", "I feel deeply and stand strong.", "Mastering my emotions."],
    intellectual: ["Curiosity is my compass.", "I grow through knowledge.", "My mind is my might."],
    social: ["Connection gives me strength.", "Together we rise.", "Relationships are my superpower."],
    spiritual: ["Purpose drives me.", "I walk in alignment.", "Peace is my power."],
    occupational: ["I build with passion.", "Balance fuels my growth.", "Purpose in every task."]
  };

  const taglines = taglinesByFocus[focusArea] || [];
  taglineSelect.innerHTML = '<option value="">-- Select a tagline based on your focus area --</option>';
  taglines.forEach(tagline => {
    const option = document.createElement("option");
    option.value = tagline;
    option.textContent = tagline;
    taglineSelect.appendChild(option);
  });
}

function showTopStrengths(strengths) {
  const container = document.getElementById("focus-top-strengths");
  if (!container) return;
  container.innerHTML = `
    <h3>Your Strongest Wellness Dimensions:</h3>
    <ul>
      ${strengths.map(dim => `<li><strong>${capitalize(dim)}</strong></li>`).join("")}
    </ul>
    <p>Now choose one area you'd like to improve and focus on.</p>
  `;
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function updateHeroPreview() {
  const name = document.querySelector('input[name="powerWord"]')?.value || "";
  const emoji = document.querySelector('input[name="emoji"]:checked')?.value || "🦸";
  const tagline = document.querySelector('select[name="tagline"]')?.value || "";
  const color = document.querySelector('input[name="costume"]:checked')?.value || "default";

  const preview = document.getElementById("hero-preview");
  const emojiEl = document.getElementById("preview-emoji");
  const nameEl = document.getElementById("preview-name");
  const taglineEl = document.getElementById("preview-tagline");

  if (!preview || !emojiEl || !nameEl || !taglineEl) return;

  preview.classList.remove("hidden");
  preview.style.background = getPreviewColor(color);
  emojiEl.textContent = emoji;
  nameEl.textContent = name || "Your Hero Name";
  taglineEl.textContent = tagline || "Your motivational tagline will appear here.";
}

function getPreviewColor(theme) {
  const colors = {
    blue: "#1e3a8a",
    red: "#991b1b",
    green: "#166534",
    purple: "#6b21a8",
    default: "#2a2a2a"
  };
  return colors[theme] || colors.default;
}

async function captureAndUploadPreview(docId) {
  const preview = document.getElementById("hero-preview");
  if (!preview) return;

  if (typeof html2canvas === "undefined") {
    await loadScript("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js");
  }

  const canvas = await html2canvas(preview);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  const filePath = `hero_previews/${docId}.png`;
  const fileRef = firebase.storage().ref().child(filePath);

  await fileRef.put(blob);
  const downloadURL = await fileRef.getDownloadURL();

  await firebase.firestore().collection("heroes").doc(docId).update({
    imageUrl: downloadURL
  });

  console.log("✅ Preview image uploaded and saved.");
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
