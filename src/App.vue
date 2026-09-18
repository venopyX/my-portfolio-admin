<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
    <!-- Initial Loader -->
    <div v-if="isLoading" class="min-h-screen flex flex-col items-center justify-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow animate-pulse">
        <i class="fas fa-layer-group"></i>
      </div>
      <span class="loading loading-spinner loading-md text-blue-600"></span>
      <p class="text-xs text-slate-400 font-medium tracking-wide">Initializing Portfolio Admin...</p>
    </div>

    <!-- Unauthenticated Login Screen -->
    <div v-else-if="!isAuthenticated" class="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div class="w-full max-w-md">
        <!-- Top Branding -->
        <div class="text-center mb-8">
          <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md mx-auto mb-3">
            <i class="fas fa-layer-group"></i>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Portfolio Admin</h1>
          <p class="text-xs text-slate-500 mt-1">Sign in to manage projects, blog articles, and profile content</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
          <!-- Error alert -->
          <div v-if="loginError" class="alert alert-error bg-red-50 text-red-800 border-red-200 text-xs py-3 mb-5">
            <i class="fas fa-exclamation-circle text-red-600"></i>
            <span>{{ loginError }}</span>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <!-- Email -->
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text font-semibold text-xs text-slate-700">Email Address</span>
              </label>
              <div class="relative">
                <i class="far fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input
                  id="app-login-email-input"
                  v-model="email"
                  type="email"
                  placeholder="admin@example.com"
                  class="input input-bordered w-full h-11 pl-10 text-sm bg-white focus:border-blue-500"
                  :class="{ 'input-error': loginError }"
                  required
                />
              </div>
            </div>

            <!-- Password -->
            <div class="form-control">
              <label class="label py-1 flex items-center justify-between">
                <span class="label-text font-semibold text-xs text-slate-700">Password</span>
              </label>
              <div class="relative">
                <i class="fas fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input
                  id="app-login-password-input"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="input input-bordered w-full h-11 pl-10 pr-10 text-sm bg-white focus:border-blue-500"
                  :class="{ 'input-error': loginError }"
                  required
                />
                <button 
                  type="button" 
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="pt-2">
              <button 
                id="app-login-submit-button"
                type="submit" 
                class="btn btn-primary w-full h-11 text-sm font-semibold shadow-sm"
                :disabled="isLoginLoading"
              >
                <span v-if="isLoginLoading" class="loading loading-spinner loading-xs"></span>
                <span v-else>Sign In</span>
              </button>
            </div>
          </form>

          <!-- View-Only Demo Preview or Hide Option -->
          <div v-if="!isDemoHidden" class="mt-6">
            <div class="relative my-4 text-center">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-slate-200"></div>
              </div>
              <span class="relative bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Guest Access
              </span>
            </div>

            <button
              id="app-demo-login-button"
              type="button"
              class="btn btn-outline w-full h-auto py-2.5 px-3 text-xs font-semibold text-slate-700 border-amber-300 bg-amber-50/60 hover:bg-amber-100 hover:border-amber-400 gap-2.5 transition-all shadow-xs text-left"
              @click="handleDemoLogin"
            >
              <div class="w-7 h-7 rounded-lg bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0">
                <i class="fas fa-eye text-xs"></i>
              </div>
              <div class="flex-1 overflow-hidden">
                <div class="flex items-center gap-1.5">
                  <span class="font-bold text-slate-900">Explore in View-Only Mode</span>
                  <span class="badge badge-warning badge-xs font-semibold text-[10px]">View Only</span>
                </div>
                <p class="text-[11px] text-slate-500 font-normal truncate mt-0.5">
                  Read-only inspection &bull; Creation & deletion disabled
                </p>
              </div>
            </button>

            <div class="text-center mt-3">
              <button 
                id="app-hide-demo-login-btn"
                type="button" 
                class="text-[11px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
                @click="toggleHideDemo"
                title="Hide demo login button"
              >
                Remove / Hide Demo Button
              </button>
            </div>
          </div>

          <div v-else class="mt-6 pt-4 border-t border-slate-100 text-center">
            <p class="text-xs text-slate-400">
              Guest demo button is currently hidden. 
              <button 
                id="app-restore-demo-login-btn"
                type="button" 
                class="text-blue-600 hover:underline font-semibold ml-1 cursor-pointer"
                @click="toggleHideDemo"
              >
                Restore View-Only Demo
              </button>
            </p>
          </div>
        </div>

        <div class="text-center mt-6 text-xs text-slate-400">
          Portfolio Admin &bull; Mobile-First Professional CMS
        </div>
      </div>
    </div>

    <!-- Authenticated Layout via Router -->
    <router-view v-else></router-view>

    <!-- Global Toast Notifications -->
    <div class="toast toast-bottom toast-end z-50 p-4 gap-2">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold"
        :class="[
          toast.type === 'success' ? 'bg-slate-900 text-white border-slate-800' : 
          toast.type === 'error' ? 'bg-red-600 text-white border-red-700' : 
          'bg-blue-600 text-white border-blue-700'
        ]"
      >
        <i 
          :class="[
            toast.type === 'success' ? 'fas fa-check-circle text-emerald-400' :
            toast.type === 'error' ? 'fas fa-exclamation-circle text-white' :
            'fas fa-info-circle text-white'
          ]"
        ></i>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { isFirebaseConfigured } from '@/firebase';

