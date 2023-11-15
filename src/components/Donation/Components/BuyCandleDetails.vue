<template>
  <q-form @submit="onSubmit">
    <div class="text-center">
      <h5 class="text-h5">{{ $t('gegevens') }}</h5>

      <q-input
        v-model="name"
        :label="$t('name') + ' *'"
        :placeholder="$t('name')"
        outlined
        class="q-mb-sm"
        :rules="[
          (val) => {
            if (!val) {
              return $t('isRequired', { field: $t('name') });
            } else if (val.length > 50) {
              return $t('maxLength', { length: 50 });
            } else if (val.length < 3) {
              return $t('minLength', { length: 3 });
            }
            return true;
          },
        ]"
      />

      <q-input
        v-model="email"
        :label="$t('email') + (contentStore.content.buyCandle.emailRequired ? ' *' : '')"
        :placeholder="$t('email')"
        outlined
        class="q-mb-sm"
        :rules="[
          (val) => {
            if (contentStore.content.buyCandle.emailRequired) {
              if (!val) {
                return $t('isRequired', { field: $t('email') });
              }
            } else if (!val) {
              return true;
            }
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(val) || $t('isInvalid', { field: $t('email') });
          },
        ]"
        :hint="contentStore.content.buyCandle.fiscalCertificateEnabled ? fiscaalAttest : ''"
      />

      <div id="geocoder" class="q-mb-lg" />

      <q-input
        v-model="message"
        :label="$t('yourMessageTitle')"
        :placeholder="$t('yourMessage')"
        outlined
        type="textarea"
        autogrow
        :rules="[(val) => val.length <= 100 || $t('maxLength', { length: 100 })]"
      />
    </div>
    <div>
      <q-checkbox
        v-model="anonymousDonation"
        v-if="contentStore.content.buyCandle.allowAnonymousDonations"
        dense
        checked-icon="task_alt"
        unchecked-icon="highlight_off"
      >
        <template v-slot:default>
          <span class="text-caption">
            {{ $t('anonymousDonation') }}
            <q-tooltip anchor="bottom start" self="top left" :delay="200">
              <div class="text-caption">{{ $t('anonymousDonationMessage') }}</div>
            </q-tooltip>
          </span>
        </template>
      </q-checkbox>
    </div>

    <q-checkbox
      v-model="terms"
      dense
      class="q-my-md"
      :rules="[(val:boolean) => !!val || $t('areRequired', { field: $t('termsAndConditions') })]"
      checked-icon="task_alt"
      unchecked-icon="highlight_off"
    >
      <template v-slot:default>
        <span class="text-caption">
          {{ $t('doYouAccept') }}
          <a href="https://weglow.world/onewebmedia/Privacystatement.pdf" class="inline_link" target="_blank" rel="noopener noreferrer">
            {{ $t('termsAndConditions') }}
          </a>
          &amp;
          <a href="https://weglow.world/onewebmedia/Privacystatement.pdf" class="inline_link" target="_blank" rel="noopener noreferrer">
            {{ $t('privacyPolicy') }}
          </a>
        </span>
      </template>
    </q-checkbox>

    <div class="row text-center q-py-lg">
      <div class="col-6">
        <q-btn label="Terug" class="q-py-md" rounded color="primary" @click="$emit('previous')" :disable="loading" />
      </div>
      <div class="col-6">
        <q-btn :label="$t('next')" rounded color="primary" class="q-py-md" type="submit" :loading="loading" :disable="loading" />
      </div>
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MapBoxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useWebsiteContentStore } from 'src/stores/WebsiteContentStore';

export default defineComponent({
  name: 'BuyCandleDetails',
  setup() {
    const contentStore = useWebsiteContentStore();
    const geocoder = ref(
      new MapBoxGeocoder({
        accessToken: 'pk.eyJ1Ijoid2VnbG93IiwiYSI6ImNsYXdsMG1idDBleGUzcHA0bXV6czQyaWMifQ.2JmaCHMYFmNLPQrzNQkv9A',
        types: 'country,region,place,postcode,locality,neighborhood,district,address,poi,poi.landmark',
      })
    );

    return {
      geocoder,
      contentStore: ref(contentStore),
    };
  },
  data() {
    return {
      name: '',
      email: '',
      address: [] as number[],
      message: '',
      terms: false,
      anonymousDonation: false,
    };
  },
  computed: {
    fiscaalAttest() {
      if (this.$props.selectedPrice >= 40) {
        return this.$t('fiscaalAttest');
      }
      return '';
    },
  },
  methods: {
    onSubmit() {
      if (this.address.length === 0) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: this.$t('noAddress'),
        });
        return;
      }
      if (this.terms !== true) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: this.$t('pleaseAcceptPrivacyAndTerms'),
        });
        return;
      }

      let donation = {
        name: this.name,
        email: this.email,
        description: this.message,
        lat: this.address[1],
        lng: this.address[0],
      } as {
        name: string;
        email: string;
        description: string;
        lat: number;
        lng: number;
        anonymous?: boolean;
      };

      if (this.contentStore.content.buyCandle.allowAnonymousDonations) {
        donation = { ...donation, anonymous: this.anonymousDonation };
      }

      this.$emit('submit', donation);
    },
  },
  mounted() {
    this.geocoder.addTo('#geocoder');
    this.geocoder.setPlaceholder(this.$t('addressMessage') + ' *');
    let icon = document.getElementsByClassName('mapboxgl-ctrl-geocoder--icon-search');
    icon[0].classList.add('hidden');
    let elements = document.getElementsByClassName('mapboxgl-ctrl-geocoder--input');
    elements[0].classList.add('custom-component');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.geocoder.on('result', (e: any) => {
      this.address = e.result.geometry.coordinates;
    });
  },
  emits: ['submit', 'previous'],
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    selectedPrice: {
      type: Number,
      default: 0,
    },
  },
});
</script>

<style lang="scss" scoped>
.col-6 > * {
  width: 50%;
}
</style>

<style lang="scss">
.mapboxgl-ctrl-geocoder {
  width: 100%;
  max-width: 100%;
  box-shadow: none;
}
.mapboxgl-ctrl-geocoder--button,
.mapboxgl-ctrl-geocoder--icon {
  background-color: var(--q-background);
}
.mapboxgl-ctrl-geocoder--icon-close {
  margin-top: 0;
}
.custom-component {
  border: 1px solid #bababa;
  border-radius: 4px;
  padding: 1.66rem 12px;
  font-size: 16px;
  line-height: 1.42857143;
  color: #555;
  // background-color: $background;
  background-color: var(--q-background);
  background-image: none;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:focus {
    border: 2px solid var(--q-primary);
    outline: none;
    padding: calc(1.66rem - 1px) 12px;
  }
}
</style>
