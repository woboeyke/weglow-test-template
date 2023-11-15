import { getFunctions, httpsCallable } from 'firebase/functions';
import { defineStore } from 'pinia';
import appInsights from 'src/helpers/AppInsights';
import { BuyCandleRequest } from 'src/models/Donations/BuyCandleRequest';

export const useCandleStore = defineStore('Candle', {
  actions: {
    async buyCandle(data: BuyCandleRequest, locale: string) {
      const projectName = process.env.PROJECT_NAME ?? '';

      data.project = projectName;
      data.language = locale;

      appInsights.trackEvent({
        name: 'BuyCandle',
        properties: { data, project: projectName, locale },
      });

      return httpsCallable<BuyCandleRequest, { checkoutUrl: string }>(
        getFunctions(),
        'AddCandle'
      )(data)
        .then((result) => {
          appInsights.trackEvent({
            name: 'BuyCandleSuccess',
            properties: { data, result, project: process.env.PROJECT_NAME, locale, message: 'Redirecting to payconiq checkoutUrl' },
          });
          window.location.href = result.data.checkoutUrl;
        })
        .catch((error) => {
          console.error(error);
          appInsights.trackException({
            exception: error as Error,
            properties: { message: 'Error while buying candle', data, project: process.env.PROJECT_NAME, locale },
          });
          throw error;
        });
    },
    async checkIfPaid(data: { orderId: string }) {
      const result = await httpsCallable<{ orderId: string }, boolean>(getFunctions(), 'CheckIfPaid')(data);
      return result.data;
    },
  },
});
