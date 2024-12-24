import { createStore } from "vuex";
import { db } from "@/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
  setDoc
} from "firebase/firestore";

export default createStore({
  state: {
    projects: [],
    blogPosts: [],
    socialMedia: [],
    hero: [],
    profile: [],
    user: null,
    authInitialized: false,
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
    setUser(state, user) {
      state.user = user;
    },
    setAuthInitialized(state, value) {
      state.authInitialized = value;
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
        const heroRef = doc(db, "hero", "main");
        const heroDoc = await getDoc(heroRef);
        if (heroDoc.exists()) {
          const heroData = { id: heroDoc.id, ...heroDoc.data() };
          commit("setHero", [heroData]);
        } else {
          commit("setHero", []);
        }
      });

      commit('setLoading', { key: 'hero', value: false });
    },

    async updateHero({ dispatch }, heroData) {
      return dispatch('handleAction', async () => {
        const { typedStrings, ...otherData } = heroData;
        const processedData = {
          ...otherData,
          typedStrings: Array.isArray(typedStrings) ? typedStrings : typedStrings.split(',').map(s => s.trim())
        };
        const heroRef = doc(db, "hero", "main");
        await setDoc(heroRef, processedData, { merge: true });
      });
    },

    // Profile
    async fetchProfile({ commit, dispatch }) {
      commit('setLoading', { key: 'profile', value: true });
      
      await dispatch('handleAction', async () => {
        const profileRef = doc(db, "profile", "main");
        const profileDoc = await getDoc(profileRef);
        if (profileDoc.exists()) {
          const profileData = { id: profileDoc.id, ...profileDoc.data() };
          commit("setProfile", [profileData]);
        } else {
          commit("setProfile", []);
        }
      });

      commit('setLoading', { key: 'profile', value: false });
    },

    async updateProfile({ dispatch }, profileData) {
      return dispatch('handleAction', async () => {
        const profileRef = doc(db, "profile", "main");
        await setDoc(profileRef, profileData, { merge: true });
      });
    },

    initAuth({ commit }) {
      const auth = getAuth();
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          commit('setUser', user);
          commit('setAuthInitialized', true);
          resolve(user);
        });
      });
    }
  },

  getters: {
    isLoading: (state) => (key) => state.loading[key],
    getError: (state) => state.error,
    isAuthenticated: (state) => !!state.user,
    isAuthInitialized: (state) => state.authInitialized
  }
});
