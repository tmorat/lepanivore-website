<template>
  <v-app class="body">
    <v-app-bar class="header" color="#8c5e32">
      <v-toolbar-title>Interface d'administration</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn rounded class="mr-5 mt-2" color="primary" max-height="50px" nuxt to="/admin/commandes">
          Commandes passées
        </v-btn>
        <v-btn rounded class="mr-5 mt-2" color="primary" max-height="50px" nuxt to="/admin/produits">
          Configuration des produits
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
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
.body {
  background-color: #dda;
}
</style>
