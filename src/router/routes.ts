import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'success', component: () => import('pages/IndexPage.vue') },
      { path: 'error', component: () => import('pages/IndexPage.vue') },
    ],
  },
  {
    path: '/extra-info',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ExtraInfoPage.vue') }],
  },
  {
    path: '/certificate',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/CertificatePage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    // component: () => import('pages/ErrorNotFound.vue'),
    redirect: '/',
  },
];

export default routes;
