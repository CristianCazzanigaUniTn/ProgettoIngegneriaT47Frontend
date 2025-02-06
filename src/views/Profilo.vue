<template>
  <div class="contenitoreGenerale">
    <div class="container-box">
      <!-- Sezione sinistra: Profilo Utente -->
      <div class="left">
        <UserProfile 
          :name="userProfile.username" 
          :profileImage="userProfile.profileImage" 
        />
      </div>

      <!-- Sezione destra: Contenuti dell'utente -->
      <div class="right">
        <div v-if="posts.length > 0" class="sezione-contenuti">
          <h2 class="titoloOggi">POST DI OGGI</h2>
          <div class="listacards">
            <Card 
              v-for="post in posts" 
              :key="post.id" 
              :title="post.title" 
              :description="post.description" 
              :backgroundImage="post.image" 
            />
          </div>
        </div>

        <!-- Sezione Eventi -->
        <div v-if="events.length > 0" class="sezione-contenuti">
          <h2 class="titoloOggi">EVENTI DI OGGI</h2>
          <div class="listacards">
            <Card 
              v-for="event in events" 
              :key="event.id" 
              :title="event.name" 
              :description="event.date" 
              :backgroundImage="event.image" 
            />
          </div>
        </div>

        <!-- Sezione Party -->
        <div v-if="parties.length > 0" class="sezione-contenuti">
          <h2 class="titoloOggi">PARTY DI OGGI</h2>
          <div class="listacards">
            <Card 
              v-for="party in parties" 
              :key="party.id" 
              :title="party.name" 
              :description="party.description" 
              :backgroundImage="party.image" 
            />
          </div>
        </div>

        <!-- Nessun contenuto -->
        <div v-if="posts.length === 0 && events.length === 0 && parties.length === 0">
          <h2 class="titoloOggi">NESSUN CONTENUTO DISPONIBILE</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script src='@/scripts/ProfilePage/Profilo.ts'></script>
<style scoped src="@/styles/profile.css"></style>
