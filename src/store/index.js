import { createStore } from "vuex";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export default createStore({
  state: {
    projects: [],
    blogPosts: [],
    socialMedia: [],
    hero: [],
    profile: [],
    loading: {
      projects: false,
      blogPosts: false,
      socialMedia: false,
      hero: false,
      profile: false
    },
    error: null
  },

  mutations: {
    setProjects(state, projects) {
      state.projects = projects;
    },
    setBlogPosts(state, blogPosts) {
      state.blogPosts = blogPosts;
    },
    setSocialMedia(state, socialMedia) {
      state.socialMedia = socialMedia;
    },
    setHero(state, hero) {
      state.hero = hero;
    },
    setProfile(state, profile) {
      state.profile = profile;
    },
    setLoading(state, { key, value }) {
      state.loading[key] = value;
    },
    setError(state, error) {
      state.error = error;
    },
    clearError(state) {
      state.error = null;
    }
  },

  actions: {
    // Error handling wrapper
    async handleAction({ commit }, action) {
      try {
        commit('clearError');
        return await action();
      } catch (error) {
        commit('setError', error.message);
        throw error;
      }
    },

    // Projects
    async fetchProjects({ commit, dispatch }) {
      commit('setLoading', { key: 'projects', value: true });
      
      await dispatch('handleAction', async () => {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const projects = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        commit("setProjects", projects);
      });

      commit('setLoading', { key: 'projects', value: false });
    },

    async addProject({ dispatch }, project) {
      return dispatch('handleAction', async () => {
        const projectData = {
          ...project,
          createdAt: serverTimestamp()
        };
        await addDoc(collection(db, "projects"), projectData);
      });
    },

    async updateProject({ dispatch }, { id, project }) {
      return dispatch('handleAction', async () => {
        const projectRef = doc(db, "projects", id);
        await updateDoc(projectRef, project);
      });
    },

    async deleteProject({ dispatch }, id) {
      return dispatch('handleAction', async () => {
        await deleteDoc(doc(db, "projects", id));
      });
    },

    // Blog Posts
    async fetchBlogPosts({ commit, dispatch }) {
      commit('setLoading', { key: 'blogPosts', value: true });
      
      await dispatch('handleAction', async () => {
        const q = query(collection(db, "blogPosts"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const blogPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        commit("setBlogPosts", blogPosts);
      });

      commit('setLoading', { key: 'blogPosts', value: false });
    },

    async addBlogPost({ dispatch }, blogPost) {
      return dispatch('handleAction', async () => {
        const blogPostData = {
          ...blogPost,
          createdAt: serverTimestamp()
        };
        await addDoc(collection(db, "blogPosts"), blogPostData);
      });
    },

    async updateBlogPost({ dispatch }, { id, blogPost }) {
      return dispatch('handleAction', async () => {
        const blogPostRef = doc(db, "blogPosts", id);
        await updateDoc(blogPostRef, blogPost);
      });
    },

    async deleteBlogPost({ dispatch }, id) {
      return dispatch('handleAction', async () => {
        await deleteDoc(doc(db, "blogPosts", id));
      });
    },

    // Social Media
    async fetchSocialMedia({ commit, dispatch }) {
      commit('setLoading', { key: 'socialMedia', value: true });
      
      await dispatch('handleAction', async () => {
        const q = query(collection(db, "socialMedia"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        const socialMedia = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        commit("setSocialMedia", socialMedia);
      });

      commit('setLoading', { key: 'socialMedia', value: false });
    },

    async addSocialMedia({ dispatch }, socialMediaItem) {
      return dispatch('handleAction', async () => {
        await addDoc(collection(db, "socialMedia"), socialMediaItem);
      });
    },

    async updateSocialMedia({ dispatch }, { id, socialMediaItem }) {
      return dispatch('handleAction', async () => {
        const socialMediaRef = doc(db, "socialMedia", id);
        await updateDoc(socialMediaRef, socialMediaItem);
      });
    },

    async deleteSocialMedia({ dispatch }, id) {
      return dispatch('handleAction', async () => {
        await deleteDoc(doc(db, "socialMedia", id));
      });
    },

    // Hero Section
    async fetchHero({ commit, dispatch }) {
      commit('setLoading', { key: 'hero', value: true });
      
      await dispatch('handleAction', async () => {
        const docRef = doc(db, "hero", "heroData");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          commit("setHero", [{ id: docSnap.id, ...docSnap.data() }]);
        }
      });

      commit('setLoading', { key: 'hero', value: false });
    },

    async updateHero({ dispatch }, heroData) {
      return dispatch('handleAction', async () => {
        const heroRef = doc(db, "hero", "heroData");
        await updateDoc(heroRef, heroData);
      });
    },

    // Profile
    async fetchProfile({ commit, dispatch }) {
      commit('setLoading', { key: 'profile', value: true });
      
      await dispatch('handleAction', async () => {
        const docRef = doc(db, "profile", "profileData");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          commit("setProfile", [{ id: docSnap.id, ...docSnap.data() }]);
        }
      });

      commit('setLoading', { key: 'profile', value: false });
    },

    async updateProfile({ dispatch }, profileData) {
      return dispatch('handleAction', async () => {
        const profileRef = doc(db, "profile", "profileData");
        await updateDoc(profileRef, profileData);
      });
    }
  },

  getters: {
    isLoading: (state) => (key) => state.loading[key],
    getError: (state) => state.error
  }
});
