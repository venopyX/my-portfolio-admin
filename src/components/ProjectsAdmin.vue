<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Projects</h1>
      <button class="btn btn-primary btn-sm" @click="showAddProjectForm = true">
        <i class="fas fa-plus mr-2"></i> Add Project
      </button>
    </div>

    <!-- Projects List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="project in projects" :key="project.id" class="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
        <figure class="px-4 pt-4">
          <img :src="project.image" :alt="project.title" class="rounded-lg h-48 w-full object-cover" />
        </figure>
        <div class="card-body px-4 py-3">
          <h2 class="card-title text-lg">{{ project.title }}</h2>
          <p class="text-sm text-gray-600 line-clamp-2">{{ project.description }}</p>
          <div class="flex flex-wrap gap-2 mt-2">
            <span v-for="tag in project.tags" :key="tag" class="badge badge-sm">{{ tag }}</span>
          </div>
          <div class="card-actions justify-end mt-3">
            <button class="btn btn-ghost btn-sm" @click="editProject(project)">
              <i class="fas fa-edit text-blue-500"></i>
            </button>
            <button class="btn btn-ghost btn-sm" @click="confirmDelete(project)">
              <i class="fas fa-trash text-red-500"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Project Modal -->
    <dialog class="modal" :class="{ 'modal-open': showAddProjectForm }">
      <div class="modal-box w-11/12 max-w-2xl">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold">
            {{ isEditing ? 'Edit Project' : 'Add New Project' }}
          </h3>
          <button class="btn btn-ghost btn-sm" @click="closeForm">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="submitProject" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Title</span>
            </label>
            <input
              v-model="projectForm.title"
              type="text"
              placeholder="Project Title"
              class="input input-bordered w-full"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Description</span>
            </label>
            <textarea
              v-model="projectForm.description"
              placeholder="Project Description"
              class="textarea textarea-bordered h-24"
              required
            ></textarea>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Image URL</span>
            </label>
            <input
              v-model="projectForm.image"
              type="url"
              placeholder="https://example.com/image.jpg"
              class="input input-bordered w-full"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Project URL</span>
            </label>
            <input
              v-model="projectForm.link"
              type="url"
              placeholder="https://example.com"
              class="input input-bordered w-full"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Tags</span>
              <span class="label-text-alt text-gray-500">Comma separated</span>
            </label>
            <input
              v-model="tagsInput"
              type="text"
              placeholder="vue, javascript, web"
              class="input input-bordered w-full"
            />
          </div>

          <div class="modal-action">
            <button type="submit" class="btn btn-primary btn-sm">
              <i class="fas fa-save mr-2"></i> {{ isEditing ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </dialog>

    <!-- Delete Confirmation Modal -->
    <dialog class="modal" :class="{ 'modal-open': showDeleteConfirm }">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Delete Project</h3>
        <p class="text-gray-600">Are you sure you want to delete this project? This action cannot be undone.</p>
        <div class="modal-action">
          <button class="btn btn-ghost btn-sm" @click="showDeleteConfirm = false">
            <i class="fas fa-times mr-2"></i> Cancel
          </button>
          <button class="btn btn-error btn-sm" @click="deleteProject">
            <i class="fas fa-trash mr-2"></i> Delete
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ProjectsAdmin',
  setup() {
    const store = useStore();
    const projects = ref([]);
    const showAddProjectForm = ref(false);
    const showDeleteConfirm = ref(false);
    const isEditing = ref(false);
    const selectedProject = ref(null);
    const tagsInput = ref('');

    const projectForm = reactive({
      title: '',
      description: '',
      image: '',
      link: '',
      tags: []
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
    };

    const closeForm = () => {
      showAddProjectForm.value = false;
      resetForm();
    };

    const editProject = (project) => {
      isEditing.value = true;
      selectedProject.value = project;
      projectForm.title = project.title;
      projectForm.description = project.description;
      projectForm.image = project.image;
      projectForm.link = project.link;
      projectForm.tags = project.tags || [];
      tagsInput.value = project.tags?.join(', ') || '';
      showAddProjectForm.value = true;
    };

    const submitProject = async () => {
      try {
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

    fetchProjects();
    return {
      projects,
      showAddProjectForm,
      showDeleteConfirm,
      projectForm,
      isEditing,
      selectedProject,
      tagsInput,
      fetchProjects,
      resetForm,
      closeForm,
      editProject,
      submitProject,
      confirmDelete,
      deleteProject
    };
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
