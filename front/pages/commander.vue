<template>
  <v-layout>
    <v-flex class="text-center">
      <h1>Commander pour une cueillette ou livraison</h1>
      <v-form ref="form" @submit.prevent="validateAndSubmit">
        <v-container>
          <ContactDetails :value="order" class="mb-5"></ContactDetails>
          <OrderTypeSelection :value="order" :closing-periods="closingPeriods" class="mb-5"></OrderTypeSelection>
          <ProductSelection :value="order" :available-products="products" class="mb-5"></ProductSelection>
          <OrderNote :value="order" class="mb-5"></OrderNote>

          <v-alert type="warning" v-if="hasValidationError"
            >Les données entrées sont invalides. Si le problème persiste,
            <a href="https://www.lepanivore.com/Home/Contact" target="_blank">contactez-nous</a>.</v-alert
          >
          <v-alert type="error" v-if="hasUnknownError"
            >Une erreur s'est produite, veuillez nous excuser ! Si le problème persiste,
            <a href="https://www.lepanivore.com/Home/Contact" target="_blank">contactez-nous</a>.</v-alert
          >
          <v-btn :loading="isLoading" color="primary" type="submit" x-large>
            Valider la commande
          </v-btn>
          <div class="mt-2">Après avoir validé votre commande, nous vous recontacterons pour vous confirmer sa prise en compte.</div>
        </v-container>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Context } from '@nuxt/types';
import Vue from 'vue';
import ContactDetails from '~/components/ContactDetails.vue';
import OrderNote from '~/components/OrderNote.vue';
import OrderTypeSelection from '~/components/OrderTypeSelection.vue';
import ProductSelection from '~/components/ProductSelection.vue';
import { GetClosingPeriodResponse } from '../../back/src/infrastructure/rest/models/get-closing-period-response';
import { GetProductResponse } from '../../back/src/infrastructure/rest/models/get-product-response';
import { PostOrderRequest } from '../../back/src/infrastructure/rest/models/post-order-request';
import { PostOrderResponse } from '../../back/src/infrastructure/rest/models/post-order-response';

interface CommanderData {
  order: PostOrderRequest;
  closingPeriods: GetClosingPeriodResponse[];
  products: GetProductResponse[];
  isLoading: boolean;
  hasValidationError: boolean;
  hasUnknownError: boolean;
}

export default Vue.extend({
  name: 'commander',
  components: {
    ContactDetails,
    OrderTypeSelection,
    ProductSelection,
    OrderNote,
  },
  data() {
    return {
      order: { products: [{}] } as PostOrderRequest,
      closingPeriods: [],
      products: [],
      isLoading: false,
      hasValidationError: false,
      hasUnknownError: false,
    } as CommanderData;
  },
  async asyncData(ctx: Context): Promise<object> {
    const closingPeriods: GetClosingPeriodResponse[] = await ctx.app.$apiService.getClosingPeriods();
    const products: GetProductResponse[] = await ctx.app.$apiService.getProducts();

    return { closingPeriods, products };
  },
  methods: {
    async validateAndSubmit(): Promise<void> {
      // @ts-ignore
      if (this.$refs.form.validate()) {
        try {
          this.isLoading = true;
          this.resetErrors();
          const postOrderResponse: PostOrderResponse = await this.$apiService.postOrder(this.order);
          this.$router.push(`/confirmation-de-commande?orderId=${postOrderResponse.id}`);
        } catch (e) {
          this.isLoading = false;
          if (e.statusCode === 400) {
            this.hasValidationError = true;
          } else {
            this.hasUnknownError = true;
          }
        }
      }
    },
    resetErrors(): void {
      this.hasValidationError = false;
      this.hasUnknownError = false;
    },
  },
});
</script>
