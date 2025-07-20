// 📸 Generate Image from Preview and Upload to Firebase
async function captureAndUploadPreview(docId) {
  // Load html2canvas if not already loaded
  if (typeof html2canvas === "undefined") {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const preview = document.getElementById("hero-preview");
  if (!preview) {
    console.error("Preview element not found.");
    return;
  }

  try {
    const canvas = await html2canvas(preview);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

    const filePath = `previews/${docId}.png`;
    const storageRef = firebase.storage().ref().child(filePath);

    await storageRef.put(blob);
    const downloadURL = await storageRef.getDownloadURL();

    // Save image URL to Firestore
    await firebase.firestore().collection("heroes").doc(docId).update({
      previewImageUrl: downloadURL
    });

    console.log("✅ Preview uploaded & URL saved:", downloadURL);
  } catch (err) {
    console.error("❌ Error capturing or uploading preview:", err);
  }
}