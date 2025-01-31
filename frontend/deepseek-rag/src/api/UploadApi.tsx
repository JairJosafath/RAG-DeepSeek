export async function uploadDocument(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);
    formData.append("size", file.size.toString());
    formData.append("type", file.type);
  
    try {
      const response = await fetch("api/document", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload document");
      }
  
      return await response.text();
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  }
  