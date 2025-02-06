import { reactive, computed } from 'vue';




interface LoggedUser {
    token?: string;
    username?: string;
    id?: string;
    foto_profilo?: string;
    ruolo?: string;
}


const loggedUser = reactive<LoggedUser>({
    token: undefined,
    username: undefined,
    id: undefined,
    foto_profilo: undefined,
    ruolo: undefined
});


export function setLoggedUserFromToken() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error("Nessun token trovato in localStorage");
        return;
    }
    fetch('https://eventlyapi.onrender.com/api/v1/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then((resp) => resp.json())
        .then((data) => {
            if (data.success) {
                setLoggedUser(data.user);
                loggedUser.token = token;
            } else {
                console.error("Errore nel recupero dei dati utente");
            }
        })
        .catch((error) => {
            console.error("Errore nella richiesta dell'utente:", error);
        });
}


export const isAuthenticated = computed( () => {
    if (loggedUser.token !== undefined) {
        return true;
    }
    const token = localStorage.getItem('authToken');
    if (token) {
        setLoggedUserFromToken();
        console.log(loggedUser.foto_profilo);
    }
    return loggedUser.username !== undefined;
});

export const logUserId = computed(() => loggedUser.id);
export const logUserName = computed( () => ( isAuthenticated.value ? loggedUser.username : ''));
export const logProfilePicture = computed(() => ( isAuthenticated.value ? loggedUser.foto_profilo : ''));
export const logRuolo = computed( () => ( isAuthenticated.value ? loggedUser.ruolo : ''));

function setLoggedUser(data: LoggedUser): void {
    loggedUser.token = data.token;
    loggedUser.username = data.username;
    loggedUser.id = data.id;
    loggedUser.foto_profilo = data.foto_profilo;
    loggedUser.ruolo = data.ruolo;
}


function clearLoggedUser(): void {
    loggedUser.token = undefined;
    loggedUser.username = undefined;
    loggedUser.id = undefined;
    loggedUser.foto_profilo = undefined;
    loggedUser.ruolo = undefined;
}




export { loggedUser, setLoggedUser, clearLoggedUser };
