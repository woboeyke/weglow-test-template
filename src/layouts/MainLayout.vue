<template>
  <q-layout view="lhh Lpr lff">
    <Suspense>
      <div>
        <HeaderComponent />

        <q-page-container>
          <router-view />
        </q-page-container>

        <FooterComponent />

        <q-page-sticky position="bottom-left" :offset="[18, 18]" style="z-index: 2">
          <q-fab direction="up" color="primary" icon="fa-solid fa-language" text-color="primary">
            <q-fab-action
              :label="language.split('-')[0].toUpperCase()"
              label-class="q-pr-sm"
              :key="language"
              v-for="language in (languages as string[])"
              :color="language === locale ? 'primary' : 'secondary'"
              :text-color="language === locale ? 'primary' : 'secondary'"
              @click="() => ($i18n.locale = language)"
            />
          </q-fab>
        </q-page-sticky>
      </div>

      <template #fallback>
        <SpinnerComponent />
      </template>
    </Suspense>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SpinnerComponent from 'src/components/Helpers/SpinnerComponent.vue';
import HeaderComponent from 'src/components/HeaderComponent.vue';
import FooterComponent from 'src/components/FooterComponent.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'MainLayout',

  components: {
    SpinnerComponent,
    HeaderComponent,
    FooterComponent,
  },
  setup() {
    const { locale } = useI18n({ useScope: 'global' });
    const languages = useI18n({ useScope: 'global' }).availableLocales;

    return {
      languages,
      locale,
    };
  },
});
</script>