export default {
  name: 'App',
  setup() {
    const router = useRouter();
    const store = useStore();
    
    const isLoading = ref(true);
    const isLoginLoading = ref(false);
    const showPassword = ref(false);
    const email = ref('');
    const password = ref('');
    const loginError = ref('');
    const toasts = ref([]);
    const isDemoHidden = ref(localStorage.getItem('portfolio_hide_demo') === 'true');

    const toggleHideDemo = () => {
      isDemoHidden.value = !isDemoHidden.value;
      localStorage.setItem('portfolio_hide_demo', isDemoHidden.value ? 'true' : 'false');
    };

    const isAuthenticated = computed(() => store.getters.isAuthenticated);

    const showToast = (message, type = 'info') => {
      const id = Date.now();
      toasts.value.push({ id, message, type });
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id);
      }, 3000);
    };

    const handleDemoLogin = () => {
      const demoUser = {
        email: 'guest.preview@portfolio.view',
        displayName: 'Guest Reviewer',
        uid: 'demo-admin-uid',
        isReadOnly: true,
        isDemo: true
      };
      localStorage.setItem('portfolio_admin_user', JSON.stringify(demoUser));
      store.commit('setUser', demoUser);
      showToast('Entered in View-Only Demo Mode (Read-Only)', 'info');
      router.push('/');
    };

    const handleLogin = async () => {
      try {
        isLoginLoading.value = true;
        loginError.value = '';
        if (isFirebaseConfigured) {
          const auth = getAuth();
          await signInWithEmailAndPassword(auth, email.value, password.value);
          showToast('Sign in successful', 'success');
        } else {
          // Standard admin credentials in local offline mode
          const adminUser = {
            email: email.value || 'admin@portfolio.local',
            displayName: email.value ? email.value.split('@')[0] : 'Administrator',
            uid: `admin-${Date.now()}`,
            isReadOnly: false,
            isDemo: false
          };
          localStorage.setItem('portfolio_admin_user', JSON.stringify(adminUser));
          store.commit('setUser', adminUser);
          showToast('Signed in as Administrator', 'success');
        }
        router.push('/'); 
      } catch (error) {
        console.warn('Login error:', error);
        loginError.value = error.message || 'Invalid email or password';
        showToast('Login failed. Please check your credentials.', 'error');
      } finally {
        isLoginLoading.value = false;
      }
    };

    onMounted(() => {
      if (isFirebaseConfigured) {
        try {
          const auth = getAuth();
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
              store.commit('setUser', user);
            }
            isLoading.value = false;
          }, (err) => {
            console.warn('Auth state observation warning:', err);
            isLoading.value = false;
          });
          return () => unsubscribe();
        } catch (e) {
          console.warn('Firebase getAuth warning:', e);
          isLoading.value = false;
        }
      } else {
        isLoading.value = false;
      }
    });

    return {
      isLoading,
      isLoginLoading,
      showPassword,
      isAuthenticated,
      email,
      password,
      loginError,
      toasts,
      isDemoHidden,
      toggleHideDemo,
      handleLogin,
      handleDemoLogin
    };
  }
};
</script>
