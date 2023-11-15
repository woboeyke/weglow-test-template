<template>
  <q-page id="q-page bg-background">
    <div class="container bg-background" id="page-container">
      <div class="column">
        <InformationComponent />
      </div>
      <div class="column">
        <BuyCandleComponent />
      </div>
      <div style="width: 100%">
        <ShareComponent />
        <MapContainerComponent />
        <template v-if="contentStore.content.extraInformation && contentStore.content.extraInformation.length > 0">
          <ExtraInformationComponent />
        </template>
      </div>
    </div>

    <template v-if="contentStore.content.style.customCss">
      <CustomCss :customCss="contentStore.content.style.customCss" />
    </template>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import InformationComponent from './Information/InformationComponent.vue';
import BuyCandleComponent from './Donation/BuyCandleComponent.vue';
import ShareComponent from './ShareComponent.vue';
import MapContainerComponent from './Map/MapContainerComponent.vue';
import { useWebsiteContentStore } from 'src/stores/WebsiteContentStore';
import ExtraInformationComponent from './ExtraInformation/ExtraInformationComponent.vue';
import CustomCss from './Helpers/CustomCss.vue';

export default defineComponent({
  name: 'HomePageComponent',
  components: {
    InformationComponent,
    BuyCandleComponent,
    ShareComponent,
    MapContainerComponent,
    ExtraInformationComponent,
    CustomCss,
  },
  setup() {
    const contentStore = useWebsiteContentStore();

    return {
      contentStore: ref(contentStore),
    };
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.column {
  flex-basis: calc(50% - 10px);
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .column {
    flex-basis: 100%;
  }
}

#page-container {
  padding: 2rem 20rem; // v h
  @media (max-width: 2100px) {
    padding: 2rem 6rem; // v h
  }
  @media (max-width: 768px) {
    padding: 0 1rem; // v h
  }
}
</style>
