<template>
  <q-card flat :style="{ height: cardHeight, minHeight: minHeight }">
    <q-card-section class="q-pb-none">
      <h4
        class="bg-primary text-primary q-pa-sm q-px-md q-my-none"
        :class="{ 'text-center': centerTitle, 'text-h5': $q.screen.lt.lg, 'text-h4': $q.screen.lg }"
        :id="titleId"
      >
        <slot name="title"></slot>
      </h4>
    </q-card-section>

    <q-card-section
      class="q-px-md text-secondary"
      :class="{ 'q-mx-md': !noMargin, 'q-pt-none': noPadding }"
      :style="{ height: contentHeight }"
      :id="contentId"
    >
      <slot name="content"></slot>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';

export default defineComponent({
  name: 'CardComponent',
  props: {
    centerTitle: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    noPadding: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    noMargin: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    cardHeight: {
      type: String as PropType<string>,
      default: '',
    },
    contentHeight: {
      type: String as PropType<string>,
      default: '',
    },
    minHeight: {
      type: String as PropType<string>,
      default: '',
    },
    titleId: {
      type: String as PropType<string>,
      default: '',
    },
    contentId: {
      type: String as PropType<string>,
      default: '',
    },
  },
});
</script>

<style lang="scss" scoped>
.q-card__section {
  @media (max-width: 768px) {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
