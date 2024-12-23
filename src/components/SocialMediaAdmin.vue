<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Social Media Links</h1>
      <button class="btn btn-primary" @click="showAddForm = true">
        Add Social Link
      </button>
    </div>

    <!-- Social Media Links List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <TransitionGroup name="list">
        <div
          v-for="item in sortedSocialMedia"
          :key="item.id"
          class="card bg-base-100 shadow-xl"
        >
          <div class="card-body">
            <div class="flex items-center gap-4">
              <div :class="['w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl', item.class]">
                <i :class="item.icon"></i>
              </div>
              <div class="flex-1">
                <h2 class="card-title">{{ item.name }}</h2>
                <a :href="item.link" target="_blank" class="link link-primary text-sm">{{ item.link }}</a>
              </div>
              <div class="flex flex-col gap-2">
                <button 
                  class="btn btn-square btn-sm"
                  :disabled="item.order === 1"
                  @click="moveItem(item, 'up')"
                >
                  <i class="fas fa-chevron-up"></i>
                </button>
                <button 
                  class="btn btn-square btn-sm"
                  :disabled="item.order === socialMedia.length"
                  @click="moveItem(item, 'down')"
                >
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
            </div>
            <div class="card-actions justify-end mt-4">
              <button class="btn btn-primary btn-sm" @click="editItem(item)">
                Edit
              </button>
              <button class="btn btn-error btn-sm" @click="confirmDelete(item)">
                Delete
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Add/Edit Modal -->
    <dialog class="modal" :class="{ 'modal-open': showAddForm }">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">
          {{ isEditing ? 'Edit Social Media Link' : 'Add New Social Media Link' }}
        </h3>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Platform Name</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="e.g., LinkedIn"
              class="input input-bordered w-full"
              :class="{ 'input-error': v$.name.$error }"
              @blur="v$.name.$touch"
            />
            <label class="label" v-if="v$.name.$error">
              <span class="label-text-alt text-error">{{ v$.name.$errors[0].$message }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Link</span>
            </label>
            <input
              v-model="form.link"
              type="url"
              placeholder="https://..."
              class="input input-bordered w-full"
              :class="{ 'input-error': v$.link.$error }"
              @blur="v$.link.$touch"
            />
            <label class="label" v-if="v$.link.$error">
              <span class="label-text-alt text-error">{{ v$.link.$errors[0].$message }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Icon</span>
            </label>
            <div class="grid grid-cols-3 gap-2">
              <label
                v-for="option in socialIcons"
                :key="option.icon"
                class="flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-base-200"
                :class="{ 'border-primary bg-base-200': form.icon === option.icon }"
              >
                <input
                  type="radio"
                  :value="option.icon"
                  v-model="form.icon"
                  class="hidden"
                />
                <i :class="[option.icon, 'text-2xl']"></i>
                <span class="text-xs">{{ option.name }}</span>
              </label>
            </div>
            <label class="label" v-if="v$.icon.$error">
              <span class="label-text-alt text-error">{{ v$.icon.$errors[0].$message }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">CSS Class</span>
            </label>
            <select
              v-model="form.class"
              class="select select-bordered w-full"
              :class="{ 'select-error': v$.class.$error }"
              @blur="v$.class.$touch"
            >
              <option value="">Select a style</option>
              <option
                v-for="style in socialStyles"
                :key="style.class"
                :value="style.class"
              >
                {{ style.name }}
              </option>
            </select>
            <label class="label" v-if="v$.class.$error">
              <span class="label-text-alt text-error">{{ v$.class.$errors[0].$message }}</span>
            </label>
          </div>

          <div class="modal-action">
            <button type="button" class="btn" @click="closeForm">Cancel</button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="v$.$invalid || isSubmitting"
            >
              <span v-if="isSubmitting" class="loading loading-spinner loading-sm"></span>
              {{ isEditing ? 'Update' : 'Create' }}
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
      <div class="modal-box">
        <h3 class="font-bold text-lg">Confirm Delete</h3>
        <p class="py-4">Are you sure you want to delete this social media link? This action cannot be undone.</p>
        <div class="modal-action">
          <button class="btn" @click="showDeleteConfirm = false">Cancel</button>
          <button
            class="btn btn-error"
            @click="deleteItem"
            :disabled="isDeleting"
          >
            <span v-if="isDeleting" class="loading loading-spinner loading-sm"></span>
            Delete
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

    const socialMedia = computed(() => store.state.socialMedia);
    const sortedSocialMedia = computed(() => 
      [...socialMedia.value].sort((a, b) => a.order - b.order)
    );

    const socialIcons = [
      { name: 'LinkedIn', icon: 'fab fa-linkedin' },
      { name: 'GitHub', icon: 'fab fa-github' },
      { name: 'Twitter', icon: 'fab fa-twitter' },
      { name: 'Instagram', icon: 'fab fa-instagram' },
      { name: 'Facebook', icon: 'fab fa-facebook' },
      { name: 'YouTube', icon: 'fab fa-youtube' },
      { name: 'Medium', icon: 'fab fa-medium' },
      { name: 'Dev.to', icon: 'fab fa-dev' },
      { name: 'Stack Overflow', icon: 'fab fa-stack-overflow' }
    ];

    const socialStyles = [
      { name: 'LinkedIn Style', class: 'bg-[#0077B5]' },
      { name: 'GitHub Style', class: 'bg-[#333333]' },
      { name: 'Twitter Style', class: 'bg-[#1DA1F2]' },
      { name: 'Instagram Style', class: 'bg-[#E4405F]' },
      { name: 'Facebook Style', class: 'bg-[#1877F2]' },
      { name: 'YouTube Style', class: 'bg-[#FF0000]' },
      { name: 'Medium Style', class: 'bg-[#00AB6C]' },
      { name: 'Dev.to Style', class: 'bg-[#0A0A0A]' },
      { name: 'Stack Overflow Style', class: 'bg-[#F48024]' }
    ];

    const resetForm = () => {
      Object.keys(form).forEach(key => {
        form[key] = '';
      });
      v$.value.$reset();
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
      const items = [...socialMedia.value].sort((a, b) => a.order - b.order);
      const currentIndex = items.findIndex(i => i.id === item.id);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      if (newIndex >= 0 && newIndex < items.length) {
        const targetItem = items[newIndex];
        
        // Swap orders
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
          // Set order to last + 1
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
      if (!selectedItem.value) return;
      
      try {
        isDeleting.value = true;
        await store.dispatch('deleteSocialMedia', selectedItem.value.id);
        
        // Reorder remaining items
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

    // Fetch social media items on mount
    store.dispatch('fetchSocialMedia');

    return {
      socialMedia,
      sortedSocialMedia,
      showAddForm,
      showDeleteConfirm,
      form,
      isSubmitting,
      isDeleting,
      isEditing,
      socialIcons,
      socialStyles,
      v$,
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
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>