<template>
  <div class="space-y-6">
    <!-- Header with Quick Action -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
        <p class="text-sm text-slate-500 mt-0.5">Manage your portfolio content, projects, and articles in real time.</p>
      </div>
      <div class="flex items-center gap-2.5">
        <router-link 
          id="dashboard-add-project-btn"
          to="/projects" 
          class="btn btn-primary btn-sm h-10 px-4 gap-2 font-semibold shadow-sm"
        >
          <i class="fas fa-plus text-xs"></i>
          <span>Add Project</span>
        </router-link>
        <router-link 
          id="dashboard-new-post-btn"
          to="/blog-posts" 
          class="btn btn-outline btn-sm h-10 px-3.5 gap-2 font-semibold text-slate-700 hover:bg-slate-100"
        >
          <i class="fas fa-pen-nib text-xs"></i>
          <span class="hidden sm:inline">New Post</span>
        </router-link>
      </div>
    </div>

    <!-- Stat Metrics Grid (2 cols mobile, 4 cols desktop) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <!-- Projects Metric -->
      <router-link 
        to="/projects"
        id="metric-card-projects"
        class="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Projects</span>
          <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <i class="fas fa-folder-open"></i>
          </div>
        </div>
        <div class="mt-3">
          <div class="text-2xl sm:text-3xl font-bold text-slate-900">{{ projects.length }}</div>
          <span class="text-xs text-slate-500 font-medium">Showcased works</span>
        </div>
      </router-link>

      <!-- Blog Metric -->
      <router-link 
        to="/blog-posts"
        id="metric-card-blog"
        class="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Articles</span>
          <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <i class="fas fa-newspaper"></i>
          </div>
        </div>
        <div class="mt-3">
          <div class="text-2xl sm:text-3xl font-bold text-slate-900">{{ blogPosts.length }}</div>
          <span class="text-xs text-slate-500 font-medium">Published posts</span>
        </div>
      </router-link>

      <!-- Social Metric -->
      <router-link 
        to="/social-media"
        id="metric-card-social"
        class="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Social Links</span>
          <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <i class="fas fa-share-alt"></i>
          </div>
        </div>
        <div class="mt-3">
          <div class="text-2xl sm:text-3xl font-bold text-slate-900">{{ socialMedia.length }}</div>
          <span class="text-xs text-slate-500 font-medium">Active channels</span>
        </div>
      </router-link>

      <!-- Profile Metric -->
      <router-link 
        to="/profile"
        id="metric-card-profile"
        class="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Profile Status</span>
          <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <i class="fas fa-check-circle"></i>
          </div>
        </div>
        <div class="mt-3">
          <div class="text-lg sm:text-xl font-bold text-slate-900 truncate">{{ profile ? profile.name || 'Setup' : 'Pending' }}</div>
          <span class="text-xs text-slate-500 font-medium">Public profile</span>
        </div>
      </router-link>
    </div>

    <!-- Main 2-Column Responsive Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Column (Projects & Blog Posts) -->
      <div class="lg:col-span-8 space-y-6">
        <!-- Projects Section -->
        <div class="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div class="flex items-center gap-2.5">
              <div class="w-2 h-2 rounded-full bg-blue-600"></div>
              <h2 class="text-base font-bold text-slate-800">Featured Projects</h2>
              <span class="badge badge-sm bg-slate-100 text-slate-600 border-none">{{ projects.length }}</span>
            </div>
            <router-link 
              id="dash-view-all-projects"
              to="/projects" 
              class="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Manage all</span>
              <i class="fas fa-chevron-right text-[10px]"></i>
            </router-link>
          </div>

          <div v-if="projects.length" class="divide-y divide-slate-100">
            <div 
              v-for="project in projects.slice(0, 4)" 
              :key="project.id" 
              class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div class="flex items-start sm:items-center gap-3.5">
                <img 
                  :src="project.image || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=150&q=80'" 
                  :alt="project.title" 
                  class="w-14 h-14 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0" 
                />
                <div>
                  <h3 class="text-sm font-bold text-slate-900 leading-snug">{{ project.title }}</h3>
                  <p class="text-xs text-slate-500 line-clamp-1 mt-0.5">{{ project.description }}</p>
                  <div class="flex flex-wrap gap-1.5 mt-2">
                    <span 
                      v-for="tag in (project.tags || []).slice(0, 3)" 
                      :key="tag" 
                      class="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
                <a 
                  v-if="project.link" 
                  :href="project.link" 
                  target="_blank" 
                  rel="noopener"
                  class="btn btn-ghost btn-xs h-8 px-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                  title="Open live project"
                >
                  <i class="fas fa-external-link-alt text-xs"></i>
                </a>
                <button 
                  :id="`delete-proj-${project.id}`"
                  @click="deleteProject(project.id)" 
                  class="btn btn-ghost btn-xs h-8 px-2 text-slate-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete project"
                >
                  <i class="fas fa-trash-alt text-xs"></i>
                </button>
              </div>
            </div>
          </div>
          <div v-else class="p-8 text-center">
            <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-lg mb-2">
              <i class="fas fa-folder-plus"></i>
            </div>
            <p class="text-sm font-medium text-slate-600">No projects added yet</p>
            <p class="text-xs text-slate-400 mt-1 mb-4">Start by adding your first showcase work.</p>
            <router-link to="/projects" class="btn btn-primary btn-sm">Add First Project</router-link>
          </div>
        </div>

        <!-- Blog Posts Section -->
        <div class="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div class="flex items-center gap-2.5">
              <div class="w-2 h-2 rounded-full bg-emerald-600"></div>
              <h2 class="text-base font-bold text-slate-800">Recent Articles</h2>
              <span class="badge badge-sm bg-slate-100 text-slate-600 border-none">{{ blogPosts.length }}</span>
            </div>
            <router-link 
              id="dash-view-all-blog"
              to="/blog-posts" 
              class="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Manage all</span>
              <i class="fas fa-chevron-right text-[10px]"></i>
            </router-link>
          </div>

          <div v-if="blogPosts.length" class="divide-y divide-slate-100">
            <div 
              v-for="post in blogPosts.slice(0, 4)" 
              :key="post.id" 
              class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div class="flex items-start gap-3.5">
                <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-100">
                  <i class="fas fa-feather-alt"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span v-if="post.category" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                      {{ post.category }}
                    </span>
                    <span class="text-[11px] text-slate-400">{{ post.date || 'Recent' }}</span>
                  </div>
                  <h3 class="text-sm font-bold text-slate-900 mt-1 leading-snug">{{ post.title }}</h3>
                  <p class="text-xs text-slate-500 line-clamp-1 mt-0.5">{{ post.excerpt }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button 
                  :id="`delete-post-${post.id}`"
                  @click="deleteBlogPost(post.id)" 
                  class="btn btn-ghost btn-xs h-8 px-2 text-slate-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete article"
                >
                  <i class="fas fa-trash-alt text-xs"></i>
                </button>
              </div>
            </div>
          </div>
          <div v-else class="p-8 text-center">
            <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-lg mb-2">
              <i class="fas fa-pen-fancy"></i>
            </div>
            <p class="text-sm font-medium text-slate-600">No blog posts published yet</p>
            <p class="text-xs text-slate-400 mt-1 mb-4">Write your first technical article or design breakdown.</p>
            <router-link to="/blog-posts" class="btn btn-primary btn-sm">Write Article</router-link>
          </div>
        </div>
      </div>

      <!-- Right Column (Hero & Profile Summary + Social) -->
      <div class="lg:col-span-4 space-y-6">
        <!-- Hero & Profile Card -->
        <div class="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-400">Hero & Identity</h2>
            <router-link to="/hero" class="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50 gap-1 font-semibold">
              <i class="fas fa-edit text-[10px]"></i>
              <span>Edit</span>
            </router-link>
          </div>

          <div v-if="hero" class="pt-4 space-y-3.5">
            <div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Title Headline</span>
              <p class="text-sm font-bold text-slate-900 mt-0.5">{{ hero.title }}</p>
            </div>
            <div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Subtitle</span>
              <p class="text-xs text-slate-600 mt-0.5 leading-relaxed">{{ hero.subtitle }}</p>
            </div>
            <div v-if="hero.typedStrings && hero.typedStrings.length">
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Rotating Tags</span>
              <div class="flex flex-wrap gap-1 mt-1">
                <span 
                  v-for="s in hero.typedStrings" 
                  :key="s" 
                  class="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100"
                >
                  {{ s }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="py-6 text-center text-xs text-slate-400 italic">
            Hero details not configured yet.
          </div>

          <!-- Profile quick view -->
          <div v-if="profile" class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img 
                :src="profile.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'" 
                :alt="profile.name" 
                class="w-10 h-10 rounded-full object-cover border border-slate-200" 
              />
              <div class="overflow-hidden">
                <p class="text-xs font-bold text-slate-900 truncate">{{ profile.name }}</p>
                <p class="text-[11px] text-slate-400 truncate max-w-[140px]">{{ profile.description }}</p>
              </div>
            </div>
            <router-link to="/profile" class="btn btn-ghost btn-xs text-slate-500 hover:text-blue-600">
              <i class="fas fa-cog"></i>
            </router-link>
          </div>
        </div>

        <!-- Social Media Quick Channels -->
        <div class="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <h2 class="text-sm font-bold uppercase tracking-wider text-slate-400">Social Channels</h2>
              <span class="badge badge-xs bg-slate-100 text-slate-600 border-none">{{ socialMedia.length }}</span>
            </div>
            <router-link to="/social-media" class="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50 gap-1 font-semibold">
              <i class="fas fa-plus text-[10px]"></i>
              <span>Add</span>
            </router-link>
          </div>

          <div v-if="socialMedia.length" class="pt-3 space-y-2">
            <div 
              v-for="item in socialMedia" 
              :key="item.id" 
              class="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-colors"
            >
              <div class="flex items-center gap-2.5 overflow-hidden">
                <div :class="['w-7 h-7 rounded-md flex items-center justify-center text-white text-xs shrink-0', item.class || 'bg-slate-700']">
                  <i :class="item.icon || 'fas fa-link'"></i>
                </div>
                <div class="overflow-hidden">
                  <span class="text-xs font-bold text-slate-800 block truncate">{{ item.name }}</span>
                  <a :href="item.link" target="_blank" rel="noopener" class="text-[11px] text-slate-400 hover:text-blue-600 block truncate max-w-[150px]">
                    {{ item.link }}
                  </a>
                </div>
              </div>
              <button 
                :id="`delete-soc-${item.id}`"
                @click="deleteSocialMedia(item.id)" 
                class="btn btn-ghost btn-xs text-slate-300 hover:text-red-600 hover:bg-red-50 p-1"
                title="Remove"
              >
                <i class="fas fa-times text-xs"></i>
              </button>
            </div>
          </div>
          <div v-else class="py-6 text-center text-xs text-slate-400 italic">
            No social accounts linked yet.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const profile = computed(() => (store.state.profile && store.state.profile[0]) || null);
const hero = computed(() => (store.state.hero && store.state.hero[0]) || null);
const projects = computed(() => store.state.projects || []);
const blogPosts = computed(() => store.state.blogPosts || []);
const socialMedia = computed(() => store.state.socialMedia || []);

const deleteProject = async (id) => {
  if (confirm('Are you sure you want to delete this project?')) {
    try {
      await store.dispatch('deleteProject', id);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }
};

const deleteBlogPost = async (id) => {
  if (confirm('Are you sure you want to delete this blog post?')) {
    try {
      await store.dispatch('deleteBlogPost', id);
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  }
};

const deleteSocialMedia = async (id) => {
  if (confirm('Are you sure you want to delete this social media link?')) {
    try {
      await store.dispatch('deleteSocialMedia', id);
    } catch (error) {
      console.error('Error deleting social media:', error);
    }
  }
};

onMounted(() => {
  store.dispatch('fetchProfile');
  store.dispatch('fetchHero');
  store.dispatch('fetchProjects');
  store.dispatch('fetchBlogPosts');
  store.dispatch('fetchSocialMedia');
});
</script>
