<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
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
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter();
    const auth = getAuth();
    
    const isLoading = ref(false);
    const email = ref('');
    const password = ref('');
    const loginError = ref('');

    const handleLogin = async () => {
      try {
        isLoading.value = true;
        loginError.value = '';
        await signInWithEmailAndPassword(auth, email.value, password.value);
        router.push('/');
      } catch (error) {
        console.error('Login error:', error);
        loginError.value = 'Invalid email or password';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      isLoading,
      email,
      password,
      loginError,
      handleLogin
    };
  }
};
</script>
