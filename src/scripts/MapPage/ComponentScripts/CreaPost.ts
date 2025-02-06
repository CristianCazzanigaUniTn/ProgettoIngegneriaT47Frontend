export async function createPost(postData: any, token: any) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Errore nel creare il post: ' + error);
    }
  }
  
  export async function uploadImage(file: any, token: any) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/generate-signed-url-post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", data.upload_preset);
      formData.append("timestamp", data.timestamp);
      formData.append("signature", data.signature);
      formData.append("api_key", data.api_key);
  
      const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dc2ga9rlo/image/upload', {
        method: 'POST',
        body: formData,
      });
  
      const uploadData = await uploadResponse.json();
      return uploadData.secure_url;
    } catch (error) {
      throw new Error('Errore nel caricamento dell\'immagine: ' + error);
    }
  }