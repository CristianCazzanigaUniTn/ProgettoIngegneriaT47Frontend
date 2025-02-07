<template>
    <div v-if="isVisible" class="popup-overlay">
        <div id="popupPartyDiv" :style="{
            background: isParty ? '#f1fdf9' : '#f0f8ff'
        }">
            <button id="chiusuraParty" @click="closePopup">×</button>
            <div class="instagram-card">
                <div class="instagram-card-header">
                    <img :src="eventProfilePicture" alt="Profile Picture" class="instagram-card-user-image" />
                    <div>
                        <a :href="`/profilo/${eventUserId}`" class="instagram-card-user-name">{{ eventUsername }}</a>
                    </div>
                </div>
                <div class="instagram-card-image">
                    <img :src="eventImage" alt="Foto del party" />
                </div>
                <div class="instagram-card-content">
                    <p id="descrizioneParty" class="likes">{{ eventDescription }}</p>
                    <div class="categorie">
                        <span class="categorie-item">{{ eventCategory }}</span>
                    </div>
                    <div class="instagram-card-time">{{ eventTime }}</div>
                    <p class="partecipanti">
                        <span>{{ currentPartecipants }}</span> / <span>{{ eventMaxPartecipants }}</span> partecipanti
                    </p>
                    
                    <button id="azionePartyButton" class="button-iscrizione" @click="inscriviAEventoParty"
                        v-if="!partecipa && !organizzaEP && loggedUser.token !== undefined && loggedUser.ruolo === 'utente_base'">
                        Iscriviti
                    </button>
                    <button id="azionePartyButton" class="button-iscrizione" @click="disinscriviDaEventoParty"
                        v-if="partecipa && loggedUser.token !== undefined && loggedUser.ruolo === 'utente_base'">
                        Disiscriviti
                    </button>
                    <button id="azionePartyButton" class="button-iscrizione" @click="eliminaEventoParty"
                        v-if="organizzaEP && loggedUser.token !== undefined">
                        Elimina
                    </button>
                </div>

            </div>

            <div class="faq-input-container" v-if="!isParty && loggedUser.token !== undefined">

                <textarea id="faqInput" class="faq-input"
                    :placeholder="organizzaEP ? 'Rispondi ad una domanda...' : 'Scrivi una domanda...'"
                    v-model="newFaqText">
                </textarea>

                <button id="faqSubmit" class="faq-submit" @click="organizzaEP ? AnswerFaq() : addFaq()">
                    <span class="arrow-icon">&gt;</span>
                </button>
            </div>


            <div v-if="!isParty">
                <div v-for="(f, index) in faq" :key="f.domanda" class="faq-list">
                    <div class="faq-item" :class="{ 'selected-faq': selectedFaqIndex === index }"
                        @click="loggedUser.token !== undefined && organizzaEP ? selezionaFaq(index, f) : null">
                        <p><strong>Domanda:</strong> {{ f.domanda }}</p>
                        <p class="faq-risposta"><strong>{{ f.risposta }}</strong></p>
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { eventId, isParty } from "@/scripts/MapPage/PageScript.ts";
import {
    rispondiFaq, disinscriviEvento, disinscriviParty, eliminaParty, estraiInformazioniEventi, eliminaEvento,
    estraiPartecipazioniParty, partecipaEvento, partecipaParty, aggiungiFaq
} from "@/scripts/MapPage/ComponentScripts/VisualizzaPartyEventi.ts";
import { loggedUser } from "@/states/loggedUser.ts";

const newFaqText = ref('');
const selectedFaq = ref();
const selectedFaqIndex = ref(-1);
const partecipa = ref();
const currentPartecipants = ref();
const faq = ref([]);

// Props accettati dal componente
defineProps({
    eventUsername: {
        type: String,
        required: true,
    },
    eventProfilePicture: {
        type: String,
        required: true,
    },
    eventImage: {
        type: String,
        required: true,
    },
    eventDescription: {
        type: String,
        required: true,
    },
    eventTime: {
        type: String,
        required: true,
    },
    eventUserId: {
        type: String, // Oppure number se l'ID è numerico
        required: true,
    },
    eventMaxPartecipants: {
        type: Number,
        required: true,
    },
    eventCategory: {
        type: String, // Oppure number se l'ID è numerico
        required: true,
    },
    organizzaEP: {
        type: Boolean,
        required: true
    },
    isVisible: {
        type: Boolean,
        default: true, // Se il popup è visibile
    }
});

// Gestione degli eventi
const emit = defineEmits(["close-popup"]);

// Funzione per chiudere il popup
function closePopup() {
    emit("close-popup");
}

async function addFaq() {
    if (!newFaqText.value) {
        alert("La faq non può essere vuota");
        return;
    } else {
        aggiungiFaq(eventId.value, newFaqText.value);
        newFaqText.value = '';
        await refresh();
    }

}

async function refresh() {

    if (!isParty.value) {
        const infoEvento = await estraiInformazioniEventi(eventId.value);

        partecipa.value = infoEvento.partecipa;
        currentPartecipants.value = infoEvento.numero_partecipazioni;
        faq.value = infoEvento.faq;

    } else {
        const infoParty = await estraiPartecipazioniParty(eventId.value);

        partecipa.value = infoParty.partecipa;
        currentPartecipants.value = infoParty.numero_partecipazioni;
    }
}

function selezionaFaq(index, faq) {
    selectedFaqIndex.value = index; // Imposta l'indice dell'elemento selezionato
    selectedFaq.value = faq;

}

async function AnswerFaq() {
    if (!selectedFaq.value) {
        alert("Seleziona una faq a cui rispondere");
    } else {
        if (!newFaqText.value) {
            alert("La risposta non può essere vuota");
            return;
        } else {
            rispondiFaq(selectedFaq.value._id, newFaqText.value);
            newFaqText.value = '';
        }
        selectedFaq.value = undefined;
        selectedFaqIndex.value = -1;
        await refresh()
    }
}


// Funzione per iscriversi al party
async function inscriviAEventoParty() {
    if (isParty.value) {
        await partecipaParty(eventId.value);
    } else {
        await partecipaEvento(eventId.value);
    }
    await refresh()
}

async function disinscriviDaEventoParty() {
    if (isParty.value) {
        await disinscriviParty(eventId.value);
    } else {
        await disinscriviEvento(eventId.value);
    }
    await refresh()
}

async function eliminaEventoParty() {
    if (isParty.value) {
        await eliminaParty(eventId.value);
    } else {
        await eliminaEvento(eventId.value);
    }
    closePopup();
}

onMounted(async () => {
    await refresh(); // Esegui il refresh all'inizializzazione
});

</script>

<style scoped src="@/styles/viewPartyEvento.css"></style>