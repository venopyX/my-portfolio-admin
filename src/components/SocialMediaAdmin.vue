<template>
  <div class="space-y-6">
    <!-- Header with Action -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Social Channels</h1>
          <span v-if="isReadOnly" class="badge badge-warning badge-sm font-bold gap-1">
            <i class="fas fa-eye text-[10px]"></i> View Only
          </span>
        </div>
        <p class="text-sm text-slate-500 mt-0.5">Manage external developer profiles, social presence, and direct links.</p>
      </div>

      <button 
        id="add-social-link-btn"
        class="btn btn-primary btn-sm h-10 px-4 gap-2 font-semibold shadow-sm shrink-0" 
        @click="openAddForm"
      >
        <i class="fas fa-plus text-xs"></i>
        <span>Add Channel</span>
      </button>
    </div>

    <!-- View-Only Notice Banner -->
    <div v-if="isReadOnly" class="bg-amber-500/10 border border-amber-300/60 rounded-xl p-3.5 flex items-center justify-between text-xs text-amber-900">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <i class="fas fa-eye text-xs"></i>
        </div>
        <div>
          <span class="font-bold">View-Only Guest Mode:</span>
          <span class="text-amber-800 ml-1">You can test the icon picker and modal preview, but additions, updates, and deletes are disabled to protect live data.</span>
        </div>
      </div>
      <span class="badge badge-warning badge-sm font-semibold shrink-0">Protected</span>
    </div>

    <!-- Alert / Toast in component if restricted action attempted -->
    <div v-if="actionRestrictedNotice" class="alert alert-warning text-xs font-semibold py-2 px-3 shadow-sm flex items-center justify-between">
      <div class="flex items-center gap-2">
        <i class="fas fa-exclamation-triangle"></i>
        <span>{{ actionRestrictedNotice }}</span>
      </div>
      <button class="btn btn-ghost btn-xs btn-square" @click="actionRestrictedNotice = ''">
        <i class="fas fa-times text-xs"></i>
      </button>
    </div>

    <!-- Social Media Links List -->
    <div v-if="sortedSocialMedia.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <TransitionGroup name="list">
        <div
          v-for="item in sortedSocialMedia"
          :key="item.id"
          class="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
        >
          <!-- Top section -->
          <div>
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 overflow-hidden">
                <div :class="['w-11 h-11 rounded-xl flex items-center justify-center text-white text-xl shrink-0 shadow-xs', item.class || 'bg-slate-800']">
                  <i :class="item.icon"></i>
                </div>
                <div class="overflow-hidden">
                  <div class="flex items-center gap-2">
                    <h2 class="text-base font-bold text-slate-900 leading-snug truncate">{{ item.name }}</h2>
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-500">
                      #{{ item.order }}
                    </span>
                  </div>
                  <a 
                    :href="item.link" 
                    target="_blank" 
                    rel="noopener"
                    class="text-xs text-slate-400 hover:text-blue-600 truncate block mt-0.5"
                  >
                    {{ item.link }}
                  </a>
                </div>
              </div>

              <!-- Reordering Buttons -->
              <div class="flex flex-col gap-1 shrink-0">
                <button 
                  class="btn btn-ghost btn-xs h-7 w-7 p-0 text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 rounded-md"
                  :disabled="item.order === 1"
                  @click="moveItem(item, 'up')"
                  title="Move Up"
                >
                  <i class="fas fa-chevron-up text-xs"></i>
                </button>
                <button 
                  class="btn btn-ghost btn-xs h-7 w-7 p-0 text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 rounded-md"
                  :disabled="item.order === sortedSocialMedia.length"
                  @click="moveItem(item, 'down')"
                  title="Move Down"
                >
                  <i class="fas fa-chevron-down text-xs"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <a 
              :href="item.link" 
              target="_blank" 
              rel="noopener"
              class="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
            >
              <span>Visit Link</span>
              <i class="fas fa-external-link-alt text-[10px]"></i>
            </a>

            <div class="flex items-center gap-1">
              <button 
                :id="`edit-social-${item.id}`"
                class="btn btn-ghost btn-xs h-8 px-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium gap-1 rounded-md" 
                @click="editItem(item)"
              >
                <i class="fas fa-edit text-xs"></i>
                <span>Edit</span>
              </button>
              <button 
                :id="`delete-social-${item.id}`"
                class="btn btn-ghost btn-xs h-8 px-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 font-medium gap-1 rounded-md" 
                @click="confirmDelete(item)"
              >
                <i class="fas fa-trash-alt text-xs"></i>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-xl border border-slate-200/80 p-12 text-center max-w-md mx-auto">
      <div class="w-14 h-14 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl mb-3">
        <i class="fas fa-share-alt"></i>
      </div>
      <h3 class="text-base font-bold text-slate-900">No social profiles linked yet</h3>
      <p class="text-xs text-slate-500 mt-1 mb-5">Connect GitHub, LinkedIn, Twitter, or Discord so visitors can reach you.</p>
      <button 
        class="btn btn-primary btn-sm gap-2"
        @click="openAddForm"
      >
        <i class="fas fa-plus text-xs"></i>
        <span>Add First Channel</span>
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <dialog class="modal" :class="{ 'modal-open': showAddForm }">
      <div class="modal-box w-11/12 max-w-lg p-6 bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        <div class="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 class="text-lg font-bold text-slate-900">
              {{ isEditing ? 'Edit Social Channel' : 'Add Social Channel' }}
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">Select platform branding and verify destination URL.</p>
          </div>
          <button 
            id="close-social-modal-btn"
            class="btn btn-ghost btn-sm btn-square text-slate-400 hover:text-slate-600" 
            @click="closeForm"
          >
            <i class="fas fa-times text-sm"></i>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="space-y-4 overflow-y-auto pr-1 py-4 flex-1">
          <!-- Platform Name -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text font-semibold text-xs text-slate-700">Platform Name *</span>
            </label>
            <input
              id="social-name-input"
              v-model="form.name"
              type="text"
              placeholder="e.g. GitHub, LinkedIn, X / Twitter"
              class="input input-bordered w-full h-10 text-sm bg-white focus:border-blue-500"
              :class="{ 'input-error': v$.name.$error }"
              @blur="v$.name.$touch"
            />
            <label class="label py-0.5" v-if="v$.name.$error">
              <span class="label-text-alt text-error text-[11px]">{{ v$.name.$errors[0].$message }}</span>
            </label>
          </div>

          <!-- URL Link -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text font-semibold text-xs text-slate-700">Profile URL *</span>
            </label>
            <input
              id="social-link-input"
              v-model="form.link"
              type="url"
              placeholder="https://github.com/yourhandle"
              class="input input-bordered w-full h-10 text-sm bg-white focus:border-blue-500"
              :class="{ 'input-error': v$.link.$error }"
              @blur="v$.link.$touch"
            />
            <label class="label py-0.5" v-if="v$.link.$error">
              <span class="label-text-alt text-error text-[11px]">{{ v$.link.$errors[0].$message }}</span>
            </label>
          </div>

          <!-- Icon Selector Grid with Search -->
          <div class="form-control">
            <div class="flex items-center justify-between py-1">
              <label class="label p-0">
                <span class="label-text font-semibold text-xs text-slate-700">Select Icon *</span>
              </label>
              <div class="relative w-44">
                <input
                  v-model="iconSearchQuery"
                  type="text"
                  placeholder="Search icons (e.g. Telegram)..."
                  class="input input-xs input-bordered w-full pr-6 text-xs bg-white focus:border-blue-500"
                />
                <i v-if="!iconSearchQuery" class="fas fa-search absolute right-2 top-2 text-[10px] text-slate-400 pointer-events-none"></i>
                <button 
                  v-else 
                  type="button" 
                  class="absolute right-1.5 top-1 text-slate-400 hover:text-slate-600"
                  @click="iconSearchQuery = ''"
                >
                  <i class="fas fa-times text-[10px]"></i>
                </button>
              </div>
            </div>
            
            <div class="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-44 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
              <button
                type="button"
                v-for="option in filteredSocialIcons"
                :key="option.icon"
                class="flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-center group"
                :class="form.icon === option.icon ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs ring-1 ring-blue-500' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:border-slate-300'"
                @click="selectIcon(option)"
              >
                <i :class="[option.icon, 'text-lg mb-1 group-hover:scale-110 transition-transform']"></i>
                <span class="text-[10px] font-medium truncate max-w-[54px]">{{ option.name }}</span>
              </button>
            </div>
            <div v-if="filteredSocialIcons.length === 0" class="p-3 text-center text-xs text-slate-400 italic">
              No matching platform found for "{{ iconSearchQuery }}".
            </div>
            <label class="label py-0.5" v-if="v$.icon.$error">
              <span class="label-text-alt text-error text-[11px]">{{ v$.icon.$errors[0].$message }}</span>
            </label>
          </div>

          <!-- Style Color Theme -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text font-semibold text-xs text-slate-700">Brand Color Style *</span>
            </label>
            <select
              id="social-style-select"
              v-model="form.class"
              class="select select-bordered w-full text-sm bg-white focus:border-blue-500"
              :class="{ 'select-error': v$.class.$error }"
              @blur="v$.class.$touch"
            >
              <option value="">Select a platform brand color</option>
              <option
                v-for="style in socialStyles"
                :key="style.class"
                :value="style.class"
              >
                {{ style.name }}
              </option>
            </select>
            <label class="label py-0.5" v-if="v$.class.$error">
              <span class="label-text-alt text-error text-[11px]">{{ v$.class.$errors[0].$message }}</span>
            </label>
          </div>

          <!-- Live Preview inside modal -->
          <div v-if="form.name || form.icon" class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
            <div :class="['w-9 h-9 rounded-lg flex items-center justify-center text-white text-base shrink-0', form.class || 'bg-slate-800']">
              <i :class="form.icon || 'fas fa-link'"></i>
            </div>
            <div class="overflow-hidden">
              <p class="text-xs font-bold text-slate-900 truncate">{{ form.name || 'Channel Name' }}</p>
              <p class="text-[11px] text-slate-400 truncate">{{ form.link || 'https://...' }}</p>
            </div>
          </div>

          <!-- View-Only warning inside form if in demo mode -->
          <div v-if="isReadOnly" class="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <i class="fas fa-info-circle text-amber-600 shrink-0"></i>
            <span>Notice: Saving changes is disabled because you are logged in via View-Only mode.</span>
          </div>

          <!-- Modal Action -->
          <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
            <button type="button" class="btn btn-ghost btn-sm h-10 px-4 text-slate-500" @click="closeForm">
              Cancel
            </button>
            <button
              id="save-social-submit-btn"
              type="submit"
              class="btn btn-primary btn-sm h-10 px-5 gap-2 font-semibold shadow-sm"
              :class="{ 'btn-warning': isReadOnly }"
              :disabled="v$.$invalid || isSubmitting"
            >
              <span v-if="isSubmitting" class="loading loading-spinner loading-xs"></span>
              <template v-else>
                <i :class="isReadOnly ? 'fas fa-eye text-xs' : 'fas fa-check text-xs'"></i>
                <span>{{ isReadOnly ? 'Save (View-Only Mode)' : (isEditing ? 'Update Link' : 'Add Link') }}</span>
              </template>
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeForm">close</button>
      </form>
    </dialog>

    <!-- Delete Confirmation Modal -->
    <dialog class="modal" :class="{ 'modal-open': showDeleteConfirm }">
      <div class="modal-box max-w-sm p-6 bg-white rounded-2xl shadow-2xl border border-slate-100">
        <div class="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-lg mb-3">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3 class="font-bold text-base text-slate-900">Delete Channel</h3>
        <p class="text-xs text-slate-500 mt-1 leading-relaxed">
          Are you sure you want to delete <span class="font-bold text-slate-700">"{{ selectedItem?.name }}"</span>?
        </p>
        <p v-if="isReadOnly" class="text-xs text-amber-600 font-medium mt-2 bg-amber-50 p-2 rounded border border-amber-200">
          <i class="fas fa-lock text-[11px] mr-1"></i> Demo account is in View-Only mode. Deletion will be rejected.
        </p>
        <div class="mt-5 flex items-center justify-end gap-2">
          <button class="btn btn-ghost btn-sm h-9 text-slate-500" @click="showDeleteConfirm = false">Cancel</button>
          <button
            id="confirm-delete-social-btn"
            class="btn btn-error btn-sm h-9 px-4 text-white font-semibold"
            @click="deleteItem"
            :disabled="isDeleting"
          >
            <span v-if="isDeleting" class="loading loading-spinner loading-xs"></span>
            <span>{{ isReadOnly ? 'Delete (Restricted)' : 'Delete' }}</span>
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="showDeleteConfirm = false">close</button>
      </form>
    </dialog>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { required, url } from '@vuelidate/validators';

