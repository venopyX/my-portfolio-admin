import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from '@/components/AdminLayout.vue';
import DashboardView from '@/views/DashboardView.vue';
import LoginView from '@/views/LoginView.vue';
import ProjectsAdmin from '@/components/ProjectsAdmin.vue';
import BlogPostsAdmin from '@/components/BlogPostsAdmin.vue';
import SocialMediaAdmin from '@/components/SocialMediaAdmin.vue';
import HeroAdmin from '@/components/HeroAdmin.vue';
import ProfileAdmin from '@/components/ProfileAdmin.vue';
import store from '@/store';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Login' }
  },
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: DashboardView,
        meta: { title: 'Dashboard' }
      },
      {
        path: 'projects',
        name: 'projects',
        component: ProjectsAdmin,
        meta: { title: 'Projects' }
      },
      {
        path: 'blog-posts',
        name: 'blog-posts',
        component: BlogPostsAdmin,
        meta: { title: 'Blog Posts' }
      },
      {
        path: 'social-media',
        name: 'social-media',
        component: SocialMediaAdmin,
        meta: { title: 'Social Media' }
      },
      {
        path: 'hero',
        name: 'hero',
        component: HeroAdmin,
        meta: { title: 'Hero Section' }
      },
      {
        path: 'profile',
        name: 'profile',
        component: ProfileAdmin,
        meta: { title: 'Profile' }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL || '/'),
  routes
});

// Error handling for chunk loading or network failures
router.onError((error, to) => {
  console.warn('Router error:', error);
  if (/loading chunk/i.test(error.message) || /failed to fetch/i.test(error.message)) {
    if (to && to.fullPath) {
      window.location.href = to.fullPath;
    } else {
      window.location.reload();
    }
  }
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  // Wait for auth to initialize before proceeding
  if (!store.getters.isAuthInitialized) {
    await store.dispatch('initAuth');
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = store.getters.isAuthenticated;

  // Update document title
  document.title = to.meta.title 
    ? `${to.meta.title} - Portfolio Admin` 
    : 'Portfolio Admin';

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
