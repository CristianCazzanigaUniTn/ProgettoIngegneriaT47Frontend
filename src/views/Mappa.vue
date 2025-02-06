

<template>
  <div class="contenitoreGenerale">
    <!-- Loader -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <h1>Caricamento...</h1>
      </div>
    </div>

    <!-- Contenuto -->
    <div class="content">
      <!-- Pulsante di creazione Post/Party -->
      <div v-if="isAuthenticated && isMobile" class="mobile-buttons">
        <div v-if="logRuolo === 'utente_base'">
          <button class="floatingPostMobilePost" @click="openPopup('CreaPost')">
            <img src="@/assets/post.png" alt="Post" />
          </button>
          <button class="floatingPostMobileParty" @click="openPopup('CreaParty')">
            <img src="@/assets/party.png" alt="Party" />
          </button>
        </div>
        <div v-else-if="logRuolo === 'organizzatore'">
          <button class="floatingPostMobileEvento" @click="openPopup('CreaEvento')">
            <img src="@/assets/shop.png" alt="Evento" />
          </button>
        </div>
      </div>
      <!-- Pulsante di creazione Post/Party per desktop -->
      <div v-else-if="isAuthenticated" id="floatingButton">
        <span class="plus">+</span>
        <div v-if="logRuolo === 'utente_base'">
          <span @click="openPopup('CreaPost')" class="text1">Post</span>
          <span @click="openPopup('CreaParty')" class="text2">Party</span>
        </div>
        <div v-else-if="logRuolo === 'organizzatore'">
          <span @click="openPopup('CreaEvento')" class="text3">Evento</span>
        </div>
      </div>

      <!-- Box di contenuto con mappa e sidebar -->
      <div class="container-box">
        <div class="left">



          <div class="filtri">
            <div class="filter-container" id="filtroVisualizza"  @mouseenter="!isMobile && (filtroSinistra = true)"
            @mouseleave="!isMobile && (filtroSinistra = false)">
              <img src="@/assets/filtri.png" alt="Filter Icon" style="cursor:pointer;" 
              @click="isMobile && (filtroSinistra = !filtroSinistra)" />
              <div class="filter-window" v-if="filtroSinistra">
                <h4>Visualizza</h4>
                <div class="filter-options">
                  <div>
                    <label><input type="checkbox" v-model="filtri.post" @change="aggiorna()" /> Post</label>
                    <label><input type="checkbox" v-model="filtri.party" @change="aggiorna()" /> Party</label>
                    <label><input type="checkbox" v-model="filtri.evento" @change="aggiorna()" /> Eventi</label>
                    <label><input type="checkbox" v-model="filtri.textual" @change="aggiorna()" /> Text</label>
                  </div>
                </div>
              </div>
            </div>


            <div class="filter-container2" @mouseenter="filtroDestra = true" @mouseleave="filtroDestra = false">
              <img src="@/assets/ordina.png" alt="Filter Icon" style="cursor:pointer;" />
              <div v-if="filtroDestra" class="filter-window">
                <h4>Ordina</h4>
                <div class="filter-options">
                  <div>
                    <label>
                      <input type="checkbox" :checked="selectedOption === 'post'" @change="selectOption('post')" />
                      Post
                    </label>
                    <label>
                      <input type="checkbox" :checked="selectedOption === 'textual'"
                        @change="selectOption('textual')" />
                      Textual
                    </label>
                    <label>
                      <input type="checkbox" :checked="selectedOption === 'party'" @change="selectOption('party')" />
                      Party
                    </label>
                    <label>
                      <input type="checkbox" :checked="selectedOption === 'evento'" @change="selectOption('evento')" />
                      Evento
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <aside class="sidebar">
            <div v-for="(card, index) in sideCards" :key="index">
              <SideCard :profileName="card.profileName" :profileImage="card.profileImage" :postImage="card.postImage"
                :description="card.description" :dataIndex="card.dataIndex" :dataType="card.dataType" :id="card.id"
                :latitudine="card.latitudine" :longitudine="card.longitudine" />
            </div>
          </aside>
        </div>
        <div class="right">
          <div id="map"></div>
        </div>
      </div>
    </div>

    <!-- Popup per la visualizzazione del Post -->
    <PostPopup v-if="showPopupPost" :isVisible="showPopupPost" :profileName="postUserName"
      :profileImage="postProfilePicture" :postImage="postImage" :description="postDescription" :time="postTime"
      :userIdView="userIdView" :organizzaP="organizza" @close-popup="closePopup('VisualizzaPost')" />

    <!-- Popup per la visualizzazione del Party/Evento -->
    <PartyEventoPopup v-if="showPopupPartyEvento" :isVisible="showPopupPartyEvento" :profileNameEP="profileNameep"
      :profileImageEP="profileImageep" :partyImageEP="partyImageep" :descriptionEP="descriptionep" :timeEP="timeep"
      :userIdViewEP="userIdViewep" :maxParticipantsEP="maxParticipantsep" :categoryEP="categoryep"
      :organizzaEP="organizza" :idEP="idep" @close-popup="closePopup('VisualizzaPartyEvento')" />

    <!-- Popup per la creazione di Post -->
    <CreaPostPopup v-if="showPopupCreaPost" :isVisible="showPopupCreaPost" :userName="userName"
      :profilePicture="profilePicture" :description="description" :location="location" :dateTime="dateTime"
      @close-popup="closePopup('CreaPost')" />

    <!-- Popup per la creazione di Party -->
    <CreaPartyPopup v-if="showPopupCreaParty" :isVisible="showPopupCreaParty" @close-popup="closePopup('CreaParty')" />
    <!-- Popup per la creazione di Evento -->
    <CreaEventoPopup v-if="showPopupCreaEvento" :isVisible="showPopupCreaEvento"
      @close-popup="closePopup('CreaEvento')" />
  </div>
