import { boot } from 'quasar/wrappers';
import { initializeApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyDS0OrvCcYFCMZwmQKSozLAyIwQXBZSDq0',
  authDomain: 'we-glow.firebaseapp.com',
  databaseURL: 'https://we-glow.firebaseio.com',
  projectId: 'we-glow',
  storageBucket: 'we-glow.appspot.com',
  messagingSenderId: '998810053265',
  appId: '1:998810053265:web:5eb95536012ebd15a9ad30',
  measurementId: 'G-2DL5V4LC3Y',
};

export default boot(async () => {
  // async ({ router, app }) => {
  initializeApp(firebaseConfig);

  const functions = getFunctions();
  functions.region = 'europe-west1';

  if (process.env.DEV) {
    connectFunctionsEmulator(functions, '127.0.0.1', process.env.FIREBASE_FUNCTIONS_PORT);
  }
});
