import { createStore } from "vuex";
import { db, isFirebaseConfigured } from "@/firebase";
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
import { mockStorage } from "./mockData";

const guardWritable = (getters, commit) => {
  if (getters && getters.isReadOnly) {
    const errorMsg = 'Action restricted: You are exploring in View-Only Demo Mode. Content cannot be created, modified, or deleted.';
    commit('setError', errorMsg);
    throw new Error(errorMsg);
  }
};

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
        console.warn('Action error (using fallback):', error.message);
        commit('setError', error.message);
        throw error;
      }
    },

    // Projects
    async fetchProjects({ commit, dispatch }) {
      commit('setLoading', { key: 'projects', value: true });
      let projects = [];
      if (isFirebaseConfigured && db) {
        try {
          await dispatch('handleAction', async () => {
            const querySnapshot = await getDocs(collection(db, "projects"));
            projects = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            // Graceful in-memory sorting:
            // 1. By explicit 'order' field ascending if present
            // 2. By 'createdAt' timestamp descending if present
            // 3. Otherwise preserve natural collection order
            projects.sort((a, b) => {
              if (a.order !== undefined && b.order !== undefined) {
                return a.order - b.order;
              }
              if (a.order !== undefined) return -1;
              if (b.order !== undefined) return 1;

              const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
              const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
              if (dateA && dateB) {
                return dateB - dateA;
              }
              if (dateA) return -1;
              if (dateB) return 1;

              return 0;
            });

            commit("setProjects", projects);
          });
          commit('setLoading', { key: 'projects', value: false });
          return projects;
        } catch {
          // fallback to mock
        }
      }
      projects = mockStorage.getProjects();
      commit("setProjects", projects);
      commit('setLoading', { key: 'projects', value: false });
      return projects;
    },

    async addProject({ commit, dispatch, getters }, project) {
      guardWritable(getters, commit);
      if (isFirebaseConfigured && db) {
        try {
          return await dispatch('handleAction', async () => {
            const projectData = {
              ...project,
              createdAt: serverTimestamp()
            };
            const docRef = await addDoc(collection(db, "projects"), projectData);
            return { id: docRef.id, ...projectData };
          });
        } catch {
          // fallback to mock
        }
      }
      const newProject = {
        id: `proj-${Date.now()}`,
        ...project,
        createdAt: new Date().toISOString()
      };
      const current = mockStorage.getProjects();
      const updated = [newProject, ...current];
      mockStorage.setProjects(updated);
      commit("setProjects", updated);
      return newProject;
    },

    async updateProject({ commit, dispatch, getters }, { id, project }) {
      guardWritable(getters, commit);
      if (isFirebaseConfigured && db) {
        try {
          return await dispatch('handleAction', async () => {
            const projectRef = doc(db, "projects", id);
            await updateDoc(projectRef, project);
          });
        } catch {
          // fallback to mock
        }
      }
      const current = mockStorage.getProjects();
      const updated = current.map(p => p.id === id ? { ...p, ...project } : p);
      mockStorage.setProjects(updated);
      commit("setProjects", updated);
    },

    async deleteProject({ commit, dispatch, getters }, id) {
      guardWritable(getters, commit);
      if (isFirebaseConfigured && db) {
        try {
          return await dispatch('handleAction', async () => {
            await deleteDoc(doc(db, "projects", id));
          });
        } catch {
          // fallback to mock
        }
      }
      const current = mockStorage.getProjects();
      const updated = current.filter(p => p.id !== id);
      mockStorage.setProjects(updated);
      commit("setProjects", updated);
    },

    // Blog Posts
    async fetchBlogPosts({ commit, dispatch }) {
      commit('setLoading', { key: 'blogPosts', value: true });
      let blogPosts = [];
      if (isFirebaseConfigured && db) {
        try {
          await dispatch('handleAction', async () => {
            const q = query(collection(db, "blogPosts"), orderBy("date", "desc"));
            const querySnapshot = await getDocs(q);
            blogPosts = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            commit("setBlogPosts", blogPosts);
          });
          commit('setLoading', { key: 'blogPosts', value: false });
          return blogPosts;
        } catch {
          // fallback to mock
        }
      }
      blogPosts = mockStorage.getBlogPosts();
      commit("setBlogPosts", blogPosts);
      commit('setLoading', { key: 'blogPosts', value: false });
      return blogPosts;
    },

    async addBlogPost({ commit, dispatch, getters }, blogPost) {
      guardWritable(getters, commit);
      if (isFirebaseConfigured && db) {
        try {
          return await dispatch('handleAction', async () => {
            const blogPostData = {
              ...blogPost,
              createdAt: serverTimestamp()
            };
            const docRef = await addDoc(collection(db, "blogPosts"), blogPostData);
            return { id: docRef.id, ...blogPostData };
          });
        } catch {
          // fallback to mock
        }
      }
      const newPost = {
        id: `post-${Date.now()}`,
        ...blogPost,
        createdAt: new Date().toISOString()
      };
      const current = mockStorage.getBlogPosts();
      const updated = [newPost, ...current];
      mockStorage.setBlogPosts(updated);
      commit("setBlogPosts", updated);
      return newPost;
    },

    async updateBlogPost({ commit, dispatch, getters }, { id, blogPost }) {
      guardWritable(getters, commit);
      if (isFirebaseConfigured && db) {
        try {
          return await dispatch('handleAction', async () => {
            const blogPostRef = doc(db, "blogPosts", id);
            await updateDoc(blogPostRef, blogPost);
          });
        } catch {
          // fallback to mock
        }
      }
      const current = mockStorage.getBlogPosts();
      const updated = current.map(p => p.id === id ? { ...p, ...blogPost } : p);
      mockStorage.setBlogPosts(updated);
      commit("setBlogPosts", updated);
    },

    async deleteBlogPost({ commit, dispatch, getters }, id) {
      guardWritable(getters, commit);
      if (isFirebaseConfigured && db) {
        try {
          return await dispatch('handleAction', async () => {
            await deleteDoc(doc(db, "blogPosts", id));
          });
        } catch {
          // fallback to mock
        }
      }
      const current = mockStorage.getBlogPosts();
      const updated = current.filter(p => p.id !== id);
      mockStorage.setBlogPosts(updated);
      commit("setBlogPosts", updated);
    },

    // Social Media
    async fetchSocialMedia({ commit, dispatch }) {
      commit('setLoading', { key: 'socialMedia', value: true });
      let socialMedia = [];
      if (isFirebaseConfigured && db) {
        try {
          await dispatch('handleAction', async () => {
            const q = query(collection(db, "socialMedia"), orderBy("order", "asc"));
            const querySnapshot = await getDocs(q);
            socialMedia = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            commit("setSocialMedia", socialMedia);
          });
          commit('setLoading', { key: 'socialMedia', value: false });
          return socialMedia;
        } catch {
          // fallback to mock
        }
      }
      socialMedia = mockStorage.getSocialMedia();
      commit("setSocialMedia", socialMedia);
      commit('setLoading', { key: 'socialMedia', value: false });
      return socialMedia;
    },

    async addSocialMedia({ commit, dispatch, getters }, socialMediaItem) {
      guardWritable(getters, commit);
      if (isFirebaseConfigured && db) {
        try {
          return await dispatch('handleAction', async () => {
            const docRef = await addDoc(collection(db, "socialMedia"), socialMediaItem);
            return { id: docRef.id, ...socialMediaItem };
          });
        } catch {
          // fallback to mock
        }
      }
      const newItem = {
        id: `soc-${Date.now()}`,
        ...socialMediaItem
      };
      const current = mockStorage.getSocialMedia();
      const updated = [...current, newItem];
      mockStorage.setSocialMedia(updated);
      commit("setSocialMedia", updated);
      return newItem;
    },

    async updateSocialMedia({ commit, dispatch, getters }, { id, socialMediaItem }) {
      guardWritable(getters, commit);
      if (isFirebaseConfigured && db) {
        try {
          return await dispatch('handleAction', async () => {
            const socialMediaRef = doc(db, "socialMedia", id);
            await updateDoc(socialMediaRef, socialMediaItem);
          });
        } catch {
          // fallback to mock
        }
      }
      const current = mockStorage.getSocialMedia();
      const updated = current.map(item => item.id === id ? { ...item, ...socialMediaItem } : item);
      mockStorage.setSocialMedia(updated);
      commit("setSocialMedia", updated);
    },

    async deleteSocialMedia({ commit, dispatch, getters }, id) {
      guardWritable(getters, commit);
      if (isFirebaseConfigured && db) {
        try {
          return await dispatch('handleAction', async () => {
            await deleteDoc(doc(db, "socialMedia", id));
          });
        } catch {
          // fallback to mock
        }
      }
      const current = mockStorage.getSocialMedia();
      const updated = current.filter(item => item.id !== id);
      mockStorage.setSocialMedia(updated);
      commit("setSocialMedia", updated);
    },

    // Hero Section
    async fetchHero({ commit, dispatch }) {
      commit('setLoading', { key: 'hero', value: true });
      if (isFirebaseConfigured && db) {
        try {
          await dispatch('handleAction', async () => {
            const heroRef = doc(db, "hero", "main");
            const heroDoc = await getDoc(heroRef);
            if (heroDoc.exists()) {
              const heroData = { id: heroDoc.id, ...heroDoc.data() };
              commit("setHero", [heroData]);
            } else {
              commit("setHero", [mockStorage.getHero()]);
            }
          });
          commit('setLoading', { key: 'hero', value: false });
          return;
        } catch {
          // fallback to mock
        }
      }
      const hero = mockStorage.getHero();
      commit("setHero", [hero]);
      commit('setLoading', { key: 'hero', value: false });
    },

    async updateHero({ commit, dispatch, getters }, heroData) {
      guardWritable(getters, commit);
      const { typedStrings, ...otherData } = heroData;
      const processedData = {
        ...otherData,
        typedStrings: Array.isArray(typedStrings) ? typedStrings : typedStrings.split(',').map(s => s.trim())
      };
      if (isFirebaseConfigured && db) {
        try {
          return await dispatch('handleAction', async () => {
            const heroRef = doc(db, "hero", "main");
            await setDoc(heroRef, processedData, { merge: true });
          });
        } catch {
          // fallback to mock
        }
      }
      mockStorage.setHero(processedData);
      commit("setHero", [processedData]);
    },

    // Profile
    async fetchProfile({ commit, dispatch }) {
      commit('setLoading', { key: 'profile', value: true });
      if (isFirebaseConfigured && db) {
        try {
          await dispatch('handleAction', async () => {
            const profileRef = doc(db, "profile", "main");
            const profileDoc = await getDoc(profileRef);
            if (profileDoc.exists()) {
              const profileData = { id: profileDoc.id, ...profileDoc.data() };
              commit("setProfile", [profileData]);
            } else {
              commit("setProfile", [mockStorage.getProfile()]);
            }
          });
          commit('setLoading', { key: 'profile', value: false });
          return;
        } catch {
          // fallback to mock
        }
      }
      const profile = mockStorage.getProfile();
      commit("setProfile", [profile]);
      commit('setLoading', { key: 'profile', value: false });
    },

    async updateProfile({ commit, dispatch, getters }, profileData) {
      guardWritable(getters, commit);
      if (isFirebaseConfigured && db) {
        try {
          return await dispatch('handleAction', async () => {
            const profileRef = doc(db, "profile", "main");
            await setDoc(profileRef, profileData, { merge: true });
          });
        } catch {
          // fallback to mock
        }
      }
      mockStorage.setProfile(profileData);
      commit("setProfile", [profileData]);
    },

    initAuth({ commit }) {
      if (!isFirebaseConfigured) {
        const saved = localStorage.getItem('portfolio_admin_user');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && (parsed.isReadOnly || parsed.uid === 'demo-admin-uid' || parsed.isDemo)) {
              parsed.isReadOnly = true;
            }
            commit('setUser', parsed);
          } catch {
            commit('setUser', null);
          }
        }
        commit('setAuthInitialized', true);
        return Promise.resolve();
      }
      try {
        const auth = getAuth();
        return new Promise((resolve) => {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              commit('setUser', user);
            } else {
              // Check if guest view-only session was stored
              const saved = localStorage.getItem('portfolio_admin_user');
              if (saved) {
                try {
                  const parsed = JSON.parse(saved);
                  if (parsed && (parsed.isReadOnly || parsed.uid === 'demo-admin-uid' || parsed.isDemo)) {
                    parsed.isReadOnly = true;
                    commit('setUser', parsed);
                  } else {
                    commit('setUser', null);
                  }
                } catch {
                  commit('setUser', null);
                }
              } else {
                commit('setUser', null);
              }
            }
            commit('setAuthInitialized', true);
            resolve(user);
          }, (err) => {
            console.warn('Auth state error:', err);
            commit('setUser', null);
            commit('setAuthInitialized', true);
            resolve(null);
          });
        });
      } catch (err) {
        console.warn('Firebase auth initialization warning:', err);
        commit('setUser', null);
        commit('setAuthInitialized', true);
        return Promise.resolve(null);
      }
    }
  },

  getters: {
    isLoading: (state) => (key) => state.loading[key],
    getError: (state) => state.error,
    isAuthenticated: (state) => !!state.user,
    isAuthInitialized: (state) => state.authInitialized,
    isReadOnly: (state) => {
      if (!state.user) return false;
      return Boolean(state.user.isReadOnly || state.user.isDemo || state.user.uid === 'demo-admin-uid');
    }
  }
});
