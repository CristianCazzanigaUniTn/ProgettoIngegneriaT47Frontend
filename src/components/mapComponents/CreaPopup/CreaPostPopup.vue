<template>
  <div v-if="isVisible" class="popup-overlay">
    <div class="popup-container">
      <div class="popup-header">
        <h2>Crea Post</h2>
        <button @click="closePopup" class="close-button">&times;</button>
      </div>

      <div class="form-group">
        <div class="image-upload">
          <label id="labelpi" for="postImage"><i class="fas fa-upload"></i> Carica una foto</label>
          <input type="file" id="postImage" name="postImage" accept="image/*" required @change="handleImageUpload" />
          <div class="image-preview" v-if="imagePreview">
            <img :src="imagePreview" alt="Anteprima Immagine" />
          </div>
        </div>

        <div class="description-container">
          <div class="user-info">
            <img :src="profilePicture" alt="Foto Profilo" class="profile-img" />
            <div class="user-name">{{ userName }}</div>
          </div>

          <div class="fixed-location">
            <strong>Posizione:</strong> <span>{{ location }}</span>
          </div>
          <div class="fixed-time">
            <strong>Data e Ora:</strong> <span>{{ dateTime }}</span>
          </div>
          <div class="form-group" id="desc">
            <strong>Descrizione:</strong>
            <textarea v-model="description" placeholder="Scrivi una descrizione..." required></textarea>
          </div>
        </div>
      </div>

      <button type="submit" class="submit-button" @click="postFormHandler" :disabled="isSubmitting">
        <span v-if="isSubmitting">Caricamento...</span>
        <span v-else>Crea Post</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { loggedUser } from '@/states/loggedUser.ts';
import { getPosition, fetchCityName } from '@/scripts/Tools/posizione';
import { aggiorna } from '@/scripts/MapPage/PageScript';
import { createPost, uploadImage } from '@/scripts/MapPage/ComponentScripts/CreaPost';

const isSubmitting = ref(false);
const userName = computed(() => loggedUser.username);
const profilePicture = computed(() => loggedUser.foto_profilo);
const description = ref('');
const imagePreview = ref(null);
const location = ref('');
const posizionePost = ref();
const dateTime = ref(new Date().toLocaleString());
const isVisible = ref(true);
const emit = defineEmits(['close-popup']);


onMounted(async () => {
  try {
    posizionePost.value = await getPosition();
    location.value = await fetchCityName(posizionePost.value.latitudine, posizionePost.value.longitudine);
  } catch (error) {
    console.error('Errore nel recupero della posizione o del luogo:', error);
  }
});

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
    const cs = document.getElementById('labelpi');
    cs.style.display = 'none';
  }
}

async function postFormHandler() {
  const descriptionValue = description.value;
  let imageUrl;

  if (descriptionValue === '') {
    alert("Per creare un post è necessario inserire una descrizione.");
    return; // Esce dalla funzione se la descrizione è vuota
  }
  const file = document.getElementById('postImage').files[0]; 
  const tokenFromStorage = loggedUser.token;
  if (!tokenFromStorage) {
    alert("Utente non autenticato!");
    return;
  }
  try {
    if (file) {
      isSubmitting.value = true; 
      imageUrl = await uploadImage(file, tokenFromStorage);
    }
    const postData = {
      descrizione: descriptionValue,
      contenuto: imageUrl || null, 
      luogo: location.value,
      posizione: posizionePost.value,
      data_creazione: dateTime.value,
    };
    console.log(postData);
    const postDataResponse = await createPost(postData, tokenFromStorage); 
    console.log(postDataResponse);
    alert('Post creato con successo');
    aggiorna(); 
  } catch (error) {
    alert('Errore nel caricamento: ' + error);
  } finally {
    isSubmitting.value = false; 
  }
  emit('close-popup'); 
}

function closePopup() {
  emit('close-popup');
}

</script>

<style scoped src="@/styles/popupCreaPost.css"></style>
