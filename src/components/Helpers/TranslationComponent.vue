<template>
  <template v-if="!hasDefaultSlot">
    {{ translation }}
  </template>
  <template v-else>
    <slot :translation="translation" />
  </template>
</template>

<script lang="ts">
import { getTranslation } from 'src/helpers/TranslationHelper';
import { defineComponent, onMounted, ref, watch } from 'vue';
import { Translation } from 'src/models/Content/Translation';

export default defineComponent({
  name: 'TranslationComponent',
  props: {
    content: {
      type: Array as () => Translation[],
      required: true,
    },
    locale: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: String as () => any,
      required: true,
    },
  },
  setup(props, { slots }) {
    const translation = ref('');
    const hasDefaultSlot = slots.default !== undefined;

    // Watch for changes in the content prop and update the translation accordingly
    watch(
      [() => props.content, () => props.locale],
      async () => {
        try {
          translation.value = await getTranslation(props.content, props.locale);
        } catch (error) {
          console.error(error);
          translation.value = ''; // Return a default value or handle the error as needed
        }
      },
      { immediate: true } // Trigger the watch immediately on mount
    );

    // Fetch and set the translated title when the component is mounted
    onMounted(async () => {
      try {
        translation.value = await getTranslation(props.content, props.locale);
      } catch (error) {
        console.error(error);
        translation.value = ''; // Return a default value or handle the error as needed
      }
    });

    return {
      translation,
      hasDefaultSlot,
    };
  },
});
</script>
