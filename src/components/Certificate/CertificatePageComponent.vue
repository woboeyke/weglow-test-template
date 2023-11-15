<template>
  <q-page id="q-page" class="bg-background">
    <div class="page-container bg-background" id="page-container">
      <div class="container bg-background">
        <p>{{ $t('fiscalCertificate') }}</p>
      </div>
      <div class="container bg-background">
        <q-form @submit="submitForm" style="width: 80%" v-if="!success && isCertificateAllowed">
          <div class="custom-form-item">
            <label for="certificateOrderId">{{ $t('orderId') }}:</label>
            <q-input
              v-model="certificate.orderId"
              id="certificateOrderId"
              filled
              outlined
              dense
              class="input-field"
              :label="$t('orderId')"
              :rules="[
                (val) => {
                  if (!val) {
                    return $t('isRequired', { field: $t('orderId') });
                  }
                  if (val.length > 100 || val.length < 5) {
                    return $t('isInvalid', { field: $t('orderId') });
                  }
                  return true;
                },
              ]"
            />
          </div>

          <div class="custom-form-item">
            <label for="certificateEmail">{{ $t('email') }}:</label>
            <q-input
              v-model="certificate.email"
              id="certificateEmail"
              filled
              outlined
              dense
              class="input-field"
              :label="$t('email')"
              type="email"
              :rules="[
                (val) => {
                  if (!val) {
                    return $t('isRequired', { field: $t('email') });
                  }
                  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  return regex.test(val) || $t('isInvalid', { field: $t('email') });
                },
              ]"
            />
          </div>

          <div class="custom-form-item">
            <label for="certificateVoornaam">{{ $t('firstName') }}:</label>
            <q-input
              v-model="certificate.voornaam"
              id="certificateVoornaam"
              filled
              outlined
              dense
              class="input-field"
              :label="$t('firstName')"
              :rules="[
                (val) => {
                  if (!val) {
                    return $t('isRequired', { field: $t('firstName') });
                  }
                  return true;
                },
              ]"
            />
          </div>

          <div class="custom-form-item">
            <label for="certificateNaam">{{ $t('name') }}:</label>
            <q-input
              v-model="certificate.naam"
              id="certificateNaam"
              filled
              outlined
              dense
              class="input-field"
              :label="$t('name')"
              :rules="[
                (val) => {
                  if (!val) {
                    return $t('isRequired', { field: $t('name') });
                  }
                  return true;
                },
              ]"
            />
          </div>

          <div class="custom-form-item">
            <label for="certificateAdres">{{ $t('fullAddress') }}:</label>
            <q-input
              v-model="certificate.adres"
              id="certificateAdres"
              type="textarea"
              filled
              outlined
              dense
              class="input-field"
              :label="$t('fullAddress')"
              :rules="[
                (val) => {
                  if (!val) {
                    return $t('isRequired', { field: $t('fullAddress') });
                  }
                  return true;
                },
              ]"
            />
          </div>

          <q-card class="q-mb-xl q-pa-md">
            <q-card-section>
              <div class="custom-form-item noBottomPadding">
                <label for="rijksregisterNummer">{{ $t('rijksregisternummer') }}:</label>
                <q-input
                  v-model="rijksregisternummer"
                  id="rijksregisterNummer"
                  filled
                  outlined
                  dense
                  class="input-field noBottomPadding"
                  :label="$t('rijksregisternummer')"
                  :rules="[checkRijksregisterNummer]"
                />
              </div>
            </q-card-section>
            <div class="q-mb-sm" style="width: 94%; height: 10px; border-bottom: 1px solid black; text-align: center; margin-left: 3%">
              <span style="padding: 0 10px; background-color: var(--q-background)">
                {{ $t('or').toUpperCase() }}
              </span>
            </div>
            <q-card-section>
              <div class="custom-form-item noBottomPadding">
                <label for="vennootschapsNummer">{{ $t('vennootschapsnummer') }}:</label>
                <q-input
                  v-model="vennootschapsnummer"
                  id="vennootschapsNummer"
                  filled
                  outlined
                  dense
                  class="input-field noBottomPadding"
                  :label="$t('vennootschapsnummer')"
                  :rules="[checkRijksregisterNummer]"
                />
              </div>
            </q-card-section>
          </q-card>

          <div class="text-center q-mt-xl">
            <q-btn type="submit" color="primary" :label="$t('submitRequest')" :loading="loading" />
          </div>
        </q-form>
        <CertificateSuccessComponent v-else-if="isCertificateAllowed" />
        <CertificateNotAllowedComponent v-else />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Certificate, defaultCertificate } from 'src/models/Certificate/Certificate';
