<template>
  <div class="drawer lg:drawer-open min-h-screen bg-slate-50">
    <input id="admin-sidebar-toggle" type="checkbox" v-model="sidebarOpen" class="drawer-toggle" />
    
    <!-- Drawer Content (Main Body) -->
    <div class="drawer-content flex flex-col min-h-screen">
      <!-- Navbar -->
      <header class="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-6 backdrop-blur transition-all">
        <!-- Left: Mobile menu toggle + page heading -->
        <div class="flex items-center gap-3">
          <label 
            id="mobile-drawer-button"
            for="admin-sidebar-toggle" 
            class="btn btn-ghost btn-square btn-sm h-10 w-10 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </label>

          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold tracking-wide text-slate-400 hidden sm:inline">Portfolio Admin /</span>
            <span class="text-base sm:text-lg font-bold text-slate-800 capitalize">{{ currentRouteTitle }}</span>
          </div>
        </div>

        <!-- Right actions -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- View-Only Badge or Live Status Indicator -->
          <div 
            v-if="isReadOnly" 
            class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-semibold"
            title="Guest View-Only Mode"
          >
            <i class="fas fa-eye text-amber-600 text-[11px]"></i>
            <span>View Only</span>
          </div>
          <div 
            v-else 
            class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>CMS Active</span>
          </div>

          <!-- User avatar pill -->
          <div class="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div class="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
              <img :src="profileImage" :alt="profileName" class="w-full h-full object-cover" />
            </div>
            <div class="hidden md:flex flex-col">
              <span class="text-xs font-bold text-slate-800 leading-tight max-w-[120px] truncate">{{ profileName }}</span>
              <span v-if="isReadOnly" class="text-[10px] text-amber-600 font-semibold leading-tight">View-Only Guest</span>
              <span v-else class="text-[10px] text-slate-400 font-medium leading-tight truncate max-w-[120px]">{{ userEmail }}</span>
            </div>
          </div>

          <!-- Logout Button -->
          <button 
            id="admin-logout-button"
            class="btn btn-ghost btn-sm h-9 px-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5"
            @click="logout"
            :title="isReadOnly ? 'Exit View-Only Mode' : 'Sign out of Admin'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            <span class="text-xs font-semibold hidden sm:inline">{{ isReadOnly ? 'Exit Demo' : 'Logout' }}</span>
          </button>
        </div>
      </header>

      <!-- View-Only Top Notification Banner -->
      <div 
        v-if="isReadOnly" 
        id="admin-view-only-banner"
        class="bg-amber-500/10 border-b border-amber-300/80 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-amber-950 shrink-0"
      >
        <div class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
            <i class="fas fa-eye text-[11px]"></i>
          </span>
          <div>
            <strong class="font-bold text-amber-900">View-Only Demo Mode:</strong>
            <span class="text-amber-800 ml-1">You have read-only access to explore the CMS dashboard. Creation, editing, and deletion are disabled.</span>
          </div>
        </div>
        <button 
          id="exit-view-only-banner-btn"
          @click="logout" 
          class="btn btn-xs bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-semibold shrink-0 gap-1 ml-2 shadow-xs"
        >
          <i class="fas fa-sign-in-alt text-[10px]"></i>
          <span>Admin Login</span>
        </button>
      </div>

      <!-- Main Content Stage -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Drawer Side (Sidebar) -->
    <aside class="drawer-side z-40">
      <label for="admin-sidebar-toggle" class="drawer-overlay" aria-label="Close navigation"></label>
      
      <div class="flex flex-col justify-between w-72 min-h-full bg-white border-r border-slate-200 p-4">
        <div>
          <!-- Brand Header -->
          <div class="flex items-center justify-between pb-5 pt-2 px-2 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-sm">
                <i class="fas fa-layer-group text-sm"></i>
              </div>
              <div>
                <h1 class="text-base font-bold text-slate-900 leading-tight">Portfolio CMS</h1>
                <p class="text-xs text-slate-400 font-medium">Control Center</p>
              </div>
            </div>

            <!-- Mobile close button -->
            <button 
              id="sidebar-close-button"
              type="button"
              class="btn btn-ghost btn-xs btn-square lg:hidden text-slate-400 hover:text-slate-600"
              @click="sidebarOpen = false"
            >
              <i class="fas fa-times text-sm"></i>
            </button>
          </div>

          <!-- Navigation Links -->
          <nav class="mt-4 space-y-1" aria-label="Sidebar Navigation">
            <router-link 
              id="nav-dashboard-link"
              to="/" 
              @click="onNavClick"
              class="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              :class="isCurrent('/') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            >
              <div class="flex items-center gap-3">
                <i class="fas fa-chart-pie w-4 text-center" :class="isCurrent('/') ? 'text-blue-600' : 'text-slate-400'"></i>
                <span>Dashboard</span>
              </div>
            </router-link>

            <router-link 
              id="nav-projects-link"
              to="/projects" 
              @click="onNavClick"
              class="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              :class="isCurrent('/projects') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            >
              <div class="flex items-center gap-3">
                <i class="fas fa-folder-open w-4 text-center" :class="isCurrent('/projects') ? 'text-blue-600' : 'text-slate-400'"></i>
                <span>Projects</span>
              </div>
              <span v-if="projectCount > 0" class="badge badge-sm bg-slate-100 text-slate-600 border-none font-medium">
                {{ projectCount }}
              </span>
            </router-link>

            <router-link 
              id="nav-blog-posts-link"
              to="/blog-posts" 
              @click="onNavClick"
              class="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              :class="isCurrent('/blog-posts') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            >
              <div class="flex items-center gap-3">
                <i class="fas fa-newspaper w-4 text-center" :class="isCurrent('/blog-posts') ? 'text-blue-600' : 'text-slate-400'"></i>
                <span>Blog Posts</span>
              </div>
              <span v-if="blogCount > 0" class="badge badge-sm bg-slate-100 text-slate-600 border-none font-medium">
                {{ blogCount }}
              </span>
            </router-link>

            <router-link 
              id="nav-social-media-link"
              to="/social-media" 
              @click="onNavClick"
              class="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              :class="isCurrent('/social-media') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            >
              <div class="flex items-center gap-3">
                <i class="fas fa-share-alt w-4 text-center" :class="isCurrent('/social-media') ? 'text-blue-600' : 'text-slate-400'"></i>
                <span>Social Links</span>
              </div>
              <span v-if="socialCount > 0" class="badge badge-sm bg-slate-100 text-slate-600 border-none font-medium">
                {{ socialCount }}
              </span>
            </router-link>

            <div class="pt-3 pb-1 px-3">
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Content Sections</span>
            </div>

            <router-link 
              id="nav-hero-link"
              to="/hero" 
              @click="onNavClick"
              class="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              :class="isCurrent('/hero') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            >
              <div class="flex items-center gap-3">
                <i class="fas fa-flag w-4 text-center" :class="isCurrent('/hero') ? 'text-blue-600' : 'text-slate-400'"></i>
                <span>Hero Section</span>
              </div>
            </router-link>

            <router-link 
              id="nav-profile-link"
              to="/profile" 
              @click="onNavClick"
              class="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              :class="isCurrent('/profile') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            >
              <div class="flex items-center gap-3">
                <i class="fas fa-user-circle w-4 text-center" :class="isCurrent('/profile') ? 'text-blue-600' : 'text-slate-400'"></i>
                <span>Profile Details</span>
              </div>
            </router-link>
          </nav>
        </div>

        <!-- Footer Profile Card -->
        <div class="pt-4 border-t border-slate-100">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div class="flex items-center gap-2.5 overflow-hidden">
              <div class="w-9 h-9 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                <img :src="profileImage" :alt="profileName" class="w-full h-full object-cover" />
              </div>
              <div class="overflow-hidden">
                <p class="text-xs font-bold text-slate-800 truncate">{{ profileName }}</p>
                <p class="text-[11px] text-slate-500 truncate">{{ userEmail }}</p>
              </div>
            </div>
            <button 
              id="footer-logout-button"
              type="button"
              class="btn btn-ghost btn-xs btn-square text-slate-400 hover:text-red-600 hover:bg-red-50"
              @click="logout"
              title="Logout"
            >
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { getAuth, signOut } from 'firebase/auth';
import { isFirebaseConfigured } from '@/firebase';

