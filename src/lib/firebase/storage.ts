"use client";

import { updateStudentProfile } from "./firestore";

// Resize photo to 300×300 max, convert to JPEG base64, store in Firestore.
// No Firebase Storage (paid) required — the data URL goes straight into the
// student document, which is well within Firestore's 1 MB document limit.
export async function uploadStudentPhoto(studentId: string, file: File): Promise<string> {
  const dataUrl = await resizeToDataUrl(file, 300, 0.8);
  await updateStudentProfile(studentId, { avatarUrl: dataUrl });
  return dataUrl;
}

function resizeToDataUrl(file: File, maxPx: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > height) {
        if (width > maxPx) { height = Math.round((height * maxPx) / width); width = maxPx; }
      } else {
        if (height > maxPx) { width = Math.round((width * maxPx) / height); height = maxPx; }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("canvas unavailable")); return; }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error("image load failed")); };
    img.src = objectUrl;
  });
}
