const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://localhost:3000`;
import { loggedUser } from "../../../states/loggedUser";
import { estraiUtente } from "../estraiDati";
import { aggiorna } from "../PageScript";


//Estrai like (con id e nome utente) e commenti (con id e nome utente, testo e numero di like) di un post
export async function estraiInformazioniPost(id: any) {
    var like: any = [];
    var commento_like: any = [];
    var idLike: any = undefined;
    
    try {
        const l = await fetch(`${API_BASE_URL}/api/like/post/${id}`);
        const c = await fetch(`${API_BASE_URL}/api/commenti/post/${id}`);

        if (l.ok) {
            const likes = await l.json();

            for (const lk of likes) {
                var ut = await estraiUtente(lk.utente_id);
                ut = ut.user;
                if (lk.utente_id === loggedUser.id) {
                    idLike = lk._id;
                }
                like.push({ id_utente: ut.id, username: ut.username });
            }
        }

        if (c.ok) {
            const commenti = await c.json();

            for (const cm of commenti) {
                var ut = await estraiUtente(cm.utente_id);
                ut = ut.user;
                commento_like.push({
                    id_utente: ut.id,
                    img_utente: ut.foto_profilo,
                    username: ut.username,
                    testo: cm.commento
                });
            }
        }

        if (!l.ok) {
            throw new Error(`Errore nella richiesta: ${l.status} ${l.statusText}`);
        }

        if (!c.ok) {
            throw new Error(`Errore nella richiesta: ${c.status} ${c.statusText}`);
        }

        return { like: like, commenti: commento_like, idLike: idLike };

    } catch (error) {
        return { like: like, commenti: commento_like, idLike: idLike };
    }
}


export async function aggiungiCommento(post_id: any, contenuto: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/commenti`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specifica il formato JSON
                'Authorization': `Bearer ${loggedUser.token}` // Token per l'autenticazione
            },
            body: JSON.stringify({ post_id, contenuto }) // Cambia i nomi dei campi
        });

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status}`);
        }

    } catch (error) {
        alert("Errore nell'aggiunta del commento: " + error);
    }
}

export async function aggiungiLikePost(post_id: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/like/${post_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specifica il formato JSON
                'Authorization': `Bearer ${loggedUser.token}` // Token per l'autenticazione
            },
        });

        if (!response.ok) {
            // Stampa i dettagli per il debug
            throw new Error(`Errore nella richiesta: ${response.status}`);
        }

    } catch (error) {
        alert("Errore durante l'aggiunta: " + error);
        return undefined
    }
}

export async function eliminaLikePost(like_id: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/like/${like_id}`, {
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
        alert("Errore nell'elminazione: " + error);
    }
    
}


export async function eliminaPost(id_post: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Post/${id_post}`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        alert("Errore durante l'eliminazione: " + error);
    }
}
