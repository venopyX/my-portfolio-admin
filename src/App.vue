<template>
  <div class="min-h-screen bg-base-200">
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
      <div class="loading loading-spinner loading-lg"></div>
    </div>
    <div v-else-if="!isAuthenticated" class="min-h-screen flex items-center justify-center">
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title justify-center mb-4">Admin Login</h2>
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input
                v-model="email"
                type="email"
                placeholder="admin@example.com"
                class="input input-bordered"
                :class="{ 'input-error': loginError }"
                required
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Password</span>
              </label>
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="input input-bordered"
                :class="{ 'input-error': loginError }"
                required
              />
              <label class="label" v-if="loginError">
                <span class="label-text-alt text-error">{{ loginError }}</span>
              </label>
            </div>
            <div class="form-control mt-6">
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="isLoginLoading"
              >
                <span v-if="isLoginLoading" class="loading loading-spinner loading-sm"></span>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <router-view v-else></router-view>

    <!-- Global Toast Notifications -->
    <div class="toast toast-end">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        :class="[
          'alert',
          toast.type === 'success' && 'alert-success',
          toast.type === 'error' && 'alert-error',
          toast.type === 'info' && 'alert-info',
          toast.type === 'warning' && 'alert-warning'
        ]"
      >
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'App',
  setup() {
    const router = useRouter();
    const auth = getAuth();
    
    const isLoading = ref(true);
    const isLoginLoading = ref(false);
    const isAuthenticated = ref(false);
    const email = ref('');
    const password = ref('');
    const loginError = ref('');
    const toasts = ref([]);

    const showToast = (message, type = 'info') => {
      const id = Date.now();
      toasts.value.push({ id, message, type });
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id);
      }, 3000);
    };

    const handleLogin = async () => {
      try {
        isLoginLoading.value = true;
        loginError.value = '';
        await signInWithEmailAndPassword(auth, email.value, password.value);
        showToast('Login successful!', 'success');
        router.push('/'); 
      } catch (error) {
        console.error('Login error:', error);
        loginError.value = 'Invalid email or password';
        showToast('Login failed. Please check your credentials.', 'error');
      } finally {
        isLoginLoading.value = false;
      }
    };

    onMounted(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        isAuthenticated.value = !!user;
        isLoading.value = false;
        
        if (!user && router.currentRoute.value.path !== '/login') {
          router.push('/login');
        }
      });

      // Cleanup subscription
      return () => unsubscribe();
    });

    return {
      isLoading,
      isLoginLoading,
      isAuthenticated,
      email,
      password,
      loginError,
      toasts,
      handleLogin
    };
  }
};
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

.toast {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 50;
}

.alert {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
