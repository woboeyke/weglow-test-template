<template>
  <div class="q-py-md">
    <CardComponent :centerTitle="true" titleId="shareTitle" contentId="shareContent">
      <template #title>
        <TranslationComponent :content="contentStore.content.shareCampaign.title" :locale="locale" />
      </template>
      <template #content>
        <div class="text-center q-mt-md">
          <template v-for="url in contentStore.content.shareCampaign.shareOptions" :key="url.url">
            <q-btn
              :icon="`fa-brands fa-${url.icon}`"
              class="bg-white btn-rounded"
              :label="$q.screen.gt.sm ? url.title : undefined"
              no-caps
              :href="`${url.url}`"
              target="_blank"
            />
          </template>

          <q-btn
            v-if="contentStore.content.shareCampaign.enableCopyLink"
            icon="fa-solid fa-link"
            class="bg-white btn-rounded"
            :label="$q.screen.gt.sm ? $t('copyLink') : undefined"
            no-caps
            @click="copyLink"
          />
        </div>
      </template>
    </CardComponent>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import CardComponent from './Helpers/CardComponent.vue';
import { useWebsiteContentStore } from 'src/stores/WebsiteContentStore';
import { getTranslation } from 'src/helpers/TranslationHelper';
import { useI18n } from 'vue-i18n';
import TranslationComponent from './Helpers/TranslationComponent.vue';

export default defineComponent({
  name: 'ShareComponent',
  components: { CardComponent, TranslationComponent },
  setup() {
    const contentStore = useWebsiteContentStore();
    const { locale } = useI18n({ useScope: 'global' });

    return {
      contentStore: ref(contentStore),
      locale: locale,
      getTranslation,
    };
  },
  methods: {
    copyLink() {
      //get current url without query params
      const url = window.location.href.split('?')[0];
      navigator.clipboard.writeText(url);

      this.$q.notify({
        message: this.$t('linkCopied'),
        color: 'positive',
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.q-btn {
  margin: 0.5rem 1rem !important;
}

.btn-rounded {
  border-radius: 1.5rem;

  @media screen and (max-width: 992px) {
    border-radius: 100%;
    width: 3rem;
    height: 3rem;
  }
}
</style>

<style lang="scss">
i.q-icon.fa-brands,
i.q-icon.fa-link {
  // color: $primary;
  color: var(--q-primary);
}

.sharebutton {
  span {
    span {
      color: black;
    }
  }
}
</style>
