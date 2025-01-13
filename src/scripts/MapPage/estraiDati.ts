const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://localhost:3000`;

export interface Posted {
    id: string;
    profileName: string;
    profileImage: string;
    postImage: string;
    description: string;
    dataIndex: string;
    latitudine: number;
    longitudine: number;
    dataType: 'post' | 'textual' | 'party' | 'evento';
}

export async function estraiDati(lat: number, lng: number, rad: number): Promise<Posted[]> {
    const posts: Posted[] = [];
    const eventi: Posted[] = [];
    const textuals: Posted[] = [];
    const parties: Posted[] = [];
    try {
        await Promise.all([
            estraiPostDaFile(lat, lng, rad, posts, textuals),
            estraiEventiDaFile(lat, lng, rad, eventi),
            estraiPartyDaFile(lat, lng, rad, parties),
        ]);
        return [...posts, ...eventi, ...parties, ...textuals];
    } catch (error) {
        return [];
    }
}

async function estraiPartyDaFile(lat: number, lng: number, rad: number, parties: Posted[]) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/party/ricerca`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng, rad }),
        });

        if (!response.ok) return;
        const data = await response.json();
        for (const party of data) {
            const utente = await estraiUtente(party.Organizzatore);
            if (utente) {
                parties.push({
                    id: utente.user.id,
                    profileName: utente.user.username,
                    profileImage: utente.user.foto_profilo,
                    postImage: party.foto || 'https://via.placeholder.com/150',
                    description: party.descrizione,
                    dataIndex: party._id,
                    latitudine: party.posizione.latitudine,
                    longitudine: party.posizione.longitudine,
                    dataType: 'party',
                });
            }
        }
    } catch (error) {
        alert("Errore durante l'estrazione: " + error);
    }
}

async function estraiPostDaFile(lat: number, lng: number, rad: number, posts: Posted[], textuals: Posted[]) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Post/ricerca`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng, rad }),
        });

        if (!response.ok) return;
        const data = await response.json();
        for (const post of data) {
            const utente = await estraiUtente(post.utente_id);
            if (utente) {
                const postData = {
                    id: utente.user.id,
                    profileName: utente.user.username,
                    profileImage: utente.user.foto_profilo,
                    postImage: post.contenuto || '',
                    description: post.descrizione,
                    dataIndex: post._id,
                    latitudine: post.posizione.latitudine,
                    longitudine: post.posizione.longitudine,
                };
                if (post.contenuto !== 'null') {
                    posts.push({ ...postData, dataType: 'post' });
                } else {
                    textuals.push({ ...postData, dataType: 'textual' });
                }
            }
        }
    } catch (error) {
        alert("Errore durante l'estrazione: " + error);
    }
}

async function estraiEventiDaFile(lat: number, lng: number, rad: number, eventi: Posted[]) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/eventi/ricerca`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng, rad }),
        });

        if (!response.ok) return;
        const data = await response.json();
        for (const evento of data) {
            const utente = await estraiUtente(evento.Organizzatore);
            if (utente) {
                eventi.push({
                    id: utente.user.id,
                    profileName: utente.user.username,
                    profileImage: utente.user.foto_profilo,
                    postImage: evento.foto || 'https://via.placeholder.com/150',
                    description: evento.descrizione,
                    dataIndex: evento._id,
                    latitudine: evento.posizione.latitudine,
                    longitudine: evento.posizione.longitudine,
                    dataType: 'evento',
                });
            }
        }
    } catch (error) {
        alert("Errore durante l'estrazione: " + error);
    }
}

async function estraiUtente(userId: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/utenti/${userId}`);
        if (!response.ok) return undefined;
        return await response.json();
    } catch (error) {
        return undefined;
    }
}

export async function verificaUtente(token: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/verify?token=${encodeURIComponent(token)}`);
        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        alert("Errore nella verifica: " + error);
    }
}
