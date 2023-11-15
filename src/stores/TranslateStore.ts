import { getFunctions, httpsCallable } from 'firebase/functions';
import { defineStore } from 'pinia';
import appInsights from '../helpers/AppInsights';

type TranslationCache = {
  [text: string]: {
    [targetLanguage: string]: string;
  };
};
const translationCache: TranslationCache = {};

export const useTranslateStore = defineStore('Translate', {
  actions: {
    async getTranslation(text: string, targetLanguage: string) {
      // Check if translation is already cached
      if (translationCache[text] && translationCache[text][targetLanguage]) {
        console.debug(`\tTranslation of ${text} to ${targetLanguage} is already cached`);
        return translationCache[text][targetLanguage];
      }

      appInsights.trackEvent({
        name: 'Translate',
        properties: { text, targetLanguage, projectName: process.env.PROJECT_NAME },
      });

      // If not cached, fetch translation from the API
      try {
        return httpsCallable(
          getFunctions(),
          'translateText'
        )({ text, targetLanguage })
          .then((result) => {
            const newText = result.data as string;

            // Cache the translated text
            if (!translationCache[text]) {
              translationCache[text] = {};
            }
            translationCache[text][targetLanguage] = newText;

            return newText;
          })
          .catch((error) => {
            console.error(`Error whilst getting translating ${text} to ${targetLanguage}`, error);
            appInsights.trackException({
              exception: error as Error,
              properties: { message: 'Error while translating text', text, targetLanguage, projectName: process.env.PROJECT_NAME },
            });
            return text;
          });
      } catch (error) {
        console.error(`Error whilst getting translating ${text} to ${targetLanguage}`, error);
        appInsights.trackException({
          exception: error as Error,
          properties: { message: 'Error while translating text', text, targetLanguage, projectName: process.env.PROJECT_NAME },
        });
        return text;
      }
    },
  },
});
