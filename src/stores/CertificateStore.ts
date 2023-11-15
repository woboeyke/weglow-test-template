import { getFunctions, httpsCallable } from 'firebase/functions';
import { defineStore } from 'pinia';
import { Certificate } from 'src/models/Certificate/Certificate';
import { RequestCertificateResonse } from 'src/models/Certificate/RequestCertificateResonse';
import appInsights from '../helpers/AppInsights';

export const useCertificateStore = defineStore('Certificate', {
  actions: {
    async requestCertificate(data: Certificate) {
      return httpsCallable<{ certificate: Certificate; projectId: string }, RequestCertificateResonse>(
        getFunctions(),
        'RequestCertificate'
      )({ certificate: data, projectId: process.env.PROJECT_NAME ?? '' })
        .then((result) => {
          appInsights.trackEvent({
            name: 'RequestCertificate',
            properties: { data, result, project: process.env.PROJECT_NAME },
          });
          return result;
        })
        .catch((error) => {
          console.error(error);
          appInsights.trackException({
            exception: error as Error,
            properties: { message: 'Error while requesting certificate', data, project: process.env.PROJECT_NAME },
          });
          throw error;
        });
    },
  },
});
