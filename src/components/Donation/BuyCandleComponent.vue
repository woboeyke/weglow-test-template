<template>
  <CardComponent :noMargin="true" titleId="buyCandleTitle" contentId="buyCandleContent">
    <template #title>
      <TranslationComponent :content="contentStore.content.buyCandle.title" :locale="locale" />
    </template>

    <template #content>
      <q-slide-transition>
        <PaymentCompleteComponent v-if="isPaymentComplete" />
      </q-slide-transition>
      <q-slide-transition>
        <BuyCandleAmount @next="changeSelectedPrice" v-if="selectedPrice <= 0 && !isPaymentComplete" />
      </q-slide-transition>
      <q-slide-transition>
        <BuyCandleDetails
          @previous="selectedPrice = 0"
          @submit="buyCandle"
          :loading="loading"
          :selectedPrice="selectedPrice"
          v-if="selectedPrice > 0 && !isPaymentComplete"
        />
      </q-slide-transition>
    </template>
  </CardComponent>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import CardComponent from '../Helpers/CardComponent.vue';
import BuyCandleAmount from './Components/BuyCandleAmount.vue';
import BuyCandleDetails from './Components/BuyCandleDetails.vue';
import PaymentCompleteComponent from './Components/PaymentCompleteComponent.vue';
import { BuyCandleRequest } from 'src/models/Donations/BuyCandleRequest';
import { useCandleStore } from 'src/stores/CandleStore';
import { useWebsiteContentStore } from 'src/stores/WebsiteContentStore';
import { getTranslation } from 'src/helpers/TranslationHelper';
import { useI18n } from 'vue-i18n';
import TranslationComponent from '../Helpers/TranslationComponent.vue';

export default defineComponent({
  name: 'BuyCandleComponent',
  components: { CardComponent, BuyCandleAmount, BuyCandleDetails, PaymentCompleteComponent, TranslationComponent },
  setup() {
    const contentStore = useWebsiteContentStore();
    const { locale } = useI18n({ useScope: 'global' });

    return {
      contentStore: ref(contentStore),
      locale,
      getTranslation,
    };
  },
  data() {
    return {
      selectedPrice: 0,
      loading: false,
    };
  },
  computed: {
    isPaymentComplete() {
      const currentPath = this.$route.path;
      if (currentPath !== '/success') {
        return false;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('orderId');
      const orderStatusId = urlParams.get('orderStatusId');
      const paymentSessionId = urlParams.get('paymentSessionId');
      const paymentMethod = urlParams.get('paymentMethod');

      if (paymentMethod === 'payconiq' && orderId) {
        return true;
      } else if (orderId && orderStatusId && paymentSessionId) {
        return true;
      }

      return false;
    },
  },
  methods: {
    changeSelectedPrice(price: number) {
      this.selectedPrice = price;
    },
    async buyCandle(data: BuyCandleRequest) {
      this.loading = true;

      data.flames = this.selectedPrice;

      const candleStore = useCandleStore();
      await candleStore
        .buyCandle(data, this.locale as string)
        .catch((err) => {
          console.error(err);
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: this.$t('paymentErrorMessage'),
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
</script>

<style lang="scss" scoped></style>
