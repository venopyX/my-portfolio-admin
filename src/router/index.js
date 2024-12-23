import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';
import AdminLayout from '@/components/AdminLayout.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Login' }
  },
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: '/projects',
        name: 'projects',
        component: () => import('@/components/ProjectsAdmin.vue'),
        meta: { title: 'Projects' }
      },
      {
        path: '/blog-posts',
        name: 'blog-posts',
        component: () => import('@/components/BlogPostsAdmin.vue'),
        meta: { title: 'Blog Posts' }
      },
      {
        path: '/social-media',
        name: 'social-media',
        component: () => import('@/components/SocialMediaAdmin.vue'),
        meta: { title: 'Social Media' }
      },
      {
        path: '/hero',
        name: 'hero',
        component: () => import('@/components/HeroAdmin.vue'),
        meta: { title: 'Hero Section' }
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/components/ProfileAdmin.vue'),
        meta: { title: 'Profile' }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const auth = getAuth();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = auth.currentUser;

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
