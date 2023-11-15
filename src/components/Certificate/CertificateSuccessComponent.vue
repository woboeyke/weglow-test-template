<template>
  <div style="flex-direction: column" class="text-center">
    <div class="custom-form-item">
      <p>{{ $t('successfullyRequested') }}!</p>
    </div>
    <div class="custom-form-item">
      <p>{{ $t('mailIndicator') }}</p>
    </div>

    <div style="justify-content: center" class="custom-form-item full-width">
      <q-btn color="primary" :label="$t('home')" @click="goHome" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CertificateSuccessComponent',
  methods: {
    goHome() {
      this.$router.push({ path: '/' });
    },
  },
});
</script>

<style scoper lang="scss">
.q-btn {
  max-width: 15rem;
}
</style>
