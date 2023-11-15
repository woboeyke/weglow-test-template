import { getFunctions, httpsCallable } from 'firebase/functions';
import { defineStore } from 'pinia';
import { Candle } from 'src/models/Donations/Candle';
import appInsights from '../helpers/AppInsights';

const PAGE_SIZE = 20;

export const useMapStore = defineStore('Map', {
  state: () => ({
    candles: [] as Candle[],
    totalCountCandles: 0,
    candleLocations: [] as number[][],
  }),
  actions: {
    async getCandles(page = 0) {
      try {
        const projectName = process.env.PROJECT_NAME ?? '';

        const result = await httpsCallable(
          getFunctions(),
          'getCandles'
        )({ projectName, offset: page * PAGE_SIZE, pageSize: PAGE_SIZE }).then((result) => {
          return result.data as { data: Candle[]; locations: [][]; totalCount: number };
        });

        this.$patch((state) => {
          state.candles.push(
            ...result.data.filter((candle) => {
              state.candles.forEach((c) => {
                if (c.number === candle.number && c.name === candle.name && c.lat === candle.lat && c.lng === candle.lng) {
                  return false;
                }
              });
              return true;
            })
          );
          state.totalCountCandles = result.totalCount;
          state.candleLocations = result.locations;
        });
        return result;
      } catch (error) {
        console.error('Error whilst getting candles', error);
        appInsights.trackException({
          exception: error as Error,
          properties: { message: 'Error while getting candles', projectName: process.env.PROJECT_NAME },
        });
        return [];
      }
    },
  },
});
