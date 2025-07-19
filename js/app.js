
function goto(sectionId) {
  // Hide all sections
  document.querySelectorAll("section").forEach((s) => s.classList.add("hidden"));

  // Show the selected section
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.remove("hidden");
    target.scrollIntoView({ behavior: "smooth" });
  } else {
    console.warn(`Section with ID "${sectionId}" not found.`);
  }
}

window.onload = () => {
  goto("welcome"); // Show welcome screen first

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

      window.localStorage.setItem("topDimensions", JSON.stringify(topTwo));

      goto("focus");
    });
  }
};
