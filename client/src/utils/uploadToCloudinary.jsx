export async function uploadToCloudinary(files) {
  const uploadedUrls = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "auction_items");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dqedrt6zw/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    console.log("CLOUDINARY RESPONSE:", data); 

    if (!res.ok) {
      throw new Error(data.error?.message || "Upload failed");
    }

    uploadedUrls.push(data.secure_url);
  }

  return uploadedUrls;
}
