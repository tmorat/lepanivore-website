<template>
  <v-sheet elevation="2" class="pa-3">
    <v-row>
      <v-col cols="12" md="8">
        <v-select
          v-model="value.productId"
          :items="availableProducts"
          :hint="getPriceWithDescription(value.productId)"
          item-text="name"
          item-value="id"
          label="Sélectionnez votre produit"
          persistent-hint
          required
          :rules="[(v) => !!v || 'Un produit doit être sélectionné']"
        ></v-select>
      </v-col>
      <v-col cols="6" md="2">
        <v-text-field
          v-model="value.quantity"
          type="number"
          label="Quantité"
          :rules="[
            (v) => !!v || 'La quantité est requise',
            (v) => v <= 10 || 'La quantité ne peut pas dépasser 10',
            (v) => v >= 1 || 'La quantité doit être positive',
          ]"
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="6" md="2">
        <v-text-field readonly disabled :value="getPrice(value.productId, value.quantity)" label="Prix" prepend-icon="mdi-currency-usd">
        </v-text-field>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { ProductIdWithQuantity } from '../../back/src/domain/product-with-quantity';
import { ProductId } from '../../back/src/domain/type-aliases';
import { GetProductResponse } from '../../back/src/infrastructure/rest/models/get-product-response';

export default Vue.extend({
  name: 'ProductSelectionItem',
  props: {
    value: { required: true } as PropOptions<ProductIdWithQuantity>,
    availableProducts: { required: true } as PropOptions<GetProductResponse[]>,
  },
  methods: {
    getPriceWithDescription(productId: ProductId): string {
      const foundProduct: GetProductResponse | undefined = this.availableProducts.find((product: GetProductResponse) => product.id === productId);

      return foundProduct ? `${foundProduct.price}$ (${foundProduct.description})` : '';
    },
    getPrice(productId: ProductId, quantity: number): number {
      const foundProduct: GetProductResponse | undefined = this.availableProducts.find((product: GetProductResponse) => product.id === productId);

      const totalPrice: number = foundProduct && quantity > 0 ? foundProduct.price * quantity : 0;

      return Math.round((totalPrice + Number.EPSILON) * 100) / 100;
    },
  },
});
</script>
