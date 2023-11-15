import { getFunctions, httpsCallable } from 'firebase/functions';
import { defineStore } from 'pinia';
import { Price } from 'src/models/Content/BuyCandle/Price';
import { Content } from 'src/models/Content/Content';
import { Translation } from 'src/models/Content/Translation';
import { useI18n } from 'vue-i18n';
import WebFont from 'webfontloader';
import { setCssVar } from 'quasar';
import appInsights from '../helpers/AppInsights';

export const useWebsiteContentStore = defineStore('WebsiteContent', {
  state: () => ({
    content: {} as Content,
    loadingFont: true,
  }),
  getters: {
    getRemainingTime() {
      const { t } = useI18n();
      return () => {
        if (!this.content || !this.content.countdownDate) {
          return t('finished');
        }

        if (this.content.countdownDate && typeof this.content.countdownDate === 'string') {
          this.content.countdownDate = new Date(this.content.countdownDate);
        }
        if (this.content.countdownDate && typeof this.content.countdownDate === 'object') {
          const difference = this.content.countdownDate.getTime() - new Date().getTime();
          if (difference < 0) {
            return t('finished');
          }

          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / 1000 / 60) % 60);

          if (days > 0) {
            return `${days} ${days > 1 ? t('days') : t('day')}`;
          } else if (hours > 0) {
            return `${hours} ${hours > 1 ? t('hours') : t('hour')}`;
          } else if (minutes > 0) {
            return `${minutes} ${minutes > 1 ? t('minutes') : t('minute')}`;
          } else {
            return t('finished');
          }
        }
        return t('finished');
      };
    },
    getPrices() {
      return () => {
        return this.content.buyCandle.prices as Price[];
      };
    },
  },
  actions: {
    async getAllContent() {
      console.debug('Getting all content for', process.env.PROJECT_NAME);
      appInsights.trackEvent({
        name: 'GetAllContent',
        properties: { projectName: process.env.PROJECT_NAME },
      });

      return await httpsCallable(
        getFunctions(),
        'getAllContent'
      )(process.env.PROJECT_NAME)
        .then((result) => {
          console.debug('content', result.data);

          // countdownDate is a string, so we need to convert it to a Date object
          if (this.content.countdownDate && typeof this.content.countdownDate === 'string') {
            this.content.countdownDate = new Date(this.content.countdownDate);
          }

          this.content = result.data as Content;

          if (this.content.style.font.label) {
            const fontName = (result.data as Content).style.font.label;
            WebFont.load({
              google: {
                families: [fontName],
              },
              inactive() {
                console.error('Unable to load custom font', fontName);
                appInsights.trackEvent({
                  name: 'UnableToLoadFont',
                  properties: { fontName, projectName: process.env.PROJECT_NAME },
                });
              },
              active: () => {
                document.body.style.fontFamily = fontName;
                this.loadingFont = false;
              },
            });
          }

          for (const colorKey in this.content.style.colors) {
            console.debug('Setting color ' + colorKey, this.content.style.colors[colorKey as keyof typeof this.content.style.colors]);
            const colorValue = this.content.style.colors[colorKey as keyof typeof this.content.style.colors];
            setCssVar(colorKey, colorValue);
          }

          setCssVar('text-primary', this.content.style.textColorPrimary);
          setCssVar('text-secondary', this.content.style.textColorSecondary);

          return this.content;
        })
        .catch((error) => {
          console.error(error);
          appInsights.trackException({
            exception: error as Error,
            properties: { message: 'Error while getting all content', projectName: process.env.PROJECT_NAME },
          });
          throw error;
        });
    },
    getTranslation(object: Translation[], locale: string) {
      return object.find((translation) => translation.locale === locale)?.value;
    },
  },
});
