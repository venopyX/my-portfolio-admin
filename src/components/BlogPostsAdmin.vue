<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Blog Posts</h1>
      <button class="btn btn-primary btn-sm flex items-center gap-2" @click="showAddBlogPostForm = true">
        <i class="fas fa-plus"></i> Add Post
      </button>
    </div>

    <!-- Blog Posts List -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="post in blogPosts" 
        :key="post.id" 
        class="card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        
        <!-- Blog Image -->
        <figure class="relative">
          <img 
            :src="post.image" 
            :alt="post.title" 
            class="rounded-t-lg w-full h-48 object-cover">
          <div class="absolute top-2 left-2">
            <span class="badge badge-sm text-xs text-white px-2 py-1 rounded" >
              {{ post.category }}
            </span>
          </div>
        </figure>
        
        <!-- Blog Details -->
        <div class="card-body p-4">
          <h2 class="text-lg font-semibold text-gray-900 truncate">{{ post.title }}</h2>
          <p class="text-sm text-gray-600 line-clamp-2">{{ post.excerpt }}</p>
          <div class="mt-4 flex justify-between items-center">
            <span class="text-xs text-gray-500">{{ formatDate(post.date) }}</span>
            <div class="flex gap-2">
              <button class="btn btn-ghost btn-sm text-blue-500 tooltip" @click="editPost(post)" title="Edit Post">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-ghost btn-sm text-red-500 tooltip" @click="confirmDelete(post)" title="Delete Post">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Blog Post Modal -->
    <dialog class="modal" :class="{ 'modal-open': showAddBlogPostForm }">
      <div class="modal-box w-11/12 max-w-5xl">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold">
            {{ isEditing ? 'Edit Blog Post' : 'Add New Blog Post' }}
          </h3>
          <button class="btn btn-ghost btn-sm" @click="closeForm">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="submitPost" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Title</span>
              </label>
              <input
                v-model="postForm.title"
                type="text"
                placeholder="Blog Post Title"
                class="input input-bordered w-full"
                required
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Category</span>
              </label>
              <input
                v-model="postForm.category"
                type="text"
                placeholder="Category"
                class="input input-bordered w-full"
                required
              />
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Image URL</span>
            </label>
            <input
              v-model="postForm.image"
              type="url"
              placeholder="https://example.com/image.jpg"
              class="input input-bordered w-full"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Excerpt</span>
            </label>
            <textarea
              v-model="postForm.excerpt"
              placeholder="Brief description of the blog post"
              class="textarea textarea-bordered h-24"
              required
            ></textarea>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Content</span>
            </label>
            <RichTextEditor
              v-model="postForm.content"
              class="min-h-[300px] border rounded-lg"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Author</span>
              </label>
              <input
                v-model="postForm.author"
                type="text"
                placeholder="Author Name"
                class="input input-bordered w-full"
                required
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Date</span>
              </label>
              <input
                v-model="postForm.date"
                type="date"
                class="input input-bordered w-full"
                required
              />
            </div>
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
        <h3 class="font-bold text-lg mb-4">Delete Blog Post</h3>
        <p class="text-gray-600">Are you sure you want to delete this blog post? This action cannot be undone.</p>
        <div class="modal-action">
          <button class="btn btn-ghost btn-sm" @click="showDeleteConfirm = false">
            <i class="fas fa-times mr-2"></i> Cancel
          </button>
          <button class="btn btn-error btn-sm" @click="deletePost">
            <i class="fas fa-trash mr-2"></i> Delete
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { db } from '@/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import RichTextEditor from './RichTextEditor.vue';

const blogPosts = ref([]);
const showAddBlogPostForm = ref(false);
const showDeleteConfirm = ref(false);
const isEditing = ref(false);
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

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const fetchBlogPosts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'blogPosts'));
    blogPosts.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
  }
};

const resetForm = () => {
  postForm.title = '';
  postForm.excerpt = '';
  postForm.content = '';
  postForm.image = '';
  postForm.date = '';
  postForm.category = '';
  postForm.author = '';
  postForm.slug = '';
  postForm.createdAt = null;
  isEditing.value = false;
  selectedPost.value = null;
};

const closeForm = () => {
  showAddBlogPostForm.value = false;
  resetForm();
};

const editPost = (post) => {
  isEditing.value = true;
  selectedPost.value = post;
  Object.assign(postForm, post);
  showAddBlogPostForm.value = true;
};

const submitPost = async () => {
  try {
    const now = new Date();
    const postData = {
      ...postForm,
      slug: generateSlug(postForm.title),
      createdAt: now.toISOString()
    };

    if (isEditing.value && selectedPost.value) {
      await updateDoc(doc(db, 'blogPosts', selectedPost.value.id), postData);
    } else {
      await addDoc(collection(db, 'blogPosts'), postData);
    }

    await fetchBlogPosts();
    closeForm();
  } catch (error) {
    console.error('Error saving blog post:', error);
  }
};

const confirmDelete = (post) => {
  selectedPost.value = post;
  showDeleteConfirm.value = true;
};

const deletePost = async () => {
  try {
    if (selectedPost.value) {
      await deleteDoc(doc(db, 'blogPosts', selectedPost.value.id));
      await fetchBlogPosts();
    }
    showDeleteConfirm.value = false;
    selectedPost.value = null;
  } catch (error) {
    console.error('Error deleting blog post:', error);
  }
};

fetchBlogPosts();
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.tooltip:hover::after {
  content: attr(title);
  position: absolute;
  background: #333;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
