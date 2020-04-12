<template>
  <v-card>
    <v-card-title>
      Vos coordonnées
    </v-card-title>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="value.clientName" :rules="[(v) => !!v || 'Votre nom est requis']" label="Votre nom" required></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="value.clientPhoneNumber"
            :rules="[(v) => !!v || 'Votre numéro de téléphone est requis']"
            label="Votre numéro de téléphone"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="value.clientEmailAddress"
            :rules="[
              (v) => !!v || 'Votre adresse électronique est requise',
              (v) => emailRegex.test(v) || `L'adresse électronique entrée n'est pas valide`,
            ]"
            label="Votre adresse électronique"
            required
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { PostOrderRequest } from '../../back/src/infrastructure/rest/models/post-order-request';

interface ContactDetailsData {
  emailRegex: RegExp;
}

export default Vue.extend({
  name: 'ContactDetails',
  props: {
    value: { required: true } as PropOptions<PostOrderRequest>,
  },
  data() {
    return {
      emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    } as ContactDetailsData;
  },
});
</script>
