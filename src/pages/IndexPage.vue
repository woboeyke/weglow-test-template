<template>
  <Suspense>
    <div>
      <HomePageComponent />
      <AnalyticsComponent :googleAnalyticsId="websiteContentStore.content.analyticsId ?? ''" />
    </div>

    <template #fallback>
      <SpinnerComponent />
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HomePageComponent from 'components/HomePageComponent.vue';
import { useMapStore } from 'src/stores/MapStore';
import { useWebsiteContentStore } from 'src/stores/WebsiteContentStore';
import SpinnerComponent from 'src/components/Helpers/SpinnerComponent.vue';
import AnalyticsComponent from 'src/components/AnalyticsComponent.vue';
import { useMeta } from 'quasar';
import appInsights from '../helpers/AppInsights';

export default defineComponent({
  name: 'IndexPage',
  components: { HomePageComponent, SpinnerComponent, AnalyticsComponent },
  async setup() {
    const websiteContentStore = useWebsiteContentStore();
    const mapStore = useMapStore();
    await Promise.all([websiteContentStore.getAllContent(), mapStore.getCandles()]);

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

    const metaData = {
      // sets document title
      title: websiteContentStore.content.meta?.title || 'WeGlow campaign',

      // meta tags
      meta: {
        description: { name: 'description', content: websiteContentStore.content.meta?.description || 'WeGlow campaign' },
        keywords: { name: 'keywords', content: websiteContentStore.content.meta?.keywords || 'WeGlow campaign' },
        image: { property: 'image', content: websiteContentStore.content.meta?.image || '' },
        robots: { name: 'robots', content: websiteContentStore.content.meta?.robots || 'index, follow' },
        author: { name: 'author', content: websiteContentStore.content.meta?.author || 'WeGlow' },
        publisher: { name: 'publisher', content: websiteContentStore.content.meta?.publisher || 'WeGlow' },

        ogUrl: { property: 'og:url', content: websiteContentStore.content.meta?.url || '' },
        // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
        ogTitle: {
          property: 'og:title',
          content: websiteContentStore.content.meta?.title || 'WeGlow campaign',
        },

        // favicon
        // favicon: {
        //   rel: 'icon',
        //   type: 'image/x-icon',
        //   href: 'https://w7.pngwing.com/pngs/294/961/png-transparent-firefox-favicon-firefox-logo-carnivoran-orange-dog-like-mammal.png',
        // },
      },

      noscript: {
        default: 'This website requires JavaScript.',
      },
    };

    useMeta(metaData);

    appInsights.trackPageView({ name: websiteContentStore.content.meta?.title || 'WeGlow campaign' });

    return {
      websiteContentStore,
    };
  },
});
</script>
