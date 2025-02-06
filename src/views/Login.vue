<template>
  <div class="contenitoreGenerale">
    <form>
      <span v-if="isAuthenticated">
        Welcome <a :href="HOST + '/profilo/' + logUserId">{{ logUserName }}</a>
        <button type="button" @click="logout">LogOut</button>
      </span>

      <span v-if="!isAuthenticated">
        <div class="login-box">
          <p class="small-text">IL SOCIAL NETWORK DI CUI HAI BISOGNO</p>
          <h1 class="title">EVENTLY</h1>
          <p class="sub-text">ENTRA e partecipa ad EVENTI</p>

          <form v-if="isLoginForm" class="login-form">
            <input v-model="userUsername" type="text" placeholder="Username" class="input-field" />
            <input v-model="userPassword" type="password" placeholder="Password" class="input-field" />
            <div class="buttons">
              <button type="button" class="btn access" @click="login({
                password: userPassword,
                username: userUsername
              })">LogIn</button>
              <button type="button" class="btn register" @click="clear()">Registrati</button>
            </div>
          </form>

          <form v-if="!isLoginForm" class="login-form">
            <div class="profile-picture-container">
              <label for="profilePictureInput" class="profile-picture-label">
                <div class="profile-picture-circle">
                  <img v-if="profilePicturePreview" :src="profilePicturePreview" alt="Foto Profilo"
                    class="profile-picture" />
                  <span v-else>foto profilo</span>
                </div>
              </label>
              <input type="file" id="profilePictureInput" ref="profilePictureInput" @change="handleProfilePictureChange"
                class="profile-picture-input" />
            </div>
            <input v-model="userName" type="text" placeholder="Nome" class="input-field" required />
            <input v-model="userUsername" type="text" placeholder="Username" class="input-field" required />
            <input v-model="userEmail" type="email" placeholder="Email" class="input-field" required />
            <input v-model="userPassword" type="password" placeholder="Password" class="input-field" required />
            <select v-model="userGender" class="input-field" required>
              <option value="" disabled selected>Seleziona Genere</option>
              <option value="Male">Maschio</option>
              <option value="Female">Femmina</option>
              <option value="Other">Altro</option>
            </select>

            <select v-model="userNotifications" class="input-field" required>
              <option value="" disabled selected>Seleziona preferenze sulle notifiche</option>
              <option value="email">Email</option>
            </select>

            <select v-model="userRole" class="input-field" required>
              <option value="" disabled selected>Seleziona Ruolo</option>
              <option value="utente_base">Utente Base</option>
              <option value="organizzatore">Organizzatore</option>
            </select>

            <div class="buttons">
              <button type="button" class="btn access" @click="registerUser({
                name: userName,
                username: userUsername,
                email: userEmail,
                genere: userGender,
                ruolo: userRole,
                preferenze_notifiche: userNotifications,
                password: userPassword, fileFoto: profilePictureFile
              })">Registrati</button>
              <button type="button" class="btn register" @click="clear()">Hai già un account? Accedi</button>
            </div>

          </form>

          <LoginGoogle />
        </div>
      </span>
    </form>
  </div>
</template>



<script setup>
import { ref } from 'vue';
import { isAuthenticated, logUserName, logUserId} from '@/states/loggedUser.ts';
import LoginGoogle from '@/components/loginComponents/LoginGoogle.vue'
import { login, registerUser, logout } from '@/scripts/LoginPage/login.ts'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://localhost:3000`;

const userName = ref('');
const userUsername = ref('');
const userEmail = ref('');
const userPassword = ref('');
const userGender = ref('');
const userNotifications = ref(false);
const userRole = ref('');
const isLoginForm = ref(true);


function clear() {
  isLoginForm.value = !isLoginForm.value;
  userName.value = '';
  userUsername.value = '';
  userEmail.value = '';
  userPassword.value = '';
  userGender.value = '';
  userNotifications.value = false;
  userRole.value = '';
}

const profilePicturePreview = ref(null);

var profilePictureFile = '';

function handleProfilePictureChange(event) {
  const file = event.target.files[0]; 
  if (file) {
    profilePictureFile = file;
    console.log(profilePictureFile);
    const reader = new FileReader();

    reader.onload = function (e) {
      profilePicturePreview.value = e.target.result; 
    };
    reader.readAsDataURL(file);
  }
}
</script>


<style scoped src="@/styles/login.css"></style>

