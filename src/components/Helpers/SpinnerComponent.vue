<template>
  <div class="row justify-center items-center" style="height: 100vh">
    <q-spinner-puff color="deep-orange" size="8em" />
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SpinnerComponent',
  data() {
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      notification: null as any,
      loading: true,
    };
  },
  mounted() {
    const quasar = useQuasar();
    setTimeout(() => {
      if (document.querySelector('.q-spinner') && this.loading == true) {
        this.notification = quasar.notify({
          message: 'Loading takes longer than expected. Something might be wrong on our end. Please try again later.',
          color: 'negative',
          timeout: 0,
          icon: 'warning',
        });
      }
    }, 7000);
  },
  unmounted() {
    this.loading = false;
    // hide notification
    if (this.notification) {
      this.notification();
    }
  },
});
</script>
