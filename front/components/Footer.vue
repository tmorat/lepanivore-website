<template>
  <v-footer class="footer" color="#8c5e32">
    <span>&copy; 2015-{{ new Date().getFullYear() }} - Boulangerie Le Panivore Inc. <v-icon>mdi-baguette</v-icon></span>
    <v-spacer />
    <span>
      <a class="footer-link" href="https://github.com/damienbeaufils/lepanivore-website" target="_blank"
        ><v-icon>mdi-github</v-icon> Open-Source Software made with <v-icon>mdi-heart</v-icon>️️</a
      >
    </span>
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Footer',
});
</script>

<style scoped lang="scss">
.footer,
.footer-link {
  color: #efd25c;
}
.footer-link {
  text-decoration: none;
}
</style>
