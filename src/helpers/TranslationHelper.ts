import { Translation } from 'src/models/Content/Translation';
import { useTranslateStore } from 'src/stores/TranslateStore';
import appInsights from './AppInsights';

const pendingTranslations: Map<string, Promise<string>> = new Map();

export const getTranslation = (translations: Translation[], locale: NonNullable<unknown>) => {
  return new Promise<string>(async (resolve, reject) => {
    if (!translations || translations.length === 0) {
      resolve('');
      return;
    }

    const translation = translations.find((translation) => translation.locale === locale);

    if (!translation) {
      const originalText = translations[0].value;
      const pendingTranslation = pendingTranslations.get(originalText);

      if (pendingTranslation) {
        console.debug('Translation is already pending');
        // Wait for the existing pending translation to resolve
        try {
          const aiTranslation = await pendingTranslation;
          resolve(aiTranslation);
        } catch (error) {
          appInsights.trackException({
            exception: error as Error,
            properties: { message: 'Error while translating text', pendingTranslation, originalText, translations, locale },
          });
          reject(error);
        }
      } else {
        try {
          // Add to pending translations
          const newPendingTranslation = getAiTranslation(originalText, locale.toString());
          pendingTranslations.set(originalText, newPendingTranslation);

          // Resolve the translation when the AI translation is ready
          const aiTranslation = await newPendingTranslation;
          resolve(aiTranslation);

          // Remove from pending translations
          pendingTranslations.delete(originalText);
        } catch (error) {
          appInsights.trackException({
            exception: error as Error,
            properties: { message: 'Error while translating text', pendingTranslation, originalText, translations, locale },
          });
          reject(error);
        }
      }
    } else {
      resolve(translation.value);
    }
  });
};

export const getTranslationNoAi = (translations: Translation[], locale: NonNullable<unknown>) => {
  const translation = translations.find((translation) => translation.locale === locale);

  if (!translation) {
    return '';
  }
  return translation.value;
};

export const getAiTranslation = async (text: string, targetLanguage: string) => {
  console.debug(`Translating ${text} to ${targetLanguage} with DeepL api`);
  return useTranslateStore().getTranslation(text, targetLanguage);
};
