import router from "../../router";
import { loggedUser, setLoggedUser, clearLoggedUser } from "../../states/loggedUser";
import { sendEmail } from "../../scripts/Tools/mail";
import CryptoJS from 'crypto-js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://localhost:3000`;
const API_URL = API_BASE_URL + `/api/v1`;

// const emit = defineEmits(['login']);


interface UserLogin {
    password: string,
    username: string
}

interface UserRegister {
    name: string,
    username: string,
    email: string,
    genere: string,
    ruolo: string,
    preferenze_notifiche: string,
    password: string,
    fileFoto: any
}


function generateVerificationToken() {
    const randomValue = Math.random().toString(36).substring(2); 
    const hash = CryptoJS.SHA256(randomValue).toString(CryptoJS.enc.Base64); 
    return hash;
}

export function logout() {
    clearLoggedUser();
    localStorage.removeItem('authToken'); 
    router.push("/login");
}
  

export function login(user: UserLogin) {
    const password = String(user.password);
    const hashedPassword = String(CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64));
    try {
        fetch(API_URL + '/authentications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            //hasha password
            body: JSON.stringify({ username: user.username, password: hashedPassword }),
        })
            .then((resp) => resp.json())
            .then(function (data) {
                setLoggedUser(data);
                localStorage.setItem('authToken', data.token);
                if (loggedUser.token) {
                    router.push("/");
                }
                else {
                    alert("Credenziali sbagliate o mail non verificata");
                }
                return;
            })
            .catch((error: any) => function (error: any) { throw new Error("Sbagliato") });
    } catch (error) {
        alert("Errore nella chiamata per il login, ci scusiamo, ritenta più tardi!");
    }
}




export async function registerUser(user: UserRegister) {
    const dataRegistrazione = new Date().toISOString();
    const file = user.fileFoto;

    try {
        if (!file) {
            alert('metti la foto profilo');
            return;
        }

        const signedUrlResponse = await fetch(`${API_BASE_URL}/generate-signed-url-foto-profilo`, {
            method: 'POST',
            headers: {
            },
        });
        const signedUrlData = await signedUrlResponse.json();
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
        const imageUrl = uploadData.secure_url || 'null';
        const password = String(user.password);
        const hashedPassword = String(CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64));
        const verificationToken = generateVerificationToken();
        const response = await fetch(`${API_BASE_URL}/api/Utenti`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: user.name,
                username: user.username,
                email: user.email,
                password: hashedPassword,
                genere: user.genere,
                data_registrazione: dataRegistrazione,
                preferenze_notifiche: user.preferenze_notifiche,
                ruolo: user.ruolo,
                verificationToken: verificationToken,
                foto_profilo: imageUrl
            }),
        });

        if (!response.ok) {
            throw new Error('Errore durante la registrazione dell\'utente');
        }

        const data = await response.json();
        await sendEmail(user.username, user.email, verificationToken);
        alert(`Utente ${data.user.username} creato con successo!, verifica la mail e accedi`);
    } catch (error) {
        alert("Qualcosa non è andato a buon fine");
    }
};