export default {
  name: 'SocialMediaAdmin',
  setup() {
    const store = useStore();
    const showAddForm = ref(false);
    const showDeleteConfirm = ref(false);
    const isSubmitting = ref(false);
    const isDeleting = ref(false);
    const isEditing = ref(false);
    const selectedItem = ref(null);
    const iconSearchQuery = ref('');
    const actionRestrictedNotice = ref('');

    const form = reactive({
      name: '',
      link: '',
      class: '',
      icon: '',
      order: 0
    });

    const rules = {
      name: { required },
      link: { required, url },
      class: { required },
      icon: { required }
    };

    const v$ = useVuelidate(rules, form);

    const isReadOnly = computed(() => store.getters.isReadOnly);
    const socialMedia = computed(() => store.state.socialMedia || []);
    const sortedSocialMedia = computed(() => 
      [...socialMedia.value].sort((a, b) => (a.order || 0) - (b.order || 0))
    );

    const socialIcons = [
      { name: 'Telegram', icon: 'fab fa-telegram', defaultClass: 'bg-[#229ED9]' },
      { name: 'WhatsApp', icon: 'fab fa-whatsapp', defaultClass: 'bg-[#25D366]' },
      { name: 'GitHub', icon: 'fab fa-github', defaultClass: 'bg-[#333333]' },
      { name: 'LinkedIn', icon: 'fab fa-linkedin', defaultClass: 'bg-[#0077B5]' },
      { name: 'X / Twitter', icon: 'fab fa-x-twitter', defaultClass: 'bg-[#000000]' },
      { name: 'Twitter Legacy', icon: 'fab fa-twitter', defaultClass: 'bg-[#1DA1F2]' },
      { name: 'YouTube', icon: 'fab fa-youtube', defaultClass: 'bg-[#FF0000]' },
      { name: 'Discord', icon: 'fab fa-discord', defaultClass: 'bg-[#5865F2]' },
      { name: 'Reddit', icon: 'fab fa-reddit-alien', defaultClass: 'bg-[#FF4500]' },
      { name: 'Twitch', icon: 'fab fa-twitch', defaultClass: 'bg-[#9146FF]' },
      { name: 'TikTok', icon: 'fab fa-tiktok', defaultClass: 'bg-[#010101]' },
      { name: 'Instagram', icon: 'fab fa-instagram', defaultClass: 'bg-[#E4405F]' },
      { name: 'Threads', icon: 'fas fa-at', defaultClass: 'bg-[#000000]' },
      { name: 'Bluesky', icon: 'fas fa-cloud', defaultClass: 'bg-[#0085FF]' },
      { name: 'GitLab', icon: 'fab fa-gitlab', defaultClass: 'bg-[#FC6D26]' },
      { name: 'Stack Overflow', icon: 'fab fa-stack-overflow', defaultClass: 'bg-[#F48024]' },
      { name: 'Medium', icon: 'fab fa-medium', defaultClass: 'bg-[#00AB6C]' },
      { name: 'Dev.to', icon: 'fab fa-dev', defaultClass: 'bg-[#0A0A0A]' },
      { name: 'Hashnode', icon: 'fas fa-hashtag', defaultClass: 'bg-[#2962FF]' },
      { name: 'CodePen', icon: 'fab fa-codepen', defaultClass: 'bg-[#000000]' },
      { name: 'CodeSandbox', icon: 'fas fa-cube', defaultClass: 'bg-[#151515]' },
      { name: 'Dribbble', icon: 'fab fa-dribbble', defaultClass: 'bg-[#EA4C89]' },
      { name: 'Behance', icon: 'fab fa-behance', defaultClass: 'bg-[#1769FF]' },
      { name: 'Mastodon', icon: 'fab fa-mastodon', defaultClass: 'bg-[#6364FF]' },
      { name: 'Slack', icon: 'fab fa-slack', defaultClass: 'bg-[#4A154B]' },
      { name: 'Spotify', icon: 'fab fa-spotify', defaultClass: 'bg-[#1DB954]' },
      { name: 'Kaggle', icon: 'fab fa-kaggle', defaultClass: 'bg-[#20BEFF]' },
      { name: 'NPM', icon: 'fab fa-npm', defaultClass: 'bg-[#CB3837]' },
      { name: 'Docker Hub', icon: 'fab fa-docker', defaultClass: 'bg-[#2496ED]' },
      { name: 'LeetCode', icon: 'fas fa-code', defaultClass: 'bg-[#FFA116]' },
      { name: 'Facebook', icon: 'fab fa-facebook', defaultClass: 'bg-[#1877F2]' },
      { name: 'Pinterest', icon: 'fab fa-pinterest', defaultClass: 'bg-[#BD081C]' },
      { name: 'Substack', icon: 'fas fa-newspaper', defaultClass: 'bg-[#FF6719]' },
      { name: 'Signal', icon: 'fas fa-comment-dots', defaultClass: 'bg-[#3A76F0]' },
      { name: 'Website / Portfolio', icon: 'fas fa-globe', defaultClass: 'bg-[#2563EB]' },
      { name: 'Email / Contact', icon: 'fas fa-envelope', defaultClass: 'bg-[#EA4335]' }
    ];

    const filteredSocialIcons = computed(() => {
      const q = iconSearchQuery.value.trim().toLowerCase();
      if (!q) return socialIcons;
      return socialIcons.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.icon.toLowerCase().includes(q)
      );
    });

    const socialStyles = [
      { name: 'Telegram Cyan Blue', class: 'bg-[#229ED9]' },
      { name: 'WhatsApp Green', class: 'bg-[#25D366]' },
      { name: 'GitHub Dark', class: 'bg-[#333333]' },
      { name: 'LinkedIn Blue', class: 'bg-[#0077B5]' },
      { name: 'X / Threads Black', class: 'bg-[#000000]' },
      { name: 'Twitter Sky Blue', class: 'bg-[#1DA1F2]' },
      { name: 'YouTube Red', class: 'bg-[#FF0000]' },
      { name: 'Discord Indigo', class: 'bg-[#5865F2]' },
      { name: 'Reddit Orange', class: 'bg-[#FF4500]' },
      { name: 'Twitch Purple', class: 'bg-[#9146FF]' },
      { name: 'TikTok Dark', class: 'bg-[#010101]' },
      { name: 'Instagram Rose', class: 'bg-[#E4405F]' },
      { name: 'Bluesky Azure', class: 'bg-[#0085FF]' },
      { name: 'GitLab Orange', class: 'bg-[#FC6D26]' },
      { name: 'Stack Overflow Orange', class: 'bg-[#F48024]' },
      { name: 'Medium Forest Green', class: 'bg-[#00AB6C]' },
      { name: 'Dev.to Deep Black', class: 'bg-[#0A0A0A]' },
      { name: 'Hashnode Blue', class: 'bg-[#2962FF]' },
      { name: 'Dribbble Pink', class: 'bg-[#EA4C89]' },
      { name: 'Behance Blue', class: 'bg-[#1769FF]' },
      { name: 'Mastodon Violet', class: 'bg-[#6364FF]' },
      { name: 'Slack Aubergine', class: 'bg-[#4A154B]' },
      { name: 'Spotify Green', class: 'bg-[#1DB954]' },
      { name: 'Kaggle Cyan', class: 'bg-[#20BEFF]' },
      { name: 'Docker Marine', class: 'bg-[#2496ED]' },
      { name: 'LeetCode Amber', class: 'bg-[#FFA116]' },
      { name: 'Facebook Royal', class: 'bg-[#1877F2]' },
      { name: 'Pinterest Red', class: 'bg-[#BD081C]' },
      { name: 'Substack Amber-Orange', class: 'bg-[#FF6719]' },
      { name: 'Signal Blue', class: 'bg-[#3A76F0]' },
      { name: 'Modern Royal Blue', class: 'bg-[#2563EB]' },
      { name: 'Google Red / Email', class: 'bg-[#EA4335]' }
    ];

    const selectIcon = (option) => {
      form.icon = option.icon;
      if (!form.name || form.name === 'GitHub' || form.name === 'LinkedIn') {
        form.name = option.name.split('/')[0].trim();
      }
      if (!form.class || form.class.startsWith('bg-[#')) {
        form.class = option.defaultClass;
      }
    };

    const resetForm = () => {
      Object.keys(form).forEach(key => {
        form[key] = '';
      });
      iconSearchQuery.value = '';
      v$.value.$reset();
    };

    const openAddForm = () => {
      resetForm();
      showAddForm.value = true;
    };

    const closeForm = () => {
      showAddForm.value = false;
      isEditing.value = false;
      selectedItem.value = null;
      resetForm();
    };

    const editItem = (item) => {
      selectedItem.value = item;
      isEditing.value = true;
      Object.assign(form, item);
      showAddForm.value = true;
    };

    const confirmDelete = (item) => {
      selectedItem.value = item;
      showDeleteConfirm.value = true;
    };

    const moveItem = async (item, direction) => {
      if (isReadOnly.value) {
        actionRestrictedNotice.value = 'Reordering channels is restricted in View-Only mode.';
        return;
      }

      const items = [...socialMedia.value].sort((a, b) => a.order - b.order);
      const currentIndex = items.findIndex(i => i.id === item.id);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      if (newIndex >= 0 && newIndex < items.length) {
        const targetItem = items[newIndex];
        
        const currentOrder = item.order;
        await store.dispatch('updateSocialMedia', {
          id: item.id,
          socialMediaItem: { ...item, order: targetItem.order }
        });
        await store.dispatch('updateSocialMedia', {
          id: targetItem.id,
          socialMediaItem: { ...targetItem, order: currentOrder }
        });

        await store.dispatch('fetchSocialMedia');
      }
    };

    const submitForm = async () => {
      if (isReadOnly.value) {
        actionRestrictedNotice.value = 'Action blocked: Demo account is in View-Only mode. Saving changes is disabled.';
        closeForm();
        return;
      }

      const isValid = await v$.value.$validate();
      if (!isValid) return;

      try {
        isSubmitting.value = true;
        
        if (isEditing.value && selectedItem.value) {
          await store.dispatch('updateSocialMedia', {
            id: selectedItem.value.id,
            socialMediaItem: { ...form }
          });
        } else {
          form.order = socialMedia.value.length + 1;
          await store.dispatch('addSocialMedia', { ...form });
        }
        
        await store.dispatch('fetchSocialMedia');
        closeForm();
      } catch (error) {
        console.error('Error submitting social media item:', error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const deleteItem = async () => {
      if (isReadOnly.value) {
        actionRestrictedNotice.value = 'Action blocked: Demo account is in View-Only mode. Deletions are disabled.';
        showDeleteConfirm.value = false;
        selectedItem.value = null;
        return;
      }

      if (!selectedItem.value) return;
      
      try {
        isDeleting.value = true;
        await store.dispatch('deleteSocialMedia', selectedItem.value.id);
        
        const items = socialMedia.value
          .filter(item => item.id !== selectedItem.value.id)
          .sort((a, b) => a.order - b.order);
        
        for (let i = 0; i < items.length; i++) {
          await store.dispatch('updateSocialMedia', {
            id: items[i].id,
            socialMediaItem: { ...items[i], order: i + 1 }
          });
        }

        await store.dispatch('fetchSocialMedia');
        showDeleteConfirm.value = false;
        selectedItem.value = null;
      } catch (error) {
        console.error('Error deleting social media item:', error);
      } finally {
        isDeleting.value = false;
      }
    };

    store.dispatch('fetchSocialMedia');

    return {
      isReadOnly,
      socialMedia,
      sortedSocialMedia,
      showAddForm,
      showDeleteConfirm,
      form,
      isSubmitting,
      isDeleting,
      isEditing,
      iconSearchQuery,
      filteredSocialIcons,
      actionRestrictedNotice,
      socialIcons,
      socialStyles,
      v$,
      selectIcon,
      openAddForm,
      editItem,
      confirmDelete,
      moveItem,
      submitForm,
      deleteItem,
      closeForm
    };
  }
};
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
