<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
<template>
  <div>
    <div class="hidden">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

export default defineComponent({
  name: 'AnalyticsComponent',
  props: {
    googleAnalyticsId: String,
  },
  methods: {
    initializeGoogleAnalytics() {
      if (typeof window !== 'undefined' && this.googleAnalyticsId) {
        // Load Google Analytics script dynamically
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.googleAnalyticsId}`;
        script.async = true;

        // Add a callback function to execute once the script is loaded
        script.onload = () => {
          this.setupGoogleAnalytics();
        };

        // Append the script to the document's head
        document.head.appendChild(script);
      }
    },
    setupGoogleAnalytics() {
      // Initialize Google Analytics with your ID
      window.dataLayer = window.dataLayer || [];
      const gtag: (...args: unknown[]) => void = function () {
        // Push events to dataLayer
        window.dataLayer.push(arguments);
      };

      gtag('js', new Date());
      gtag('config', this.googleAnalyticsId);

      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
      });
    },
  },
  mounted() {
    this.initializeGoogleAnalytics(); // Set GA ID dynamically
  },
});
</script>
