<template>
  <div class="col">
    <q-btn rounded no-caps :class="textColor" :color="backgroundColor" @click="onClick">
      <slot name="default">
        <div style="display: flex; gap: 1rem; align-items: center">
          <q-icon :name="`fa-solid fa-${icon}`" v-if="icon" class="pricebox-icon" />
          <span v-html="formattedLabel" />
        </div>
      </slot>
    </q-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PriceBox',
  props: {
    price: {
      type: Number,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
  },
  computed: {
    textColor(): string {
      return this.selected ? 'text-primary' : 'text-secondary';
    },
    backgroundColor(): string {
      return this.selected ? 'primary' : 'secondary';
    },
    formattedLabel(): string {
      return `${this.label ? this.label + '<br/>' : ''}${this.currency} ${this.price}`;
    },
  },
  emits: ['click'],
  methods: {
    onClick(): void {
      this.$emit('click');
    },
  },
});
</script>

<style lang="scss" scoped>
.col {
  flex: 1 1 0;
  min-width: fit-content;
}

.q-btn {
  width: 100%;
  padding: 0.5rem 1rem;
  @media screen and (max-width: 992px) {
  }
}
</style>
