<template>
  <v-sheet elevation="2" class="pa-3">
    <v-row>
      <v-col cols="12" md="10">
        <v-autocomplete
          v-model="value.productId"
          :items="availableProducts"
          :hint="getDescriptionWithPrice(value.productId)"
          item-text="name"
          item-value="id"
          label="Sélectionnez votre produit"
          persistent-hint
          required
          :rules="[(v) => !!v || 'Un produit doit être sélectionné']"
          placeholder="Commencez à écrire pour rechercher"
          no-data-text="Aucun produit trouvé avec cette recherche"
          clearable
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="2">
        <v-text-field
          v-model="value.quantity"
          type="number"
          label="Quantité"
          :rules="[
            (v) => !!v || 'La quantité est requise',
            (v) => v <= 24 || 'La quantité ne peut pas dépasser 24',
            (v) => v >= 1 || 'La quantité doit être positive',
          ]"
          outlined
        ></v-text-field>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { ProductIdWithQuantity } from '../../back/src/domain/product/product-with-quantity';
import { ProductId } from '../../back/src/domain/type-aliases';
import { GetProductResponse } from '../../back/src/infrastructure/rest/models/get-product-response';

export default Vue.extend({
  name: 'ProductSelectionItem',
  props: {
    value: { required: true } as PropOptions<ProductIdWithQuantity>,
    availableProducts: { required: true } as PropOptions<GetProductResponse[]>,
  },
  methods: {
    getDescriptionWithPrice(productId: ProductId): string {
      const foundProduct: GetProductResponse | undefined = this.availableProducts.find((product: GetProductResponse) => product.id === productId);

      return foundProduct ? `${foundProduct.description} (${foundProduct.price.toFixed(2)}$ à l'unité)` : '';
    },
  },
});
</script>
