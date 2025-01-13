
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://localhost:3000`;



export async function sendEmail(username: string, email: string, verificationToken: string) {
    const emailSubject = 'Messaggio di verifica per la registrazione';

    const encoded = encodeURIComponent(verificationToken);
    const verificationLink = `https://progettoingegneriat47frontend.onrender.com/verifica/${encoded}`; // Inserisci il token dinamico
    const emailMessage = `Ciao ${username},\n\nBenvenuto nel nostro servizio! La tua registrazione è stata ricevuta.\n\nClicca sul link per verificare il tuo account:\n${verificationLink}`;

    try {
        const response = await fetch(`${API_BASE_URL}/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: email,
                subject: emailSubject,
                text: emailMessage,
                html: `<p>${emailMessage.replace(/\n/g, '<br>')}</p>`, // Formattazione HTML
            }),
        });

        if (!response.ok) {
            throw new Error('Errore durante l\'invio dell\'email');
        }

        const data = await response.json();
        console.log(data.message);

    } catch (error: any) {
        console.error(error.message)
    }
};
