function goto(sectionId) {
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    section.classList.add("hidden");
  });

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.remove("hidden");
  }
}

window.onload = () => {
  goto("welcome"); // Show welcome screen first

  const startButton = document.getElementById("start-btn");
  if (startButton) {
    startButton.addEventListener("click", () => {
      goto("assessment");
    });
  } else {
    console.error("Start button not found.");
  }
};
