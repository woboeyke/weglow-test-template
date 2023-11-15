<template>
  <q-header elevated>
    <div class="bg-header text-white header-div">
      <div />
      <q-toolbar class="campaign-toolbar">
        <a :href="contentStore.content.realCampaignSiteURL" target="_blank" rel="noopener noreferrer" class="campaign-link">
          <img
            :src="contentStore.content.headerImageURL"
            alt="Campagne Logo"
            id="campaign-logo"
            style="object-fit: contain; height: 100%; width: 100%"
          />
        </a>
      </q-toolbar>
      <q-toolbar style="justify-content: end">
        <a :href="weglowUrl" target="_blank" style="display: block; height: 100%">
          <img
            :src="weglowLogoUrl"
            alt="Weglow Logo"
            id="weglow-logo"
            :class="{ 'q-mt-md': $q.screen.gt.sm }"
            style="margin-bottom: auto; margin-top: 1rem"
          />
        </a>
      </q-toolbar>
    </div>
  </q-header>
</template>

<script lang="ts">
import { useWebsiteContentStore } from 'src/stores/WebsiteContentStore';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'HeaderComponent',
  setup() {
    const contentStore = useWebsiteContentStore();

    return {
      contentStore: ref(contentStore),
    };
  },
  data() {
    return {
      weglowUrl: process.env.WEGLOW_URL,
      weglowLogoUrl: process.env.WEGLOW_LOGO_ZWART_URL,
    };
  },
  watch: {
    contentStore: {
      handler() {
        this.weglowLogoUrl = this.contentStore.content.style.showBlackWeglowLogo
          ? process.env.WEGLOW_LOGO_ZWART_URL
          : process.env.WEGLOW_LOGO_WIT_URL;
      },
      deep: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.campaign-toolbar {
  padding: 0;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}
.header-div {
  display: grid;
  grid-template-columns: 10rem 1fr 10rem;
  @media (max-width: 700px) {
    display: flex;
    flex-direction: column-reverse;
  }
}

#campaign-logo {
  height: 100%;
  width: 100%;
  position: relative;
}
.campaign-link {
  max-height: 18rem;
  max-width: 36rem;
  padding: 1rem;
  width: 100%;
  height: 100%;
  @media (max-width: 400px) {
    max-height: 12rem;
    padding: 0 1rem;
  }
}

#weglow-logo {
  height: 2.5rem;
  @media (max-width: 700px) {
    height: 2rem;
  }
}
</style>
<style lang="scss">
.q-toolbar--inset {
  @media (max-width: 400px) {
    padding-left: 12px;
  }
}
</style>