export default {
  name: 'AdminLayout',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const sidebarOpen = ref(false);

    const isCurrent = (path) => route.path === path;

    const currentRouteTitle = computed(() => {
      if (route.path === '/') return 'Dashboard';
      if (route.path === '/projects') return 'Projects';
      if (route.path === '/blog-posts') return 'Blog Posts';
      if (route.path === '/social-media') return 'Social Links';
      if (route.path === '/hero') return 'Hero Section';
      if (route.path === '/profile') return 'Profile Details';
      return 'Overview';
    });

    const projectCount = computed(() => store.state.projects?.length || 0);
    const blogCount = computed(() => store.state.blogPosts?.length || 0);
    const socialCount = computed(() => store.state.socialMedia?.length || 0);

    const profileName = computed(() => {
      if (store.state.profile && store.state.profile.length > 0 && store.state.profile[0].name) {
        return store.state.profile[0].name;
      }
      return store.state.user?.displayName || 'Portfolio Owner';
    });

    const userEmail = computed(() => {
      return store.state.user?.email || 'admin@portfolio.local';
    });

    const profileImage = computed(() => {
      if (store.state.profile && store.state.profile.length > 0 && store.state.profile[0].image) {
        return store.state.profile[0].image;
      }
      return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
    });

    const isReadOnly = computed(() => store.getters.isReadOnly);

    const onNavClick = () => {
      // Auto close on mobile
      sidebarOpen.value = false;
    };

    onMounted(() => {
      store.dispatch('fetchProfile');
      store.dispatch('fetchProjects');
      store.dispatch('fetchBlogPosts');
      store.dispatch('fetchSocialMedia');
    });

    const logout = async () => {
      try {
        if (isFirebaseConfigured) {
          const auth = getAuth();
          await signOut(auth);
        }
      } catch (error) {
        console.warn('Error signing out of Firebase:', error);
      }
      localStorage.removeItem('portfolio_admin_user');
      store.commit('setUser', null);
      router.push('/login');
    };

    return {
      isReadOnly,
      sidebarOpen,
      isCurrent,
      currentRouteTitle,
      projectCount,
      blogCount,
      socialCount,
      profileImage,
      profileName,
      userEmail,
      onNavClick,
      logout
    };
  }
};
</script>

<style scoped>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
