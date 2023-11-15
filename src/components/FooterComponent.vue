<template>
  <div class="bg-secondary">
    <div class="container q-px-lg q-pb-lg" id="footer">
      <div class="text-center q-pt-md">
        <a :href="weglowUrl">
          <q-img
            :src="weglowLogoUrl"
            alt="WeGlow logo"
            class="footer_logo q-mb-md"
            width="150px"
            loading="lazy"
            spinner-color="deep-orange"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white">Cannot load image</div>
            </template>
          </q-img>
        </a>
        <p>
          {{ $t('campaignBy') }}
          <a class="inline_link" rel="noopener noreferrer" target="_blank" :href="weglowUrl">WeGlow.World</a>
        </p>
      </div>

      <div class="row center-block text-center q-pb-md">
        <div class="col flex flex-center">
          <p class="q-ma-none">&copy; {{ $t('copyright') }} {{ getCurrentYear }}</p>
        </div>
        <div class="col flex flex-center">
          <p class="q-ma-none">
            <a class="inline_link" target="_blank" :href="weglowPrivacyUrl" rel="noopener noreferrer">
              {{ $t('termsAndConditions') }}
            </a>
            &
            <a class="inline_link" target="_blank" :href="weglowPrivacyUrl" rel="noopener noreferrer">
              {{ $t('privacyPolicy') }}
            </a>
          </p>
        </div>
        <div class="col flex flex-center">
          <p class="q-ma-none">{{ $t('rightsReserved') }}</p>
        </div>
      </div>

      <div class="text-center">
        <p class="q-mb-none">
          <a class="inline_link" target="_self" href="/extra-info" rel="noopener noreferrer">
            {{ $t('extraInfo') }}
          </a>
        </p>
      </div>

      <div class="text-center q-pt-md">
        <a :href="weglowFacebookUrl" target="_blank">
          <q-icon name="fa-brands fa-facebook" size="sm" class="q-px-sm shareIcon" />
        </a>
        <a :href="weglowTwitterUrl" target="_blank">
          <q-icon name="fa-brands fa-twitter" size="sm" class="q-px-sm shareIcon" />
        </a>
        <a :href="weglowInstagramUrl" target="_blank">
          <q-icon name="fa-brands fa-instagram" size="sm" class="q-px-sm shareIcon" />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FooterComponent',
  data() {
    return {
      weglowUrl: process.env.WEGLOW_URL,
      weglowPrivacyUrl: process.env.WEGLOW_PRIVACY_URL,
      weglowFacebookUrl: process.env.WEGLOW_FACEBOOK_URL,
      weglowTwitterUrl: process.env.WEGLOW_TWITTER_URL,
      weglowInstagramUrl: process.env.WEGLOW_INSTAGRAM_URL,
      weglowLogoUrl: process.env.WEGLOW_LOGO_ZWART_URL,
    };
  },
  computed: {
    getCurrentYear() {
      return new Date().getFullYear();
    },
  },
});
</script>

<style lang="scss" scoped>
#footer {
  max-width: 50vw;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 992px) {
    max-width: 80vw;
  }
  @media (max-width: 800px) {
    max-width: 90vw;
  }
  @media (max-width: 576px) {
    max-width: 100vw;
  }
}

p {
  // font-size: medium;
  font-size: small;
}

.shareIcon {
  color: var(--q-primary);
}
</style>
