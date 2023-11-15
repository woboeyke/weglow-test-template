<template>
  <CardComponent titleId="informationTitle" contentId="informationContent">
    <template #title>
      <TranslationComponent :content="contentStore.content.information.title" :locale="locale" />
    </template>

    <template #content>
      <ReadMore :lines="8" :text-more="$t('readMore')" :text-less="$t('readLess')">
        <TranslationComponent :content="contentStore.content.information.description" :locale="locale">
          <template #default="{ translation }">
            <p v-html="translation" />
          </template>
        </TranslationComponent>
      </ReadMore>

      <div class="row" style="margin-top: 3rem">
        <div class="col" :class="columnSize">
          <InfoCard :src="contentStore.content.candleImageURL" :total="contentStore.content.totalDonations.toString()" />
        </div>
        <div class="col" :class="columnSize">
          <InfoCard
            :src="contentStore.content.totalDonatedURL"
            :total="contentStore.content.buyCandle.currency + ' ' + contentStore.content.totalDonated"
          />
        </div>
        <div class="col" :class="columnSize" v-if="hasTimer">
          <InfoCard
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABlUlEQVR4nO2WTU4CQRBG317iyoUKxqBEuIviWvQECC4MXsSdGg9gVFwp3gR/TqHgBmGCqeSbpGMg0z0z7HhJJ5OZ6uqva6q6GpYsCWMLaAOvwBvwo2HPPaAFlFgAReAaGAPThBEB98B2XosfAgM5HwF3wBFQBVY07LmhbyPZ2px61sXPtKOpdlX2mLMDPDrRsF+WeucRMAHO59jEYZ9FR3OjNJEoOmGft3iSgFiEff8GNkIE3DphJ4MAoysbS2LvUpsomco5CNiVr7Eim0hbTi2jyUEAiqTZnfoI6Mm4kaOAE9k9+wj4lHElRwFV2b37CBjKuBAgYNZwKeid+U5ksAABq045JvIh4z3yoyaf/byT0JegJGwFlKEvcRk2fYxLOjRGaixZqYQeRMaNFFtXy8qTfF2FTNp0qsEaSlou5OMLWA+dXHfacSfl4nE73iclbedC0lVj8fnncdgjJXUmDnSAxFcyy+hj1XZBo6ZSewB+nbCn3vl/1oBLz0vpWL0/6ALiS1G1/KJTbajR1yHTDCm1JUuMP212pFhtQCJgAAAAAElFTkSuQmCC"
            :total="contentStore.getRemainingTime()"
          />
        </div>
      </div>
    </template>
  </CardComponent>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import CardComponent from '../Helpers/CardComponent.vue';
import ReadMore from '../Helpers/ReadMore.vue';
import InfoCard from './InfoCard.vue';
import { useWebsiteContentStore } from 'src/stores/WebsiteContentStore';
import { useI18n } from 'vue-i18n';
import TranslationComponent from '../Helpers/TranslationComponent.vue';

export default defineComponent({
  name: 'InformationComponent',
  components: { CardComponent, ReadMore, InfoCard, TranslationComponent },
  setup() {
    const contentStore = useWebsiteContentStore();
    const { locale } = useI18n({ useScope: 'global' });

    return {
      contentStore: ref(contentStore),
      locale,
    };
  },
  computed: {
    columnSize() {
      return this.contentStore.content.hasEndDate ? 'col-4' : 'col-6';
    },
    hasTimer() {
      return this.contentStore.content.hasEndDate;
    },
  },
});
</script>
