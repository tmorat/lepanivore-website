<template>
  <v-layout>
    <v-flex class="text-center">
      <h1>Commandes passées</h1>
      <v-data-table :headers="headers" :items="orders" :items-per-page="10" class="elevation-1">
        <template v-slot:item.products="{ item }">
          <span v-for="productWithQuantity in item.products" v-bind:key="productWithQuantity.product.id">
            - {{ productWithQuantity.product.name }} : {{ productWithQuantity.quantity }}<br />
          </span>
        </template>
        <template v-slot:item.pickUpDate="{ item }">
          {{ item.pickUpDate ? item.pickUpDate.split('T')[0] : '' }}
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Context } from '@nuxt/types';
import Vue from 'vue';
import { GetOrderResponse } from '../../../back/src/infrastructure/rest/models/get-order-response';

interface CommandesData {
  headers: Array<{ text: string; value: string }>;
  orders: GetOrderResponse[];
}

export default Vue.extend({
  name: 'commandes',
  middleware: 'auth',
  data() {
    return {
      headers: [
        { text: '#', value: 'id' },
        { text: 'Nom', value: 'clientName' },
        { text: 'Téléphone', value: 'clientPhoneNumber' },
        { text: 'Email', value: 'clientEmailAddress' },
        { text: 'Produits', value: 'products' },
        { text: 'Type de commande', value: 'type' },
        { text: 'Date de cueillette', value: 'pickUpDate' },
        { text: 'Adresse de livraison', value: 'deliveryAddress' },
      ],
      orders: [],
    } as CommandesData;
  },
  async asyncData(ctx: Context): Promise<object> {
    const orders: GetOrderResponse[] = await ctx.app.$apiService.getOrders();

    return { orders };
  },
});
</script>
