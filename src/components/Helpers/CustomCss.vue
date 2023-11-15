<template>
  <component :is="'style'">
    {{ customCss }}
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CustomCss',
  props: {
    customCss: {
      type: String,
      required: true,
    },
  },
});
</script>
