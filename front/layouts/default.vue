<template>
  <v-app>
    <v-app-bar class="header" color="#8c5e32">
      <v-toolbar-title><img class="logo" alt="Logo boulangerie Le Panivore" src="/img/logo-panivore.png" /></v-toolbar-title>
      <v-toolbar-items></v-toolbar-items>
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
.header,
.footer {
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
