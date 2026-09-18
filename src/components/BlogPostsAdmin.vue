<template>
  <div class="space-y-6">
    <!-- Header with Search & Action -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Blog Posts</h1>
        <p class="text-sm text-slate-500 mt-0.5">Write technical writeups, design thinking essays, and release notes.</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Search Input -->
        <div class="relative flex-1 sm:w-64">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input 
            id="blog-search-input"
            v-model="searchQuery" 
            type="text" 
            placeholder="Search posts or topics..." 
            class="input input-bordered input-sm h-10 w-full pl-9 pr-3 rounded-lg text-sm bg-white border-slate-200 focus:border-blue-500"
          />
        </div>

        <button 
          id="add-blog-post-btn"
          class="btn btn-primary btn-sm h-10 px-4 gap-2 font-semibold shadow-sm shrink-0" 
          @click="openAddForm"
        >
          <i class="fas fa-plus text-xs"></i>
          <span>New Article</span>
        </button>
      </div>
    </div>

    <!-- Category Filter Chips -->
    <div v-if="categories.length > 1" class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
      <button 
        class="px-3 py-1.5 rounded-full font-medium transition-colors shrink-0"
        :class="selectedCategory === '' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
        @click="selectedCategory = ''"
      >
        All ({{ blogPosts.length }})
      </button>
      <button 
        v-for="cat in categories" 
        :key="cat"
        class="px-3 py-1.5 rounded-full font-medium transition-colors shrink-0"
        :class="selectedCategory === cat ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
        @click="selectedCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Blog Posts Grid (1 col mobile, 2 col tablet, 3 col desktop) -->
    <div v-if="filteredPosts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div 
        v-for="post in filteredPosts" 
        :key="post.id" 
        class="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
      >
        <div>
          <!-- Thumbnail -->
          <div class="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
            <img 
              :src="post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80'" 
              :alt="post.title" 
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            <div class="absolute top-3 left-3">
              <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur">
                {{ post.category || 'Article' }}
              </span>
            </div>
          </div>

          <!-- Body -->
          <div class="p-4 sm:p-5">
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <i class="far fa-calendar-alt text-[10px]"></i>
              <span>{{ formatDate(post.date) }}</span>
              <span v-if="post.author" class="before:content-['•'] before:mr-2">By {{ post.author }}</span>
            </div>

            <h2 class="text-base font-bold text-slate-900 line-clamp-1 mt-1.5 group-hover:text-blue-600 transition-colors">
              {{ post.title }}
            </h2>

            <p class="text-xs sm:text-sm text-slate-600 line-clamp-2 mt-2 leading-relaxed">
              {{ post.excerpt }}
            </p>
          </div>
        </div>

        <!-- Action Footer -->
        <div class="px-4 sm:px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[11px] text-slate-400 font-mono truncate max-w-[120px]">
            {{ post.slug || post.id }}
          </span>
          <div class="flex items-center gap-1">
            <button 
              :id="`edit-post-${post.id}`"
              class="btn btn-ghost btn-xs h-8 px-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium gap-1 rounded-md" 
              @click="editPost(post)"
            >
              <i class="fas fa-edit text-xs"></i>
              <span>Edit</span>
            </button>
            <button 
              :id="`delete-post-${post.id}`"
              class="btn btn-ghost btn-xs h-8 px-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 font-medium gap-1 rounded-md" 
              @click="confirmDelete(post)"
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
      <div class="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-3">
        <i class="fas fa-feather-alt"></i>
      </div>
      <h3 class="text-base font-bold text-slate-900">
        {{ searchQuery || selectedCategory ? 'No matching articles' : 'No articles published yet' }}
      </h3>
      <p class="text-xs text-slate-500 mt-1 mb-5">
        {{ searchQuery || selectedCategory ? 'Try resetting filters or adjusting search terms.' : 'Publish your first article or tutorial.' }}
      </p>
      <button 
        v-if="searchQuery || selectedCategory" 
        class="btn btn-outline btn-sm"
        @click="resetFilters"
      >
        Reset Filters
      </button>
      <button 
        v-else 
        class="btn btn-primary btn-sm gap-2"
        @click="openAddForm"
      >
        <i class="fas fa-plus text-xs"></i>
        <span>Write First Article</span>
      </button>
    </div>

    <!-- Add/Edit Blog Post Modal -->
    <dialog class="modal" :class="{ 'modal-open': showAddBlogPostForm }">
      <div class="modal-box w-11/12 max-w-4xl p-6 bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        <!-- Modal Header -->
        <div class="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 class="text-lg font-bold text-slate-900">
              {{ isEditing ? 'Edit Blog Article' : 'Compose New Article' }}
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">Draft markdown content with frontmatter preview.</p>
          </div>
          <button 
            id="close-blog-modal-btn"
            class="btn btn-ghost btn-sm btn-square text-slate-400 hover:text-slate-600" 
            @click="closeForm"
          >
            <i class="fas fa-times text-sm"></i>
          </button>
        </div>

        <!-- Modal Form Scrollable Body -->
        <form @submit.prevent="submitPost" class="space-y-4 overflow-y-auto pr-1 py-4 flex-1">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Title -->
            <div class="form-control sm:col-span-2">
              <label class="label py-1">
                <span class="label-text font-semibold text-xs text-slate-700">Article Title *</span>
              </label>
              <input
                id="blog-title-input"
                v-model="postForm.title"
                type="text"
                placeholder="e.g. Modern State Management Patterns with Vue 3"
                class="input input-bordered w-full h-10 text-sm bg-white focus:border-blue-500"
                required
              />
            </div>

            <!-- Category -->
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text font-semibold text-xs text-slate-700">Category / Topic *</span>
              </label>
              <input
                id="blog-category-input"
                v-model="postForm.category"
                type="text"
                placeholder="e.g. Engineering, Architecture, Tutorials"
                class="input input-bordered w-full h-10 text-sm bg-white focus:border-blue-500"
                required
              />
            </div>

            <!-- Cover Image URL -->
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text font-semibold text-xs text-slate-700">Cover Image URL *</span>
              </label>
              <input
                id="blog-image-input"
                v-model="postForm.image"
                type="url"
                placeholder="https://images.unsplash.com/..."
                class="input input-bordered w-full h-10 text-sm bg-white focus:border-blue-500"
                required
              />
            </div>
          </div>

          <!-- Excerpt -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text font-semibold text-xs text-slate-700">Short Excerpt *</span>
            </label>
            <textarea
              id="blog-excerpt-input"
              v-model="postForm.excerpt"
              placeholder="A captivating summary that appears on blog cards..."
              rows="2"
              class="textarea textarea-bordered w-full text-sm bg-white focus:border-blue-500 leading-relaxed"
              required
            ></textarea>
          </div>

          <!-- Markdown Content -->
          <div class="form-control">
            <label class="label py-1 flex items-center justify-between">
              <span class="label-text font-semibold text-xs text-slate-700">Article Content (Markdown) *</span>
              <span class="text-[11px] text-slate-400">Supports markdown headings, code blocks, lists</span>
            </label>
            <div class="border border-slate-200 rounded-xl overflow-hidden">
              <RichTextEditor
                v-model="postForm.content"
                class="min-h-[260px]"
              />
            </div>
          </div>

          <!-- Author & Date -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text font-semibold text-xs text-slate-700">Author *</span>
              </label>
              <input
                id="blog-author-input"
                v-model="postForm.author"
                type="text"
                placeholder="Your Name"
                class="input input-bordered w-full h-10 text-sm bg-white focus:border-blue-500"
                required
              />
            </div>

            <div class="form-control">
              <label class="label py-1">
                <span class="label-text font-semibold text-xs text-slate-700">Publish Date *</span>
              </label>
              <input
                id="blog-date-input"
                v-model="postForm.date"
                type="date"
                class="input input-bordered w-full h-10 text-sm bg-white focus:border-blue-500"
                required
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
            <button 
              type="button" 
              class="btn btn-ghost btn-sm h-10 px-4 font-semibold text-slate-500 hover:text-slate-700"
              @click="closeForm"
            >
              Cancel
            </button>
            <button 
              id="save-blog-submit-btn"
              type="submit" 
              class="btn btn-primary btn-sm h-10 px-5 gap-2 font-semibold shadow-sm"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="loading loading-spinner loading-xs"></span>
              <i v-else class="fas fa-check text-xs"></i>
              <span>{{ isEditing ? 'Update Article' : 'Publish Article' }}</span>
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
        <h3 class="font-bold text-base text-slate-900">Delete Blog Post</h3>
        <p class="text-xs text-slate-500 mt-1 leading-relaxed">
          Are you sure you want to delete <span class="font-bold text-slate-700">"{{ selectedPost?.title }}"</span>? This will remove the post permanently.
        </p>
        <div class="mt-5 flex items-center justify-end gap-2">
          <button 
            class="btn btn-ghost btn-sm h-9 text-slate-500" 
            @click="showDeleteConfirm = false"
          >
            Cancel
          </button>
          <button 
            id="confirm-delete-blog-btn"
            class="btn btn-error btn-sm h-9 px-4 text-white font-semibold" 
            @click="deletePost"
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

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import RichTextEditor from './RichTextEditor.vue';

