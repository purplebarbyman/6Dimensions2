
document.addEventListener("DOMContentLoaded", () => {
  renderFocusCards(); // already defined previously
  setupHeroForm();
});

function goto(sectionId) {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
  const target = document.getElementById(sectionId);
  if (target) target.classList.remove("hidden");

  // Scroll to top of the new section
  window.scrollTo({ top: 0, behavior: "smooth" });
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

    preview.innerHTML = `
      <div class="preview-card">
        <h4>${name}</h4>
        <p>🖌️ Skin: ${skin}, Hair: ${hair}, Cape: ${cape}, Emblem: ${emblem}</p>
        <p>🧬 Strengths: ${JSON.parse(localStorage.getItem("topDimensions")).join(", ")}</p>
        <p>🎯 Focus Area: ${localStorage.getItem("focusArea")}</p>
      </div>
    `;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Hero Created! (You can implement export/email next)");
    // You could also save hero profile here or navigate to gallery step
  });
}
