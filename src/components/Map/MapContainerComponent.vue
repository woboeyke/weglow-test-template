<template>
  <div class="container">
    <div class="column map-column q-px-md">
      <MapComponent />
    </div>
    <div class="column card-column">
      <CardComponent :noPadding="true" :noMargin="true" :cardHeight="'94%'" :contentHeight="'95%'" :minHeight="'40vh'">
        <template #title>
          <TranslationComponent :content="contentStore.content.map.messagesTitle" :locale="locale" />
        </template>

        <template #content>
          <MessageListComponent />
        </template>
      </CardComponent>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MapComponent from './MapComponent.vue';
import CardComponent from '../Helpers/CardComponent.vue';
import MessageListComponent from './MessageListComponent.vue';
import { useWebsiteContentStore } from 'src/stores/WebsiteContentStore';
import { useI18n } from 'vue-i18n';
import TranslationComponent from '../Helpers/TranslationComponent.vue';

export default defineComponent({
  name: 'MapContainerComponent',
  components: { MapComponent, CardComponent, MessageListComponent, TranslationComponent },
  setup() {
    const contentStore = useWebsiteContentStore();
    const { locale } = useI18n({ useScope: 'global' });

    return {
      contentStore: ref(contentStore),
      locale: locale,
    };
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 3rem;
}

.map-column {
  flex-basis: 65%;
  max-width: 65%;
}

.card-column {
  flex-basis: 35%;
  max-width: 35%;
}

@media (max-width: 1130px) {
  .column {
    flex-basis: 100%;
    max-width: 100%;
  }
}
</style>
