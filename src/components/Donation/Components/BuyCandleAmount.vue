<template>
  <div class="text-center">
    <TranslationComponent :content="contentStore.content.buyCandle.description" :locale="locale">
      <template #default="{ translation }">
        <div class="text-h5 q-pt-md" v-html="translation" />
      </template>
    </TranslationComponent>

    <div class="row q-pt-md q-pb-sm" id="priceboxes">
      <TranslationComponent
        class="trans-comp"
        v-for="price in contentStore.getPrices()"
        :key="price.amount"
        :content="price.label"
        :locale="locale"
      >
        <template #default="{ translation }">
          <PriceBox
            :price="price.amount"
            :label="translation"
            :selected="selectedPrice.amount === price.amount"
            :currency="contentStore.content.buyCandle.currency"
            :icon="price.icon"
            @click="selectedPrice.amount = price.amount"
          />
        </template>
      </TranslationComponent>
    </div>

    <div class="row" id="input-div">
      <q-input
        rounded
        outlined
        v-model.number="selectedPrice.amount"
        :max="999"
        :min="0"
        class="full-width"
        :label="$t('donationAmount')"
        :placeholder="$t('donationOwn')"
        mask="###"
        bg-color="secondary"
      >
        <template v-slot:prepend> {{ contentStore.content.buyCandle.currency }} </template>
      </q-input>
    </div>

    <div class="row q-py-lg">
      <q-btn
        id="next-button"
        class="q-py-md"
        rounded
        color="primary"
        text-color="primary"
        :label="$t('next')"
        @click="$emit('next', selectedPrice.amount)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import PriceBox from './PriceBox.vue';
import { useWebsiteContentStore } from 'src/stores/WebsiteContentStore';
import { Price } from 'src/models/Content/BuyCandle/Price';
import { useI18n } from 'vue-i18n';
import TranslationComponent from '../../Helpers/TranslationComponent.vue';

export default defineComponent({
  name: 'BuyCandleComponent',
  components: { PriceBox, TranslationComponent },
  setup() {
    const contentStore = useWebsiteContentStore();
    const { locale } = useI18n({ useScope: 'global' });

    return {
      locale,
      contentStore: ref(contentStore),
      selectedPrice: ref(JSON.parse(JSON.stringify(contentStore.getPrices()[0])) as Price), // copy of first price instead of reference
    };
  },
});
</script>

<style lang="scss" scoped>
#priceboxes {
  align-items: stretch;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  @media screen and (max-width: 768px) {
  }
}
#next-button {
  width: 15rem;
  margin-left: auto;
  margin-right: auto;
  @media screen and (max-width: 768px) {
    width: 100%;
    max-width: 25rem;
    padding: 1rem;
  }
}
#input-div {
  margin: 1rem 0;
}
</style>
<style lang="scss">
.pricebox-icon {
  @media (max-width: 600px) {
    font-size: 1.4rem !important;
  }
}
</style>
