<template>
  <v-app>
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
    <v-content class="main-content">
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer class="footer" color="#8c5e32">
      <span>&copy; {{ new Date().getFullYear() }} - Boulangerie Le Panivore Inc.</span>
    </v-footer>
  </v-app>
</template>

<style scoped lang="scss">
.header {
  max-height: 64px;
}
.header,
.footer {
  color: #efd25c;
}
.main-content {
  background-color: #dda;
}
</style>
