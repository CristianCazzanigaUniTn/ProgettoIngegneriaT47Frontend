import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { verificaUtente } from '../Tools/mail';

export function useVerifica() {
    const route = useRoute();
    const router = useRouter();

    async function verifica() {
        const token = route.params.token as string;
        try {
            await verificaUtente(token);
            alert("Account verificato");
            router.push('/login');
        } catch (error) {
            console.error("Errore durante la verifica:", error);
            alert("Si è verificato un errore durante la verifica");
            router.push('/');
        }
    }

    onMounted(() => {
        verifica();
    });

    return {};
}
