<template>
  <div class="space-y-6">
    <!-- Header with Search & Add Button -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Projects</h1>
        <p class="text-sm text-slate-500 mt-0.5">Showcase your portfolio work, case studies, and engineering highlights.</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Search Input -->
        <div class="relative flex-1 sm:w-64">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input 
            id="projects-search-input"
            v-model="searchQuery" 
            type="text" 
            placeholder="Search projects or tags..." 
            class="input input-bordered input-sm h-10 w-full pl-9 pr-3 rounded-lg text-sm bg-white border-slate-200 focus:border-blue-500"
          />
        </div>

        <button 
          id="add-project-modal-btn"
          class="btn btn-primary btn-sm h-10 px-4 gap-2 font-semibold shadow-sm shrink-0" 
          @click="openAddForm"
        >
          <i class="fas fa-plus text-xs"></i>
          <span>New Project</span>
        </button>
      </div>
    </div>

    <!-- Filter stats -->
    <div class="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
      <span>Showing {{ filteredProjects.length }} of {{ projects.length }} projects</span>
      <span v-if="searchQuery" class="text-blue-600 cursor-pointer hover:underline" @click="searchQuery = ''">
        Clear filter
      </span>
    </div>

    <!-- Projects Grid (1 col mobile, 2 col tablet, 3 col desktop) -->
    <div v-if="filteredProjects.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div 
        v-for="project in filteredProjects" 
        :key="project.id" 
        class="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
      >
        <!-- Card Top Image & Details -->
        <div>
          <!-- Thumbnail with hover effect -->
          <div class="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
            <img 
              :src="project.image || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80'" 
              :alt="project.title" 
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <a 
                v-if="project.link" 
                :href="project.link" 
                target="_blank" 
                rel="noopener"
                class="text-xs font-semibold text-white bg-blue-600/90 hover:bg-blue-600 px-3 py-1.5 rounded-md backdrop-blur flex items-center gap-1.5"
              >
                <span>Live Demo</span>
                <i class="fas fa-external-link-alt text-[10px]"></i>
              </a>
            </div>
          </div>

          <!-- Body content -->
          <div class="p-4 sm:p-5">
            <div class="flex items-start justify-between gap-2">
              <h2 class="text-base font-bold text-slate-900 line-clamp-1">{{ project.title }}</h2>
              <a 
                v-if="project.link" 
                :href="project.link" 
                target="_blank" 
                rel="noopener"
                class="text-slate-400 hover:text-blue-600 p-1 shrink-0" 
                title="View Link"
              >
                <i class="fas fa-external-link-alt text-xs"></i>
              </a>
            </div>

            <p class="text-xs sm:text-sm text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
              {{ project.description }}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
              <span 
                v-for="tag in (project.tags || [])" 
                :key="tag" 
                class="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                {{ tag }}
              </span>
              <span v-if="!project.tags || !project.tags.length" class="text-[11px] text-slate-400 italic">
                No tags
              </span>
            </div>
          </div>
        </div>

        <!-- Card Action Footer -->
        <div class="px-4 sm:px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[11px] text-slate-400 font-mono truncate max-w-[120px]">
            {{ project.id }}
          </span>
          <div class="flex items-center gap-1">
            <button 
              :id="`edit-project-${project.id}`"
              class="btn btn-ghost btn-xs h-8 px-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium gap-1 rounded-md" 
              @click="editProject(project)"
            >
              <i class="fas fa-edit text-xs"></i>
              <span>Edit</span>
            </button>
            <button 
              :id="`delete-project-${project.id}`"
              class="btn btn-ghost btn-xs h-8 px-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 font-medium gap-1 rounded-md" 
              @click="confirmDelete(project)"
            >
              <i class="fas fa-trash-alt text-xs"></i>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-xl border border-slate-200/80 p-12 text-center max-w-md mx-auto">
      <div class="w-14 h-14 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-3">
        <i class="fas fa-folder-open"></i>
      </div>
      <h3 class="text-base font-bold text-slate-900">
        {{ searchQuery ? 'No matching projects found' : 'No projects added yet' }}
      </h3>
      <p class="text-xs text-slate-500 mt-1 mb-5">
        {{ searchQuery ? 'Try adjusting your search terms or clear the filter.' : 'Start adding your showcase applications, libraries, or client work.' }}
      </p>
      <button 
        v-if="searchQuery" 
        class="btn btn-outline btn-sm"
        @click="searchQuery = ''"
      >
        Clear Search
      </button>
      <button 
        v-else 
        class="btn btn-primary btn-sm gap-2"
        @click="openAddForm"
      >
        <i class="fas fa-plus text-xs"></i>
        <span>Add First Project</span>
      </button>
    </div>

    <!-- Add/Edit Project Modal -->
    <dialog class="modal" :class="{ 'modal-open': showAddProjectForm }">
      <div class="modal-box w-11/12 max-w-xl p-6 bg-white rounded-2xl shadow-2xl border border-slate-100">
        <div class="flex justify-between items-center pb-4 border-b border-slate-100 mb-5">
          <div>
            <h3 class="text-lg font-bold text-slate-900">
              {{ isEditing ? 'Edit Project' : 'Create New Project' }}
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">Fill in the project details below to update your portfolio.</p>
          </div>
          <button 
            id="close-project-modal-btn"
            class="btn btn-ghost btn-sm btn-square text-slate-400 hover:text-slate-600" 
            @click="closeForm"
          >
            <i class="fas fa-times text-sm"></i>
          </button>
        </div>

        <form @submit.prevent="submitProject" class="space-y-4">
          <!-- Project Title -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text font-semibold text-xs text-slate-700">Project Title *</span>
            </label>
            <input
              id="project-title-input"
              v-model="projectForm.title"
              type="text"
              placeholder="e.g. AI Workflow Automation Platform"
              class="input input-bordered w-full h-10 text-sm bg-white focus:border-blue-500"
              required
            />
          </div>

          <!-- Description -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text font-semibold text-xs text-slate-700">Description *</span>
            </label>
            <textarea
              id="project-desc-input"
              v-model="projectForm.description"
              placeholder="A brief overview of the goals, challenges, and architecture..."
              rows="3"
              class="textarea textarea-bordered w-full text-sm bg-white focus:border-blue-500 leading-relaxed"
              required
            ></textarea>
          </div>

          <!-- Image URL & Preview -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text font-semibold text-xs text-slate-700">Cover Image URL *</span>
            </label>
            <div class="flex gap-3 items-center">
              <input
                id="project-image-input"
                v-model="projectForm.image"
                type="url"
                placeholder="https://images.unsplash.com/..."
                class="input input-bordered flex-1 h-10 text-sm bg-white focus:border-blue-500"
                required
              />
              <div class="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                <img 
                  v-if="projectForm.image" 
                  :src="projectForm.image" 
                  alt="Preview" 
                  class="w-full h-full object-cover" 
                  @error="onImgError"
                />
                <i v-else class="fas fa-image text-slate-300 text-xs"></i>
              </div>
            </div>
          </div>

          <!-- Project / Demo URL -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text font-semibold text-xs text-slate-700">Project Demo or Repository Link *</span>
            </label>
            <input
              id="project-link-input"
              v-model="projectForm.link"
              type="url"
              placeholder="https://github.com/..."
              class="input input-bordered w-full h-10 text-sm bg-white focus:border-blue-500"
              required
            />
          </div>

          <!-- Tags -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text font-semibold text-xs text-slate-700">Tags (comma separated)</span>
            </label>
            <input
              id="project-tags-input"
              v-model="tagsInput"
              type="text"
              placeholder="Vue 3, Tailwind, TypeScript, Cloud"
              class="input input-bordered w-full h-10 text-sm bg-white focus:border-blue-500"
            />
            <div v-if="parsedTags.length" class="flex flex-wrap gap-1 mt-2">
              <span v-for="tag in parsedTags" :key="tag" class="badge badge-sm bg-blue-50 text-blue-700 border-blue-200">
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button 
              type="button" 
              class="btn btn-ghost btn-sm h-10 px-4 font-semibold text-slate-500 hover:text-slate-700"
              @click="closeForm"
            >
              Cancel
            </button>
            <button 
              id="save-project-submit-btn"
              type="submit" 
              class="btn btn-primary btn-sm h-10 px-5 gap-2 font-semibold shadow-sm"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="loading loading-spinner loading-xs"></span>
              <i v-else class="fas fa-check text-xs"></i>
              <span>{{ isEditing ? 'Save Changes' : 'Publish Project' }}</span>
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
        <h3 class="font-bold text-base text-slate-900">Delete Project</h3>
        <p class="text-xs text-slate-500 mt-1 leading-relaxed">
          Are you sure you want to delete <span class="font-bold text-slate-700">"{{ selectedProject?.title }}"</span>? This change will be saved immediately.
        </p>
        <div class="mt-5 flex items-center justify-end gap-2">
          <button 
            class="btn btn-ghost btn-sm h-9 text-slate-500" 
            @click="showDeleteConfirm = false"
          >
            Cancel
          </button>
          <button 
            id="confirm-delete-project-btn"
            class="btn btn-error btn-sm h-9 px-4 text-white font-semibold" 
            @click="deleteProject"
          >
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

