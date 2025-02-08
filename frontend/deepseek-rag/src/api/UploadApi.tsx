export async function uploadDocument(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);
  
    try {
      const response = await fetch("api/document", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload document: "+await response.text());
      }
  
      return await response.text();
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  }
  