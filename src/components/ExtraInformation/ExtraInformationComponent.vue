<template>
  <div class="q-pt-md" :class="{ 'q-pb-md': $q.screen.gt.sm }" id="extraInformation">
    <template v-for="extraInformation in contentStore.content.extraInformation" :key="extraInformation.title">
      <CardComponent :center-title="extraInformation.titleCentered" titleId="extraInformationTitle" contentId="extraInformationContent">
        <template #title>
          <TranslationComponent :content="extraInformation.title" :locale="locale" />
        </template>

        <template #content>
          <TranslationComponent :content="extraInformation.content" :locale="locale">
            <template #default="{ translation }">
              <p v-html="translation" />
            </template>
          </TranslationComponent>
        </template>
      </CardComponent>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import CardComponent from '../Helpers/CardComponent.vue';
import { useWebsiteContentStore } from 'src/stores/WebsiteContentStore';
import { useI18n } from 'vue-i18n';
import TranslationComponent from '../Helpers/TranslationComponent.vue';

export default defineComponent({
  name: 'InformationComponent',
  components: { CardComponent, TranslationComponent },
  setup() {
    const contentStore = useWebsiteContentStore();
    const { locale } = useI18n({ useScope: 'global' });

    return {
      contentStore: ref(contentStore),
      locale,
    };
  },
});
</script>

<style lang="scss">
#extraInformation img {
  max-width: -webkit-fill-available;
}
</style>
