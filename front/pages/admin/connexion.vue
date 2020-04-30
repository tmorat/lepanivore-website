<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title>Connexion à l'interface d'administration</v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="validateAndSubmit">
            <v-text-field
              v-model="username"
              :rules="[(v) => !!v || `Nom d'utilisateur requis`]"
              label="Nom d'utilisateur"
              required
              prepend-icon="mdi-account"
            ></v-text-field>

            <v-text-field
              v-model="password"
              :rules="[(v) => !!v || `Mot de passe requis`]"
              label="Mot de passe"
              required
              prepend-icon="mdi-lock"
              type="password"
            ></v-text-field>
            <v-alert type="error" v-if="hasError">
              Nom d'utilisateur ou mot de passe incorrect
            </v-alert>
            <v-layout justify-end>
              <v-btn :loading="isLoading" color="primary" type="submit" large>
                Se connecter
              </v-btn>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';

interface LoginDataInterface {
  username: string;
  password: string;
  isLoading: boolean;
  hasError: boolean;
}

export default Vue.extend({
  layout: 'admin',
  data() {
    return {
      username: '',
      password: '',
      isLoading: false,
      hasError: false,
    } as LoginDataInterface;
  },

  methods: {
    async validateAndSubmit(): Promise<void> {
      // @ts-ignore
      if (this.$refs.form.validate()) {
        try {
          this.isLoading = true;
          // @ts-ignore
          await this.$auth.loginWith('local', {
            data: {
              username: this.username,
              password: this.password,
            },
          });
        } catch (e) {
          this.hasError = true;
        } finally {
          this.isLoading = false;
        }
      }
    },
  },
});
</script>
