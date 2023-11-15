<template>
  <div id="message-list" style="height: 100%; padding: 0.5rem">
    <q-scroll-area id="scroll-div" style="height: 100%" v-if="anyCandles" @scroll="handleScroll">
      <MessageItemComponent v-for="candle in candles" :key="candle.number" :candle="candle" />
      <div class="row justify-center q-my-md">
        <q-spinner-dots color="primary" size="40px" />
      </div>
      <!-- <button @click="nextPage" :disabled="lastCandle">Next</button> -->
    </q-scroll-area>
    <div v-else class="row justify-center items-center" style="height: 100%; padding: 0 1rem">
      <q-item-label class="text-h6">{{ $t('noCandles') }}</q-item-label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MessageItemComponent from './MessageItemComponent.vue';
import { useMapStore } from 'src/stores/MapStore';
import { useI18n } from 'vue-i18n';
import { Candle } from 'src/models/Donations/Candle';

export default defineComponent({
  name: 'MessageListComponent',
  components: { MessageItemComponent },
  setup() {
    const { locale } = useI18n({ useScope: 'global' });
    const mapstore = useMapStore();

    const candles = ref<Candle[]>([]);
    const candleLocations = ref<number[][]>([]);
    const totalCountCandles = 0;
    const candlesPage = 0;

    return {
      locale,
      mapstore,
      candles,
      candleLocations,
      totalCountCandles,
      candlesPage,
    };
  },
  mounted() {
    const scrollDiv = document.getElementById('scroll-div');

    if (scrollDiv) {
      scrollDiv.addEventListener('scroll', this.handleScroll);
    }
  },
  beforeUnmount() {
    const scrollDiv = document.getElementById('scroll-div');

    if (scrollDiv) {
      scrollDiv.removeEventListener('scroll', this.handleScroll);
    }
  },
  methods: {
    updateCandles() {
      const tempCandles = JSON.parse(JSON.stringify(useMapStore().candles)) as Candle[];
      this.candles = tempCandles.map((candle) => {
        if (candle.name == '') {
          candle.name = this.$t('anonymous').toString();
        }
        return candle;
      });

      this.totalCountCandles = JSON.parse(JSON.stringify(useMapStore().totalCountCandles));
      this.candleLocations = JSON.parse(JSON.stringify(useMapStore().candleLocations));
    },
    handleScroll(event: any) {
      // Check if the user has scrolled to the bottom
      if (event.verticalContainerSize + event.verticalPosition >= event.verticalSize) {
        this.nextPage();
      }
    },
    async nextPage() {
      if (this.candles.length != this.totalCountCandles) {
        this.candlesPage += 1;
        await useMapStore().getCandles(this.candlesPage);
        this.updateCandles();
      }
    },
  },
  computed: {
    anyCandles() {
      return this.candles.length > 0;
    },
    lastCandle() {
      return this.candles.length >= this.totalCountCandles;
    },
  },
  watch: {
    locale: {
      handler() {
        this.updateCandles();
      },
      immediate: true,
    },
  },
});
</script>

<style lang="scss" scoped>
#message-list {
  background-color: white;
}
</style>
