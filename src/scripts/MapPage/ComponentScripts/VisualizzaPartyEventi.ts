const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://localhost:3000`;
import { loggedUser } from "../../../states/loggedUser";
import { aggiorna } from "../PageScript";
//SEZIONE EVENTO

//Ritorna il numero di partecipazioni ad un Evento e le sue faq
export async function estraiInformazioniEventi(id: any) {
    var partecipa = false;
    var npart = 0;
    var faq = [];
    
    try {
        const p = await fetch(`${API_BASE_URL}/api/Partecipazioni/Eventi/${id}`);
        const f = await fetch(`${API_BASE_URL}/api/faqeventi/evento/${id}`);

        if (f.ok){
            faq = await f.json();
        }
        

        if (p.ok){
            const partecipazioni = await p.json();
            npart = partecipazioni.length;

            if(loggedUser.token !== undefined){
                partecipazioni.forEach((part:any) => {
                    if (String(part._id) === String(loggedUser.id)){
                        partecipa = true;
                    }
                });
            }
        }
        if (!f.ok) {
            throw new Error(`Errore nella richiesta: ${f.status} ${f.statusText}`); 
        }

        if (!p.ok) {
            throw new Error(`Errore nella richiesta: ${p.status} ${p.statusText}`); 
        }
        return {numero_partecipazioni: npart, partecipa: partecipa, faq: faq};
    } catch (error) {
        return {numero_partecipazioni: npart, partecipa: partecipa, faq: faq};
    }

}

export async function partecipaEvento(id_evento: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Partecipazioni/Eventi/${id_evento}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${loggedUser.token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        alert("Errore durante l'iscrizione: " + error);
    }
}

export async function aggiungiFaq(id_evento: any, domanda: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/faqeventi`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specifica il formato JSON
                'Authorization': `Bearer ${loggedUser.token}` // Token per l'autenticazione
            },
            body: JSON.stringify({ id_evento, domanda }) // Cambia i nomi dei campi
        });

        if (!response.ok) {      
            throw new Error(`Errore nella richiesta: ${response.status}`);
        }

    } catch (error) {
        alert("Errore durante l'aggiunta: " + error);
    }
}

export async function rispondiFaq(id: any, risposta: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/faqeventi`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json', // Specifica il formato JSON
                'Authorization': `Bearer ${loggedUser.token}` // Token per l'autenticazione
            },
            body: JSON.stringify({ id: id, risposta: risposta }) // Cambia i nomi dei campi
        });

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status}`);
        }

    } catch (error) {
        alert("Errore durante l'aggiunta: " + error);
    }
}

export async function disinscriviEvento(id_evento: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Partecipazioni/Eventi/${id_evento}`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        alert("Errore durante la disicrizione: " + error);
    }
    
}


export async function eliminaEvento(id_evento: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/eventi/${id_evento}`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }
        
        aggiorna();
    } catch (error) {
        alert("Errore durante l'eliminazione: " + error);
    }
}


//SEZIONE PARTY

export async function disinscriviParty(id_party: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Partecipazioni/Party/${id_party}`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        alert("Errore durante la disicrizione: " + error);
    }
}
export async function eliminaParty(id_party: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/party/${id_party}`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

        aggiorna();
    } catch (error) {
        alert("Errore durante l'eliminazione: " + error);
    }
}

export async function partecipaParty(id_party: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Partecipazioni/Party/${id_party}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${loggedUser.token}`
                }
            }
        );
        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        alert("Errore durante l'iscrizione: " + error);
    }
}


export async function estraiPartecipazioniParty(id: any){
    try {
        const response = await fetch(`${API_BASE_URL}/api/Partecipazioni/Party/${id}`);
        
        var partecipa = false;
        var npart = 0;
        if (response.status === 404) {
            return {numero_partecipazioni: npart, partecipa: partecipa};
        }

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

        const partecipazioni = await response.json(); 

        npart = partecipazioni.length;

        if (loggedUser.token !== undefined) {
            partecipazioni.forEach((part: any) => {
                if (String(part._id) === String(loggedUser.id)){
                    partecipa = true;
                }
            });
        }

        return {numero_partecipazioni: npart, partecipa: partecipa};

    } catch (error) {
        return {numero_partecipazioni: 0, partecipa: []};
    }

}