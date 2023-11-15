<template>
  <div style="flex-direction: column" class="text-center">
    <div class="custom-form-item">
      <p>{{ $t('certificateNotAllowed') }}</p>
    </div>

    <div style="justify-content: center" class="custom-form-item full-width">
      <q-btn color="primary" :label="$t('home')" @click="goHome" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CertificateNotAllowedComponent',
  methods: {
    goHome() {
      this.$router.push({ path: '/' });
    },
  },
});
</script>

<style scoped lang="scss">
.q-btn {
  max-width: 15rem;
}
</style>