export default {
  name: 'ProjectsAdmin',
  setup() {
    const store = useStore();
    const projects = ref([]);
    const searchQuery = ref('');
    const showAddProjectForm = ref(false);
    const showDeleteConfirm = ref(false);
    const isEditing = ref(false);
    const isSubmitting = ref(false);
    const selectedProject = ref(null);
    const tagsInput = ref('');

    const projectForm = reactive({
      title: '',
      description: '',
      image: '',
      link: '',
      tags: []
    });

    const parsedTags = computed(() => {
      if (!tagsInput.value) return [];
      return tagsInput.value.split(',').map(t => t.trim()).filter(Boolean);
    });

    const filteredProjects = computed(() => {
      if (!searchQuery.value.trim()) return projects.value;
      const q = searchQuery.value.toLowerCase();
      return projects.value.filter(p => {
        const matchTitle = p.title?.toLowerCase().includes(q);
        const matchDesc = p.description?.toLowerCase().includes(q);
        const matchTag = p.tags?.some(t => t.toLowerCase().includes(q));
        return matchTitle || matchDesc || matchTag;
      });
    });

    const fetchProjects = async () => {
      try {
        projects.value = await store.dispatch('fetchProjects');
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const resetForm = () => {
      projectForm.title = '';
      projectForm.description = '';
      projectForm.image = '';
      projectForm.link = '';
      projectForm.tags = [];
      tagsInput.value = '';
      isEditing.value = false;
      selectedProject.value = null;
      isSubmitting.value = false;
    };

    const openAddForm = () => {
      resetForm();
      showAddProjectForm.value = true;
    };

    const closeForm = () => {
      showAddProjectForm.value = false;
      resetForm();
    };

    const editProject = (project) => {
      isEditing.value = true;
      selectedProject.value = project;
      projectForm.title = project.title || '';
      projectForm.description = project.description || '';
      projectForm.image = project.image || '';
      projectForm.link = project.link || '';
      projectForm.tags = project.tags || [];
      tagsInput.value = project.tags?.join(', ') || '';
      showAddProjectForm.value = true;
    };

    const submitProject = async () => {
      try {
        isSubmitting.value = true;
        const projectData = {
          title: projectForm.title,
          description: projectForm.description,
          image: projectForm.image,
          link: projectForm.link,
          tags: tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag)
        };

        if (isEditing.value && selectedProject.value) {
          await store.dispatch('updateProject', {
            id: selectedProject.value.id,
            project: projectData
          });
        } else {
          await store.dispatch('addProject', projectData);
        }

        await fetchProjects();
        closeForm();
      } catch (error) {
        console.error('Error saving project:', error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const confirmDelete = (project) => {
      selectedProject.value = project;
      showDeleteConfirm.value = true;
    };

    const deleteProject = async () => {
      try {
        if (selectedProject.value) {
          await store.dispatch('deleteProject', selectedProject.value.id);
          await fetchProjects();
        }
        showDeleteConfirm.value = false;
        selectedProject.value = null;
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    };

    const onImgError = (e) => {
      e.target.src = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80';
    };

    fetchProjects();

    return {
      projects,
      searchQuery,
      filteredProjects,
      showAddProjectForm,
      showDeleteConfirm,
      projectForm,
      isEditing,
      isSubmitting,
      selectedProject,
      tagsInput,
      parsedTags,
      openAddForm,
      closeForm,
      editProject,
      submitProject,
      confirmDelete,
      deleteProject,
      onImgError
    };
  }
};
</script>
