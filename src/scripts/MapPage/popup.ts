import { loggedUser } from "../../states/loggedUser";
import { estraiUtente } from "./estraiDati";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://localhost:3000`;



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
        console.log(party);
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
            time: party.data_inizio,
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
            time: evento.data_inizio,
            Categoria: categoria.nome
        };

        return res;
        
    } catch (error) {
        alert("Errore durante l'estrazione: " + error);
    }
}



