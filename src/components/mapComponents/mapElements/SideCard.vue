<template>
    <div class="card" :data-index="dataIndex" :data-type="dataType" @click="apriPopUpVisualizza(props, {lat: props.latitudine, lng: props.longitudine})"  :style="{
        background: dataType === 'party' ? '#e0f7f1' : 
                    (dataType === 'evento' ? '#cfe2ff' : 
                    ('#ffffff'))
     }">
        <div class="card-header">
        
            <img class="card-img-top" :src="profileImage" alt="Foto Profilo">
            <router-link :to="`/profilo/${id}`">
            <strong>{{ profileName }}</strong>
            </router-link>
            <img :src="imageSrc" alt="Icona Party" class="higIcon">
        </div>
        <div class="card-body" v-if="dataType === 'post' || dataType === 'evento' || dataType === 'party'">
            <img class="post-image" :src="postImage" alt="Foto Post">
            <p class="card-description">{{ description }}</p>
        </div>
        <div class="card-body" v-else-if="dataType === 'textual'">
            <div class="textual-content">
                <div class="textual-text">
                    <p>{{ description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>



<script setup>
import { apriPopUpVisualizza } from '@/scripts/MapPage/PageScript';
import { computed } from 'vue'; 

const props = defineProps({
    profileName: String,
    profileImage: String,
    postImage: String,
    description: String,
    dataIndex: String,
    dataType: String,
    latitudine: Number,
    longitudine: Number,
    id: String
});


import partyImageSrc from '@/assets/party.png';
import eventoImageSrc from '@/assets/shop.png';
import postImageSrc from '@/assets/post.png';
import textImageSrc from '@/assets/text.png';

const imageSrc = computed(() => {
  switch (props.dataType) {
    case 'party':
      return partyImageSrc;
    case 'evento':
      return eventoImageSrc;
    case 'post':
      return postImageSrc;
    case 'textual':
      return textImageSrc;
    default:
      return '';
  }
});
</script>

<style scoped src="@/styles/mappa.css"></style>