<template>
  <v-app>
    <v-app-bar class="header" color="#8c5e32">
      <v-toolbar-title><img class="logo" alt="Logo boulangerie Le Panivore" src="/img/logo-panivore.png" /></v-toolbar-title>
    </v-app-bar>
    <v-content class="main-content">
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>
    <Footer />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Footer from '~/components/Footer.vue';

export default Vue.extend({
  components: {
    Footer,
  },
});
</script>

<style scoped lang="scss">
.header {
  max-height: 64px;
  color: #efd25c;
}
.main-content {
  background-color: #dda;
}
.logo {
  margin-top: 8px;
  max-height: 55px;
}
</style>
