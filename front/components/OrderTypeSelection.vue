<template>
  <v-card>
    <v-card-title>
      Livraison ou cueillette ?
    </v-card-title>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="value.type"
            :rules="[(v) => !!v || 'Le type de commande est requis']"
            :items="orderTypeItems"
            label="Type de commande"
            required
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="8" v-if="isPickUpOrderTypeSelected">
          <v-menu v-model="showPickUpDatePicker" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="value.pickUpDate"
                label="Date de cueillette"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
                required
                :rules="[(v) => !!v || 'La date de cueillette est requise']"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="value.pickUpDate"
              @input="showPickUpDatePicker = false"
              :min="pickUpDateMin"
              :allowed-dates="pickUpAllowedDates"
              locale="fr-ca"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="6" md="8" v-if="isDeliveryOrderTypeSelected">
          <v-menu v-model="showDeliveryDatePicker" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="value.deliveryDate"
                label="Date de livraison"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
                required
                :rules="[(v) => !!v || 'La date de livraison est requise']"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="value.deliveryDate"
              @input="showDeliveryDatePicker = false"
              :min="deliveryDateMin"
              :allowed-dates="deliveryAllowedDates"
              locale="fr-ca"
            ></v-date-picker>
          </v-menu>
          <v-text-field
            v-model="value.deliveryAddress"
            :rules="[(v) => !!v || `L'adresse de livraison est requise`]"
            label="Votre adresse de livraison"
            required
          ></v-text-field>
          <small>
            Service gratuit pour la Petite-Patrie (Jean Talon - Des Carrières - Des Érables - Christophe-Colomb).
            <br />Pour une livraison en dehors de cette zone, veuillez nous contacter.
          </small>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { ClosingDay } from '../../back/src/domain/closing-day';
import { MAXIMUM_HOUR_FOR_DELIVERY_SAME_WEEK, THURSDAY, TUESDAY } from '../../back/src/domain/delivery-constraints';
import { OrderType } from '../../back/src/domain/order-type';
import { GetClosingPeriodResponse } from '../../back/src/infrastructure/rest/models/get-closing-period-response';
import { PostOrderRequest } from '../../back/src/infrastructure/rest/models/post-order-request';

interface OrderTypeSelectionData {
  orderTypeItems: Array<{ value: OrderType; text: string }>;
  showPickUpDatePicker: boolean;
}

export default Vue.extend({
  name: 'OrderTypeSelection',
  props: {
    value: { required: true } as PropOptions<PostOrderRequest>,
    closingPeriods: { required: true } as PropOptions<GetClosingPeriodResponse[]>,
  },
  data() {
    return {
      orderTypeItems: [
        { value: OrderType.DELIVERY, text: 'Livraison' },
        { value: OrderType.PICK_UP, text: 'Cueillette' },
      ],
      showPickUpDatePicker: false,
      showDeliveryDatePicker: false,
    } as OrderTypeSelectionData;
  },
  methods: {
    pickUpAllowedDates(dateAsIsoString: string): boolean {
      const date: Date = this.toDate(dateAsIsoString);
      return this.isStoreOpen(date);
    },
    deliveryAllowedDates(dateAsIsoString: string): boolean {
      const date: Date = this.toDate(dateAsIsoString);
      return this.isStoreOpen(date) && date.getDay() === THURSDAY;
    },
    toDate(dateAsIsoString: string): Date {
      return new Date(`${dateAsIsoString}T12:00:00Z`);
    },
    isStoreOpen(date: Date): boolean {
      if (Object.values(ClosingDay).includes(date.getDay())) {
        return false;
      }

      for (const closingPeriod of this.closingPeriods) {
        if (date.getTime() >= new Date(closingPeriod.start).getTime() && date.getTime() <= new Date(closingPeriod.end).getTime()) {
          return false;
        }
      }

      return true;
    },
  },
  computed: {
    isPickUpOrderTypeSelected(): boolean {
      return this.value.type === OrderType.PICK_UP;
    },
    isDeliveryOrderTypeSelected(): boolean {
      return this.value.type === OrderType.DELIVERY;
    },
    pickUpDateMin(): string {
      const date: Date = new Date();
      date.setDate(date.getDate() + 2);

      return date.toISOString();
    },
    deliveryDateMin(): string {
      const now = new Date();
      const currentDayOfWeek: number = now.getDay();
      if (
        (currentDayOfWeek > TUESDAY && currentDayOfWeek <= THURSDAY) ||
        (currentDayOfWeek === TUESDAY && now.getHours() >= MAXIMUM_HOUR_FOR_DELIVERY_SAME_WEEK)
      ) {
        const numberOfDaysToAddToOverlapNextThursday: number = THURSDAY - currentDayOfWeek + 1;
        now.setDate(now.getDate() + numberOfDaysToAddToOverlapNextThursday);
      }

      return now.toISOString();
    },
  },
});
</script>