import { useCertificateStore } from 'src/stores/CertificateStore';
import CertificateSuccessComponent from './CertificateSuccessComponent.vue';
import CertificateNotAllowedComponent from './CertificateNotAllowedComponent.vue';
import { useWebsiteContentStore } from 'src/stores/WebsiteContentStore';

export default defineComponent({
  name: 'CertificatePage',
  setup: () => {
    const certificate = ref(defaultCertificate as Certificate);

    return {
      certificate: ref(certificate),
    };
  },
  data() {
    return {
      loading: false,
      success: false,
      vennootschapsnummer: '',
      rijksregisternummer: '',
    };
  },
  computed: {
    isCertificateAllowed() {
      const contentStore = useWebsiteContentStore();
      return contentStore.content?.buyCandle?.fiscalCertificateEnabled;
    },
  },
  methods: {
    submitForm() {
      this.loading = true;

      if (this.rijksregisternummer) {
        this.certificate.rijksregisternummer = this.rijksregisternummer;
      } else if (this.vennootschapsnummer) {
        this.certificate.rijksregisternummer = this.vennootschapsnummer;
      } else {
        this.$q.notify({
          message: 'Error: ' + this.$t('isRequired', { field: this.$t('rijksregisternummer') + ' / ' + this.$t('vennootschapsnummer') }),
          color: 'negative',
          position: 'bottom',
          icon: 'report_problem',
        });
        this.loading = false;
        return;
      }

      const certificateStore = useCertificateStore();
      certificateStore
        .requestCertificate(this.certificate)
        .then(() => {
          this.success = true;
        })
        .catch((error) => {
          this.$q.notify({
            message: 'Error: ' + error.message,
            color: 'negative',
            position: 'bottom',
            icon: 'report_problem',
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    checkRijksregisterNummer() {
      if (!this.rijksregisternummer && !this.vennootschapsnummer) {
        return this.$t('isRequired', { field: this.$t('rijksregisternummer') + ' / ' + this.$t('vennootschapsnummer') });
      }
      if (this.rijksregisternummer && this.vennootschapsnummer) {
        return this.$t('isInvalid', { field: this.$t('rijksregisternummer') + ' / ' + this.$t('vennootschapsnummer') });
      }
      return true;
    },
  },
  components: {
    CertificateSuccessComponent,
    CertificateNotAllowedComponent,
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.page-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  flex-direction: column;
}

#page-container {
  padding: 2rem 6rem; // v h
  @media (max-width: 768px) {
    padding: 0 1rem; // v h
  }
}

.custom-form-item {
  display: flex;
  align-items: flex-start;
  padding-bottom: 0.5rem;
  @media (max-width: 960px) {
    flex-direction: column;
  }
}

.custom-form-item > label {
  width: 30%;
  @media (max-width: 960px) {
    width: 35%;
  }
}

.custom-form-item > p,
.custom-form-item > .q-btn {
  width: 100%;
}

.custom-form-item .input-field,
.custom-form-item .q-editor {
  width: 70%;
  @media (max-width: 960px) {
    width: 100%;
  }
}

.noBottomPadding {
  padding-bottom: 0 !important;
}
</style>
