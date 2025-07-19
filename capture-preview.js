// 📸 Generate Image from Preview and Upload to Firebase
async function captureAndUploadPreview(docId) {
  const previewElement = document.getElementById("hero-preview");

  if (!previewElement || !docId) return;

  // Load html2canvas if not already
  if (typeof html2canvas === "undefined") {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Capture the preview
  const canvas = await html2canvas(previewElement);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

  const storageRef = firebase.storage().ref();
  const filePath = `heroes/hero-preview-${docId}.png`;
  const fileRef = storageRef.child(filePath);

  try {
    await fileRef.put(blob);
    const downloadURL = await fileRef.getDownloadURL();

    // Save image URL back to the Firestore doc
    await firebase.firestore().collection("heroes").doc(docId).update({
      previewImageUrl: downloadURL
    });
  } catch (error) {
    console.error("Image upload failed:", error);
  }



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