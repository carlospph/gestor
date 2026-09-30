import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import { auth, authReady } from '../firebase';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  // Espera o estado inicial UMA vez
  await authReady;

  // Depois disso, SEMPRE leia o estado atual
  const user = auth.currentUser;

  console.log(
    `[guard] to=${to.path} user=${user?.email ?? 'null'} requiresAuth=${!!to
      .meta.requiresAuth} requiresGuest=${!!to.meta.requiresGuest}`
  );

  if (to.meta.requiresAuth && !user) {
    console.log('[guard] bloqueado → /login');
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  if (to.meta.requiresGuest && user) {
    console.log('[guard] já logado → /');
    return { name: 'home' };
  }

  return true;
});

export default router;
