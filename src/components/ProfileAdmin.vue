<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Profile Details</h1>
        <p class="text-sm text-slate-500 mt-0.5">Manage your personal identification, public avatar, and biography.</p>
      </div>

      <div class="flex items-center gap-2">
        <button 
          id="profile-save-btn"
          type="button"
          class="btn btn-primary btn-sm h-10 px-5 gap-2 font-semibold shadow-sm"
          :disabled="isSaving"
          @click="handleProfileUpdate"
        >
          <span v-if="isSaving" class="loading loading-spinner loading-xs"></span>
          <i v-else class="fas fa-save text-xs"></i>
          <span>Save Profile</span>
        </button>
      </div>
    </div>

    <!-- Alert status -->
    <div v-if="saveSuccess" class="alert alert-success bg-emerald-50 text-emerald-800 border-emerald-200 text-xs py-3">
      <i class="fas fa-check-circle text-emerald-600"></i>
      <span>Profile updated successfully!</span>
    </div>

    <!-- Card -->
    <div class="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-7 shadow-xs">
      <form @submit.prevent="handleProfileUpdate" class="space-y-6">
        <div class="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
          <!-- Avatar Preview Container -->
          <div class="flex flex-col items-center gap-3 shrink-0 mx-auto sm:mx-0">
            <div class="w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 shadow-xs flex items-center justify-center relative group">
              <img 
                v-if="profileData.image" 
                :src="profileData.image" 
                :alt="profileData.name" 
                class="w-full h-full object-cover"
                @error="onAvatarError"
              />
              <div v-else class="text-center p-2 text-slate-300">
                <i class="fas fa-user text-3xl"></i>
                <span class="block text-[10px] mt-1">No Avatar</span>
              </div>
            </div>
            <span class="text-[11px] font-medium text-slate-400">Public Photo Preview</span>
          </div>

          <!-- Form Fields -->
          <div class="flex-1 space-y-4 w-full">
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text font-semibold text-xs text-slate-700">Display Name *</span>
              </label>
              <input
                id="profile-name-input"
                v-model="profileData.name"
                placeholder="e.g. Alex Morgan"
                class="input input-bordered w-full h-10 text-sm bg-white focus:border-blue-500"
                required
              />
            </div>

            <div class="form-control">
              <label class="label py-1">
                <span class="label-text font-semibold text-xs text-slate-700">Avatar Image URL</span>
              </label>
              <input
                id="profile-image-input"
                v-model="profileData.image"
                type="url"
                placeholder="https://images.unsplash.com/..."
                class="input input-bordered w-full h-10 text-sm bg-white focus:border-blue-500"
              />
              <span class="text-[11px] text-slate-400 mt-1">Direct link to your profile picture or Unsplash photo.</span>
            </div>

            <div class="form-control">
              <label class="label py-1 flex items-center justify-between">
                <span class="label-text font-semibold text-xs text-slate-700">Biography / About Me</span>
                <span class="text-[11px] text-slate-400">{{ (profileData.description || '').length }} characters</span>
              </label>
              <textarea
                id="profile-desc-input"
                v-model="profileData.description"
                placeholder="A concise summary of your background, technical interests, and experience..."
                rows="4"
                class="textarea textarea-bordered w-full text-sm bg-white focus:border-blue-500 leading-relaxed"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Live Author Badge Preview -->
        <div class="pt-5 border-t border-slate-100">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">Live Author Card Preview</span>
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
            <div class="w-12 h-12 rounded-full overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
              <img 
                :src="profileData.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'" 
                :alt="profileData.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="overflow-hidden">
              <h4 class="text-sm font-bold text-slate-900 leading-snug">{{ profileData.name || 'Author Name' }}</h4>
              <p class="text-xs text-slate-500 line-clamp-1 mt-0.5">{{ profileData.description || 'Full-stack software engineer & creator' }}</p>
            </div>
          </div>
        </div>

        <!-- Footer Action -->
        <div class="flex justify-end pt-2">
          <button 
            type="submit" 
            class="btn btn-primary btn-sm h-10 px-5 gap-2 font-semibold shadow-sm"
            :disabled="isSaving"
          >
            <span v-if="isSaving" class="loading loading-spinner loading-xs"></span>
            <i v-else class="fas fa-check text-xs"></i>
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "ProfileAdmin",
  data() {
    return {
      isSaving: false,
      saveSuccess: false,
      profileData: {
        image: "",
        name: "",
        description: "",
      },
    };
  },
  computed: {
    ...mapState(["profile"]),
  },
  methods: {
    ...mapActions(["fetchProfile", "updateProfile"]),
    async handleProfileUpdate() {
      try {
        this.isSaving = true;
        this.saveSuccess = false;
        await this.updateProfile(this.profileData);
        await this.fetchProfile();
        this.saveSuccess = true;
        setTimeout(() => {
          this.saveSuccess = false;
        }, 3000);
      } catch (error) {
        console.error("Error updating profile:", error);
      } finally {
        this.isSaving = false;
      }
    },
    onAvatarError(e) {
      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
    }
  },
  async mounted() {
    await this.fetchProfile();
    if (this.profile && this.profile.length > 0) {
      this.profileData = { ...this.profile[0] };
    }
  },
};
</script>
