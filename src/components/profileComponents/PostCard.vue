<template>
  <div class="card" @click="showAlert" :style="{ backgroundImage: `url(${backgroundImage})`}">
    <div class="card-content">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-description">{{ description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    backgroundImage: {
      type: String,
      required: true,
    },
  },
  methods: {
    showAlert() {
      if (typeof window !== "undefined" && window.alert) {
        window.alert('Mi spiace!, questa funzionalità non è ancora stata aggiunta. Ci stiamo lavorando!, questa è la prima demo.');
      }
    }
  }
};
</script>

<style scoped src="@/styles/profile.css"></style>
