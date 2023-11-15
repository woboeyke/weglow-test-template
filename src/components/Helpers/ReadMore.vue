<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup>
import { onBeforeMount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  lines: {
    type: Number,
    default: 3,
  },

  gLines: {
    type: Number,
    default: null,
  },

  maxLines: {
    type: Number,
    default: null,
  },

  textMore: {
    type: String,
    default: 'Read more',
  },

  textLess: {
    type: String,
    default: 'Read less',
  },

  noLess: {
    type: Boolean,
    default: false,
  },

  openByDefault: {
    type: Boolean,
    default: false,
  },

  open: {
    type: Boolean,
    default: null,
  },

  noButton: {
    type: Boolean,
    default: false,
  },

  noShadow: {
    type: Boolean,
    default: false,
  },
});

const to = ref(null);
const ht = ref(null);

const readmore = ref(false);
const expanded = ref(false);
const inMaxRange = ref(false);
const localMaxLines = ref(1);

watch(
  (v) => props.open,
  (newValue, oldValue) => {
    if (v !== expanded.value) {
      toggle(!v);
    }
  }
);

/* METHODS */

const toggle = (val) => {
  const valExp = typeof val === 'boolean' ? val : expanded.value;

  if (valExp) {
    if (!props.noLess) {
      to.value.style.removeProperty('max-height');
      expanded.value = false;
      // this.$emit('update:open', false); // TO DO Vue 2 > Vue 3
    }
  } else {
    expanded.value = true;
    // this.$emit('update:open', true); // TO DO Vue 2 > Vue 3
    to.value.style.setProperty('max-height', to.value.scrollHeight + 'px');
  }
};

const getLineHeight = (element) => {
  let temp = document.createElement(element.children[0].nodeName);
  const cpStyle = getComputedStyle(element.children[0]);

  temp.setAttribute(
    'style',
    'position:absolute;left:-999em;margin:0px;padding:0px;font-family:' + cpStyle.fontFamily + ';font-size:' + cpStyle.fontSize
  );

  temp.innerHTML = '.';
  temp = document.body.appendChild(temp);

  const ret = temp.clientHeight;
  temp.parentNode.removeChild(temp);
  return ret;
};

onBeforeMount(() => {
  if (props.lines && !props.maxLines) {
    localMaxLines.value = props.lines + 1;
  } else {
    localMaxLines.value = props.maxLines - 1;
  }

  if (true === props.open) {
    expanded.value = true;
  }
});

onMounted(() => {
  const lh = getLineHeight(to.value);

  if (props.lines) {
    to.value.style.setProperty('--nlines', props.lines);
  }

  let gLines = 2;

  if (props.gLines) {
    gLines = props.gLines;
  } else if (props.lines > 12) {
    gLines = 4;
  } else if (props.lines > 6) {
    gLines = 3;
  }

  if (ht.value) {
    ht.value.style.setProperty('--nlines', props.gLines);
  }

  if (props.open) {
    to.value.style.setProperty('max-height', '100%');
  }

  const timeout = setTimeout(() => {
    readmore.value = to.value.offsetHeight < to.value.scrollHeight;

    if (to.value.scrollHeight <= localMaxLines.value * lh) {
      inMaxRange.value = true;
    }

    to.value.style.setProperty('--lineHeight', lh + 'px');

    if (ht.value) {
      ht.value.style.setProperty('--lineHeight', lh + 'px');
    }

    if (props.open) {
      to.value.style.setProperty('max-height', to.value.scrollHeight + 'px');
    }
  });
});
</script>

<template>
  <div :class="{ expanded: expanded, 'no-overflow': inMaxRange }" class="text-overflow">
    <div ref="to" class="text-overflow-content">
      <slot></slot>
    </div>

    <div ref="ht" v-if="!noShadow" class="hide-text"></div>

    <div v-if="!noButton" @click="toggle" class="button-read-more">
      <slot name="more" v-bind:open="expanded">
        <div :class="{ 'show-less': !noLess }" class="read-more-button">
          <span>{{ expanded ? textLess : textMore }}</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.text-overflow-content {
  --nlines: 3;
  --lineHeight: 1.5;
  max-height: calc(var(--nlines) * var(--lineHeight));
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.text-overflow {
  position: relative;
}
.no-overflow {
  .text-overflow-content {
    max-height: 100%;
    overflow: visible;
  }
  .hide-text,
  .button-read-more {
    display: none;
  }
}
.read-more-button {
  cursor: pointer;
  display: block;
  position: relative;
  border-top: 1px solid #dbdbdb; // Line separator
  height: 0.1em;
  margin: 2em auto;
  width: 95%;
  text-align: center;
  span {
    // background: #fff;
    // background: $background; // Read more button background
    background: var(--q-background);
    color: #b5b5b5;
    display: inline-block;
    font-size: 0.75em;
    padding: 0.4em 0.8em;
    transform: translateY(-1.1em);
    text-align: center;
  }
}
.hide-text {
  --nlines: 6;
  --lineHeight: 1.5;
  // background-image: linear-gradient(
  //   to bottom,
  //   rgba(255, 255, 255, 0) 0%,
  //   rgba(255, 255, 255, 1) 90%,
  //   rgba(255, 255, 255, 1) 100%
  // ); // Text shadow
  // background-image: linear-gradient(
  //   to bottom,
  //   rgba(255, 255, 255, 0) 0%,
  //   $background 90%,
  //   $background 100%
  // ); // Text shadow
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, var(--q-background) 90%, var(--q-background) 100%); // Text shadow

  width: 100%;
  height: calc(var(--nlines) * var(--lineHeight));
  position: absolute;
  //noinspection CssInvalidFunction
  transform: translateY(calc(var(--nlines) * -1 * var(--lineHeight)));
}
.hide-text,
.read-more-button {
  transition: opacity 0.3s ease, margin 0.3s ease;
  opacity: 1;
}
.expanded {
  .hide-text,
  .read-more-button:not(.show-less) {
    opacity: 0;
    margin-top: 0;
    margin-bottom: 0;
    pointer-events: none;
  }
}
</style>