</template>


<script setup>
import {ref, onMounted } from 'vue';
import { initMap } from '../scripts/MapPage/Mappa';
import CreaPostPopup from '@/components/mapComponents/CreaPopup/CreaPostPopup.vue';
import CreaPartyPopup from '@/components/mapComponents/CreaPopup/CreaPartyPopup.vue';
import CreaEventoPopup from '@/components/mapComponents/CreaPopup/CreaEventoPopup.vue';
import PostPopup from '@/components/mapComponents/ViewPopup/VisualizzaPostPopup.vue';
import SideCard from '@/components/mapComponents/mapElements/SideCard.vue';
import PartyEventoPopup from '@/components/mapComponents/ViewPopup/VisualizzaEventoParty.vue';

//component popup import
import { showPopupPartyEvento, showPopupPost, showPopupCreaEvento, showPopupCreaParty, showPopupCreaPost, closePopup, openPopup, CloseAllPopup} from '@/scripts/MapPage/PageScript.ts';

//valori popup post
import {postUserName, postProfilePicture, postTime, postImage, postDescription, userIdView } from '@/scripts/MapPage/PageScript.ts';

//valori popup party ed evento
import {profileNameep, profileImageep, partyImageep, descriptionep, timeep, userIdViewep, maxParticipantsep, categoryep, idep } from '@/scripts/MapPage/PageScript.ts';

//
import {sideCards,  isLoading, filtri, selectedOption, selectOption, aggiorna, organizza} from '@/scripts/MapPage/PageScript.ts';

import{isAuthenticated, logRuolo} from '@/states/loggedUser.ts'

const filtroSinistra = ref(false);
const filtroDestra = ref(false);
const isMobile = ref(false);
const mobileSize = 768;

//Inizializzazione pagina 
onMounted(() => {
  CloseAllPopup();
  isMobile.value = window.innerWidth <= mobileSize;
  initMap();
});

</script>

<style scoped src="@/styles/mappa.css"></style>
