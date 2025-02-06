const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://localhost:3000`;

// Funzione per caricare l'immagine su Cloudinary
export async function uploadImage(file: any, token: any) {
    const response = await fetch(`${API_BASE_URL}/generate-signed-url-eventi`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const signedUrlData = await response.json();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', signedUrlData.upload_preset);
    formData.append('timestamp', signedUrlData.timestamp);
    formData.append('signature', signedUrlData.signature);
    formData.append('api_key', signedUrlData.api_key);

    const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dc2ga9rlo/image/upload', {
        method: 'POST',
        body: formData,
    });

    const uploadData = await uploadResponse.json();
    return uploadData.secure_url || 'null';
}

// Funzione per creare l'evento
export async function createEvent(eventData: any, token: any) {
    const response = await fetch(`${API_BASE_URL}/api/eventi`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
    });

    const data = await response.json();
    return data;
}