const store = useStore();
const blogPosts = ref([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const showAddBlogPostForm = ref(false);
const showDeleteConfirm = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);
const selectedPost = ref(null);

const postForm = reactive({
  title: '',
  excerpt: '',
  content: '',
  image: '',
  date: '',
  category: '',
  author: '',
  slug: '',
  createdAt: null
});

const categories = computed(() => {
  const cats = new Set();
  blogPosts.value.forEach(p => {
    if (p.category) cats.add(p.category);
  });
  return Array.from(cats);
});

const filteredPosts = computed(() => {
  let list = blogPosts.value;
  if (selectedCategory.value) {
    list = list.filter(p => p.category === selectedCategory.value);
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(p => 
      p.title?.toLowerCase().includes(q) || 
      p.excerpt?.toLowerCase().includes(q) ||
      p.author?.toLowerCase().includes(q)
    );
  }
  return list;
});

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const generateSlug = (title) => {
  return (title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const fetchBlogPosts = async () => {
  try {
    const res = await store.dispatch('fetchBlogPosts');
    blogPosts.value = res || store.state.blogPosts || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
  }
};

const resetForm = () => {
  postForm.title = '';
  postForm.excerpt = '';
  postForm.content = '';
  postForm.image = '';
  postForm.date = new Date().toISOString().split('T')[0];
  postForm.category = '';
  postForm.author = store.state.profile?.[0]?.name || 'Author';
  postForm.slug = '';
  postForm.createdAt = null;
  isEditing.value = false;
  selectedPost.value = null;
  isSubmitting.value = false;
};

const openAddForm = () => {
  resetForm();
  showAddBlogPostForm.value = true;
};

const closeForm = () => {
  showAddBlogPostForm.value = false;
  resetForm();
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
};

const editPost = (post) => {
  isEditing.value = true;
  selectedPost.value = post;
  Object.assign(postForm, post);
  showAddBlogPostForm.value = true;
};

const submitPost = async () => {
  try {
    isSubmitting.value = true;
    const now = new Date();
    const postData = {
      ...postForm,
      slug: generateSlug(postForm.title),
      createdAt: postForm.createdAt || now.toISOString()
    };

    if (isEditing.value && selectedPost.value) {
      await store.dispatch('updateBlogPost', {
        id: selectedPost.value.id,
        blogPost: postData
      });
    } else {
      await store.dispatch('addBlogPost', postData);
    }

    await fetchBlogPosts();
    closeForm();
  } catch (error) {
    console.error('Error saving blog post:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDelete = (post) => {
  selectedPost.value = post;
  showDeleteConfirm.value = true;
};

const deletePost = async () => {
  try {
    if (selectedPost.value) {
      await store.dispatch('deleteBlogPost', selectedPost.value.id);
      await fetchBlogPosts();
    }
    showDeleteConfirm.value = false;
    selectedPost.value = null;
  } catch (error) {
    console.error('Error deleting blog post:', error);
  }
};

onMounted(() => {
  fetchBlogPosts();
});
</script>
