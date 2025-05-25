import { uploadR2 } from "@/actions/article/articleActions";

const blobUrlToFile = async (blobUrl: string) => {
  const res = await fetch(blobUrl);
  const blob = await res.blob();
  const fileName = `upload-${Date.now()}`;
  return new File([blob], fileName, {
    type: blob.type,
    lastModified: Date.now(),
  });
};

export const blobToUploadUrl = async (contentHTML: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(contentHTML, "text/html");
  const images = Array.from(doc.querySelectorAll("img"));
  for (const img of images) {
    const src = img.getAttribute("src") || "";
    if (src.startsWith("blob:") || src.startsWith("data:")) {
      const file = await blobUrlToFile(src);
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadR2(formData);
      if (result.success && result.url) {
        img.src = result.url;
      } else {
        img.remove();
      }
    }
  }
  return doc.body.innerHTML;
};
