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
                var data_creazione = new Date(post.data_creazione);
                const data_creazione_data = data_creazione.toLocaleDateString(); 
                const data_creazione_ora = data_creazione.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}); 
                const data_creazioneF =(`Data creazione: ${data_creazione_data}, ${data_creazione_ora}`);   
                const postData = {
                    id: utente.user.id,
                    profileName: utente.user.username,
                    profileImage: utente.user.foto_profilo,
                    postImage: post.contenuto || '',
                    description: post.descrizione,
                    dataIndex: post._id,
                    latitudine: post.posizione.latitudine,
                    longitudine: post.posizione.longitudine,
                    dataCreazione: data_creazioneF
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

export async function estraiUtente(userId: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/utenti/${userId}`);
        if (!response.ok) return undefined;
        return await response.json();
    } catch (error) {
        return undefined;
    }
}


// Function to fetch all categories (as per your previous requirement)
export async function estraiCategorie() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/categoria`);
        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }
        
        const categorie = await response.json();
        return categorie; // Return the list of categories
        
    } catch (error) {
        console.error("Errore nell'estrazione delle categorie:", error);
        return [];
    }
}


async function estraiCategoria(id: any) {
    try {
        const c = await fetch(`${API_BASE_URL}/api/categoria/${id}`);
        if (c.status === 404) {
            return 0;
        }
        if (!c.ok) {
            throw new Error(`Errore nella richiesta: ${c.status} ${c.statusText}`);
        }
        return await c.json();   
    } catch (error){
        return null;
    }
}

export async function estraipartyid(id: any) {
    try {
        const p = await fetch(`${API_BASE_URL}/api/party/${id}`);

        if (p.status === 404) {
            return;
        }
        if (!p.ok) {
            throw new Error(`Errore nella richiesta: ${p.status} ${p.statusText}`);
        }
        const party = await p.json();
        const categoria = await estraiCategoria(party.Categoria);
        var utente = await estraiUtente(party.Organizzatore);
        utente = utente.user;
        const data = new Date(party.data_inizio);
        const dataFormato = data.toLocaleDateString(); 
        const oraFormato = data.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}); 
        const dataFinita=(`Data: ${dataFormato}, Ora: ${oraFormato}`);   
        const res = {
            id: utente.id,
            profileName: utente.username,
            profileImage: utente.foto_profilo,
            postImage: party.foto || 'https://via.placeholder.com/150',
            description: party.descrizione,
            dataIndex: party._id,
            latitudine: party.posizione.latitudine,
            longitudine: party.posizione.longitudine,
            dataType: 'party', // Cambiato da 'post' a 'party'
            maxpartecipanti: party.numero_massimo_partecipanti,
            time: dataFinita,
            Categoria: categoria.nome
        };
        return res;
    } catch (error) {
        alert('Errore durante l\'estrazione dei party: ' + error);
    }
}

export async function estraieventoid(id: any) {
    try {
        const e = await fetch(`${API_BASE_URL}/api/eventi/${id}`);
        if (e.status === 404) {
            return;
        }
        if (!e.ok) {
            throw new Error(`Errore nella richiesta: ${e.status} ${e.statusText}`);
        }
        const evento = await e.json();
        var utente = await estraiUtente(evento.Organizzatore);
        utente = utente.user;
        const data = new Date(evento.data_inizio);
        const dataFormato = data.toLocaleDateString(); 
        const oraFormato = data.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}); 
        const dataFinita=(`Data: ${dataFormato}, Ora: ${oraFormato}`);
        const categoria = await estraiCategoria(evento.Categoria);
        const res = {
            id: utente.id,
            profileName: utente.username,
            profileImage: utente.foto_profilo,
            postImage: evento.foto || 'https://via.placeholder.com/150',
            description: evento.descrizione,
            dataIndex: evento._id,
            latitudine: evento.posizione.latitudine,
            longitudine: evento.posizione.longitudine,
            dataType: 'evento', 
            maxpartecipanti: evento.numero_massimo_partecipanti,
            time: dataFinita,
            Categoria: categoria.nome
        };
        return res;
        
    } catch (error) {
        alert("Errore durante l'estrazione: " + error);
    }
}
