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


export const isAuthenticated = computed(() => loggedUser.token !== undefined);
export const logUserId = computed(() => loggedUser.id);
export const logUserName = computed(() => (isAuthenticated.value ? loggedUser.username : ''));
export const logProfilePicture = computed(() => (isAuthenticated.value ? loggedUser.ruolo : ''));
export const logRuolo = computed(() => (isAuthenticated.value ? loggedUser.ruolo : ''));

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




export { loggedUser, setLoggedUser, clearLoggedUser};
