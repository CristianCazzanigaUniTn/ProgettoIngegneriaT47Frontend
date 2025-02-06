<template>
    mail verifica
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { verificaUtente } from '../scripts/Tools/mail.ts';

const route = useRoute(); // Accesso ai parametri di routing
const router = useRouter(); // Accesso per la navigazione

async function verifica() {
    const token = route.params.token; // Usa useRoute per accedere ai parametri del token
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
</script>
 // router.push('/login');