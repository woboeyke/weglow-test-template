<template>
  <q-item style="height: 94%" class="text-secondary">
    <q-item-section>
      <q-item-label class="text-weight-bold">{{ candle.name }}</q-item-label>
      <q-item-label caption>{{ candle.description }}</q-item-label>
    </q-item-section>

    <q-item-section side top>
      <q-item-label caption>{{ candle.formattedDate }}</q-item-label>
      {{ currency }}{{ candle.flames }}
    </q-item-section>
  </q-item>

  <q-separator spaced inset />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Candle } from 'src/models/Donations/Candle';

export default defineComponent({
  name: 'MessageItemComponent',
  setup() {
    const currency = ref('€');
    return {
      currency,
    };
  },
  props: {
    candle: {
      type: Object as () => Candle,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.q-item__label--caption {
  color: inherit;
}
.q-item__section--side {
  color: inherit;
}
</style>
