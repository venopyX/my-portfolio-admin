<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-2xl font-bold mb-8">Dashboard</h1>
    
    <!-- Profile Section -->
    <div class="mb-8 bg-white rounded-lg shadow-sm">
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-lg font-semibold">Profile</h2>
        <router-link to="/profile" class="btn btn-ghost btn-sm">
          <i class="fas fa-edit text-blue-500"></i>
        </router-link>
      </div>
      <div v-if="profile" class="p-4">
        <p class="mb-2"><span class="font-medium">Name:</span> {{ profile.name }}</p>
        <p><span class="font-medium">Description:</span> {{ profile.description }}</p>
      </div>
      <p v-else class="p-4 text-gray-500">No profile data available</p>
    </div>

    <!-- Hero Section -->
    <div class="mb-8 bg-white rounded-lg shadow-sm">
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-lg font-semibold">Hero Section</h2>
        <router-link to="/hero" class="btn btn-ghost btn-sm">
          <i class="fas fa-edit text-blue-500"></i>
        </router-link>
      </div>
      <div v-if="hero" class="p-4">
        <p class="mb-2"><span class="font-medium">Title:</span> {{ hero.title }}</p>
        <p><span class="font-medium">Subtitle:</span> {{ hero.subtitle }}</p>
      </div>
      <p v-else class="p-4 text-gray-500">No hero data available</p>
    </div>

    <!-- Projects Section -->
    <div class="mb-8 bg-white rounded-lg shadow-sm">
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-lg font-semibold">Projects</h2>
        <router-link to="/projects" class="btn btn-ghost btn-sm">
          <i class="fas fa-plus text-blue-500"></i>
        </router-link>
      </div>
      <div v-if="projects.length" class="divide-y">
        <div v-for="project in projects" :key="project.id" class="flex justify-between items-center p-4 hover:bg-gray-50">
          <span>{{ project.title }}</span>
          <button @click="deleteProject(project.id)" class="btn btn-ghost btn-sm">
            <i class="fas fa-trash text-red-500"></i>
          </button>
        </div>
      </div>
      <p v-else class="p-4 text-gray-500">No projects available</p>
    </div>

    <!-- Blog Posts Section -->
    <div class="mb-8 bg-white rounded-lg shadow-sm">
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-lg font-semibold">Blog Posts</h2>
        <router-link to="/blog-posts" class="btn btn-ghost btn-sm">
          <i class="fas fa-plus text-blue-500"></i>
        </router-link>
      </div>
      <div v-if="blogPosts.length" class="divide-y">
        <div v-for="post in blogPosts" :key="post.id" class="flex justify-between items-center p-4 hover:bg-gray-50">
          <span>{{ post.title }}</span>
          <button @click="deleteBlogPost(post.id)" class="btn btn-ghost btn-sm">
            <i class="fas fa-trash text-red-500"></i>
          </button>
        </div>
      </div>
      <p v-else class="p-4 text-gray-500">No blog posts available</p>
    </div>

    <!-- Social Media Section -->
    <div class="mb-8 bg-white rounded-lg shadow-sm">
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-lg font-semibold">Social Media</h2>
        <router-link to="/social-media" class="btn btn-ghost btn-sm">
          <i class="fas fa-plus text-blue-500"></i>
        </router-link>
      </div>
      <div v-if="socialMedia.length" class="divide-y">
        <div v-for="item in socialMedia" :key="item.id" class="flex justify-between items-center p-4 hover:bg-gray-50">
          <span>{{ item.name }}</span>
          <div class="flex gap-2">
            <button @click="editSocialMedia(item)" class="btn btn-ghost btn-sm">
              <i class="fas fa-edit text-blue-500"></i>
            </button>
            <button @click="deleteSocialMedia(item.id)" class="btn btn-ghost btn-sm">
              <i class="fas fa-trash text-red-500"></i>
            </button>
          </div>
        </div>
      </div>
      <p v-else class="p-4 text-gray-500">No social media links available</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

const profile = ref(null);
const hero = ref(null);
const projects = ref([]);
const blogPosts = ref([]);
const socialMedia = ref([]);

const fetchProfile = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'profile'));
    if (!querySnapshot.empty) {
      profile.value = querySnapshot.docs[0].data();
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};

const fetchHero = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'hero'));
    if (!querySnapshot.empty) {
      hero.value = querySnapshot.docs[0].data();
    }
  } catch (error) {
    console.error('Error fetching hero:', error);
  }
};

const fetchProjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'projects'));
    projects.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
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

const fetchSocialMedia = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'socialMedia'));
    socialMedia.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching social media:', error);
  }
};

const deleteProject = async (id) => {
  if (confirm('Are you sure you want to delete this project?')) {
    try {
      await deleteDoc(doc(db, 'projects', id));
      projects.value = projects.value.filter(project => project.id !== id);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }
};

const deleteBlogPost = async (id) => {
  if (confirm('Are you sure you want to delete this blog post?')) {
    try {
      await deleteDoc(doc(db, 'blogPosts', id));
      blogPosts.value = blogPosts.value.filter(post => post.id !== id);
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  }
};

const deleteSocialMedia = async (id) => {
  if (confirm('Are you sure you want to delete this social media link?')) {
    try {
      await deleteDoc(doc(db, 'socialMedia', id));
      socialMedia.value = socialMedia.value.filter(item => item.id !== id);
    } catch (error) {
      console.error('Error deleting social media:', error);
    }
  }
};

onMounted(() => {
  fetchProfile();
  fetchHero();
  fetchProjects();
  fetchBlogPosts();
  fetchSocialMedia();
});
</script>
