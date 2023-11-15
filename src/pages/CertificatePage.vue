<template>
  <Suspense>
    <div style="background-color: #f5f5f5">
      <CertificatePageComponent />
    </div>

    <template #fallback>
      <SpinnerComponent />
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CertificatePageComponent from 'src/components/Certificate/CertificatePageComponent.vue';
import SpinnerComponent from 'src/components/Helpers/SpinnerComponent.vue';
import { useWebsiteContentStore } from 'src/stores/WebsiteContentStore';
import appInsights from '../helpers/AppInsights';

export default defineComponent({
  name: 'CertificatePage',
  components: { CertificatePageComponent, SpinnerComponent },
  async setup() {
    const websiteContentStore = useWebsiteContentStore();
    await Promise.all([websiteContentStore.getAllContent()]);

    const favicon = document.getElementById('favicon') as HTMLLinkElement | null;
    const favicon16 = document.getElementById('favicon16') as HTMLLinkElement | null;
    const favicon32 = document.getElementById('favicon32') as HTMLLinkElement | null;
    const favicon96 = document.getElementById('favicon96') as HTMLLinkElement | null;
    const favicon128 = document.getElementById('favicon128') as HTMLLinkElement | null;
    const url = websiteContentStore.content?.candleImageURL || (favicon ? favicon.href : '');
    favicon ? (favicon.href = url) : null;
    favicon16 ? (favicon16.href = url) : null;
    favicon32 ? (favicon32.href = url) : null;
    favicon96 ? (favicon96.href = url) : null;
    favicon128 ? (favicon128.href = url) : null;

    while (websiteContentStore.loadingFont) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    appInsights.trackPageView({ name: 'CertificatePage' });

    return {};
  },
});
</script>
