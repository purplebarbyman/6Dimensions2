// 📸 Generate Image from Preview and Upload to Firebase
async function captureAndUploadPreview(heroId) {
  const preview = document.getElementById("hero-preview");
  if (!preview) return console.error("Preview not found");

  // Load html2canvas if it's not already loaded
  if (typeof html2canvas === 'undefined') {
    await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
  }

  html2canvas(preview).then(async canvas => {
    const dataUrl = canvas.toDataURL("image/png");
    const blob = await (await fetch(dataUrl)).blob();

    const storageRef = firebase.storage().ref().child(`hero_previews/${heroId}.png`);
    await storageRef.put(blob);
    const downloadURL = await storageRef.getDownloadURL();

    // Save the image URL to Firestore
    await firebase.firestore().collection("heroes").doc(heroId).update({
      imageUrl: downloadURL
    });

    console.log("✅ Preview image uploaded and URL saved:", downloadURL);
  });
}

// Dynamically load a script
function loadScript(src) {
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    document.head.appendChild(script);
  });
}