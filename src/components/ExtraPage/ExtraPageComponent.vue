<template>
  <q-page id="q-page" class="bg-background">
    <div class="q-pt-md container bg-background" :class="{ 'q-pb-md': $q.screen.gt.sm }" id="extraPage">
      <div class="container">
        <template v-for="extraPage in contentStore.content.extraPage" :key="extraPage.title">
          <CardComponent :center-title="extraPage.titleCentered" titleId="extraPageTitle" contentId="extraPageContent">
            <template #title>
              <TranslationComponent :content="extraPage.title" :locale="locale" />
            </template>

            <template #content>
              <TranslationComponent :content="extraPage.content" :locale="locale">
                <template #default="{ translation }">
                  <p v-html="translation" />
                </template>
              </TranslationComponent>
            </template>
          </CardComponent>
        </template>
      </div>

      <div class="container">
        <CardComponent titleId="defaultExtraPageTitle" contentId="defaultExtraPageContent">
          <template #title> {{ $t('extraInfoTitel') }} </template>

          <template #content>
            <p>
              {{ $t('extraInfoText') }} <a href="https://weglow.world/" target="_blank" rel="noopener noreferrer">https://weglow.world/</a>
            </p>
          </template>
        </CardComponent>
      </div>

      <div class="container">
        <CardComponent titleId="defaultExtraPageTitle" contentId="defaultExtraPageContent">
          <template #title> {{ $t('contactGegevens') }} </template>

          <template #content>
            <p>WeGlow: hello@weglow.world</p>
          </template>
        </CardComponent>
      </div>

      <div :class="{ container: !$q.screen.gt.sm }">
        <q-btn
          color="primary"
          class="q-mb-sm text-primary"
          :class="{ 'q-ml-md': $q.screen.gt.sm, 'q-mx-md': $q.screen.lt.sm }"
          icon="arrow_back"
          :label="$t('gaTerug')"
          rounded
          @click="$router.go(-1)"
        />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useWebsiteContentStore } from 'src/stores/WebsiteContentStore';
import CardComponent from '../Helpers/CardComponent.vue';
import TranslationComponent from '../Helpers/TranslationComponent.vue';
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'ExtraPageComponent',
  setup() {
    const contentStore = useWebsiteContentStore();
    const { locale } = useI18n({ useScope: 'global' });

    return {
      contentStore: ref(contentStore),
      locale: locale,
    };
  },
  components: {
    CardComponent,
    TranslationComponent,
  },
  watch: {
    locale: {
      handler() {
        document.title = this.$t('extraInformatie');
      },
      immediate: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  flex-direction: column;
}

#extraPage {
  padding: 2rem 25vw; // Larger screens (v, h)

  @media (max-width: 1600px) {
    padding: 2rem 15vw;
  }

  @media (max-width: 768px) {
    padding: 2rem 1vw; // Smaller screens
  }
}
</style>
