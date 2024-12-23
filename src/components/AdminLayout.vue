<template>
  <div class="drawer drawer-mobile min-h-screen bg-gray-50">
    <input id="admin-sidebar" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <!-- Navbar -->
      <div class="navbar bg-white shadow-md px-4 lg:px-6 flex flex-col lg:flex-row items-center justify-between">
        <!-- Hamburger Menu -->
        <div class="flex-none mb-2 lg:mb-0 lg:mr-4">
          <label for="admin-sidebar" class="btn btn-square btn-ghost drawer-button lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </label>
        </div>
        <!-- Branding -->
        <div class="flex-1 text-2xl font-extrabold text-gray-700 text-center lg:text-left">
          Portfolio Admin
        </div>
        <!-- Logout Button -->
        <div class="flex-none lg:ml-auto">
          <button class="btn btn-ghost btn-square hover:bg-gray-100" @click="logout">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="p-6 flex-1">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>

    <div class="drawer-side">
      <label for="admin-sidebar" class="drawer-overlay"></label>
      <div class="bg-base-100 w-80 h-full">
        <!-- Profile Section -->
        <div class="p-4 border-b">
          <div class="flex items-center space-x-4">
            <div class="avatar w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              <img :src="profileImage" class="object-cover w-full h-full" alt="Profile" />
            </div>
            <div>
              <h3 class="font-bold text-lg text-gray-800">{{ profileName }}</h3>
              <p class="text-sm text-gray-500">Admin</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <ul class="menu p-4 overflow-y-auto text-gray-700">
          <li>
            <router-link to="/" class="flex items-center space-x-3 mb-2 hover:bg-gray-100 rounded-lg px-2 py-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/projects" class="flex items-center space-x-3 mb-2 hover:bg-gray-100 rounded-lg px-2 py-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Projects</span>
            </router-link>
          </li>
          <li>
            <router-link to="/blog-posts" class="flex items-center space-x-3 mb-2 hover:bg-gray-100 rounded-lg px-2 py-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
              </svg>
              <span>Blog Posts</span>
            </router-link>
          </li>
          <li>
            <router-link to="/social-media" class="flex items-center space-x-3 mb-2 hover:bg-gray-100 rounded-lg px-2 py-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Social Media</span>
            </router-link>
          </li>
          <li>
            <router-link to="/hero" class="flex items-center space-x-3 mb-2 hover:bg-gray-100 rounded-lg px-2 py-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Hero Section</span>
            </router-link>
          </li>
          <li>
            <router-link to="/profile" class="flex items-center space-x-3 hover:bg-gray-100 rounded-lg px-2 py-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';

export default {
  name: 'AdminLayout',
  setup() {
    const router = useRouter();
    const profileImage = 'https://placeholder.co/100x100';
    const profileName = ref('Admin Panel');

    const logout = async () => {
      try {
        const auth = getAuth();
        await signOut(auth);
        router.push('/login');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };

    return {
      profileImage,
      profileName,
      logout
    };
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.avatar img {
  width: 100px !important;
  height: 100px !important;
  object-fit: cover;
}
</style>
