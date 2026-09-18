<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Hero Section</h1>
        <p class="text-sm text-slate-500 mt-0.5">Customize your main portfolio headline, call-to-actions, and background banner.</p>
      </div>

      <div class="flex items-center gap-2">
        <button 
          id="hero-save-btn"
          type="button"
          class="btn btn-primary btn-sm h-10 px-5 gap-2 font-semibold shadow-sm"
          :disabled="isSaving"
          @click="handleHeroUpdate"
        >
          <span v-if="isSaving" class="loading loading-spinner loading-xs"></span>
          <i v-else class="fas fa-save text-xs"></i>
          <span>Save Changes</span>
        </button>
      </div>
    </div>

    <!-- Alert status -->
    <div v-if="saveSuccess" class="alert alert-success bg-emerald-50 text-emerald-800 border-emerald-200 text-xs py-3">
      <i class="fas fa-check-circle text-emerald-600"></i>
      <span>Hero section updated successfully!</span>
    </div>

    <!-- 2 Column Responsive Layout (Form on Left, Live Preview on Right) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Form Column -->
      <div class="lg:col-span-7 space-y-6">
        <!-- Group 1: Headlines -->
        <div class="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div class="flex items-center gap-2 pb-3 border-b border-slate-100">
            <i class="fas fa-heading text-blue-600 text-sm"></i>
            <h2 class="text-sm font-bold text-slate-800">Main Headlines</h2>
          </div>

          <div class="form-control">
            <label class="label py-1">
              <span class="label-text font-semibold text-xs text-slate-700">Hero Title *</span>
            </label>
            <input
              id="hero-title-input"
              v-model="heroData.title"
              type="text"
              placeholder="e.g. Crafting high-performance digital products"
              class="input input-bordered w-full h-10 text-sm bg-white focus:border-blue-500"
              required
            />
          </div>

          <div class="form-control">
            <label class="label py-1">
              <span class="label-text font-semibold text-xs text-slate-700">Subtitle / Bio Lead *</span>
            </label>
            <textarea
              id="hero-subtitle-input"
              v-model="heroData.subtitle"
              placeholder="A one or two sentence introduction describing your expertise and passions..."
              rows="3"
              class="textarea textarea-bordered w-full text-sm bg-white focus:border-blue-500 leading-relaxed"
              required
            ></textarea>
          </div>

          <div class="form-control">
            <label class="label py-1">
              <span class="label-text font-semibold text-xs text-slate-700">Rotating Typed Phrases (comma-separated)</span>
            </label>
            <input
              id="hero-typed-strings-input"
              v-model="heroData.typedStrings"
              type="text"
              placeholder="Full-Stack Developer, UI/UX Designer, Open Source Contributor"
              class="input input-bordered w-full h-10 text-sm bg-white focus:border-blue-500"
            />
            <div v-if="parsedStrings.length" class="flex flex-wrap gap-1.5 mt-2">
              <span 
                v-for="(str, idx) in parsedStrings" 
                :key="idx" 
                class="badge badge-sm bg-blue-50 text-blue-700 border-blue-200 font-medium"
              >
                {{ str }}
              </span>
            </div>
          </div>
        </div>

        <!-- Group 2: Call to Actions -->
        <div class="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div class="flex items-center gap-2 pb-3 border-b border-slate-100">
            <i class="fas fa-mouse-pointer text-blue-600 text-sm"></i>
            <h2 class="text-sm font-bold text-slate-800">Call-to-Action Buttons</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text font-semibold text-xs text-slate-700">Primary Button Label</span>
              </label>
              <input
                id="hero-explore-text-input"
                v-model="heroData.exploreText"
                type="text"
                placeholder="e.g. Explore Projects"
                class="input input-bordered w-full h-10 text-sm bg-white focus:border-blue-500"
              />
            </div>

            <div class="form-control">
              <label class="label py-1">
                <span class="label-text font-semibold text-xs text-slate-700">Primary Button Link</span>
              </label>
              <input
                id="hero-explore-link-input"
                v-model="heroData.exploreLink"
                type="text"
                placeholder="e.g. #projects or https://..."
                class="input input-bordered w-full h-10 text-sm bg-white focus:border-blue-500"
              />
            </div>

            <div class="form-control">
              <label class="label py-1">
                <span class="label-text font-semibold text-xs text-slate-700">Secondary Button Label</span>
              </label>
              <input
                id="hero-contact-text-input"
                v-model="heroData.contactText"
                type="text"
                placeholder="e.g. Get in Touch"
                class="input input-bordered w-full h-10 text-sm bg-white focus:border-blue-500"
              />
            </div>

            <div class="form-control">
              <label class="label py-1">
                <span class="label-text font-semibold text-xs text-slate-700">Secondary Button Link</span>
              </label>
              <input
                id="hero-contact-link-input"
                v-model="heroData.contactLink"
                type="text"
                placeholder="e.g. mailto:... or #contact"
                class="input input-bordered w-full h-10 text-sm bg-white focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Group 3: Media -->
        <div class="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div class="flex items-center gap-2 pb-3 border-b border-slate-100">
            <i class="fas fa-image text-blue-600 text-sm"></i>
            <h2 class="text-sm font-bold text-slate-800">Media & Visuals</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text font-semibold text-xs text-slate-700">Hero Image URL</span>
              </label>
              <input
                id="hero-image-input"
                v-model="heroData.image"
                type="url"
                placeholder="https://images.unsplash.com/..."
                class="input input-bordered w-full h-10 text-sm bg-white focus:border-blue-500"
              />
            </div>

            <div class="form-control">
              <label class="label py-1">
                <span class="label-text font-semibold text-xs text-slate-700">Image Alt Text</span>
              </label>
              <input
                id="hero-imagealt-input"
                v-model="heroData.imageAlt"
                type="text"
                placeholder="Hero showcase visual"
                class="input input-bordered w-full h-10 text-sm bg-white focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Live Preview Column -->
      <div class="lg:col-span-5 space-y-4">
        <div class="sticky top-20">
          <div class="flex items-center justify-between pb-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Live Hero Preview</span>
            <span class="badge badge-xs bg-blue-100 text-blue-700 border-none">Realtime</span>
          </div>

          <!-- Preview Container mimicking public portfolio hero -->
          <div class="bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 text-white p-6 sm:p-7 relative flex flex-col justify-between min-h-[360px]">
            <!-- Decorative background glow -->
            <div class="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"></div>

            <div class="relative z-10 space-y-4">
              <!-- Pill badge -->
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-blue-400 font-medium">
                <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span>Available for new projects</span>
              </div>

              <!-- Title -->
              <h2 class="text-xl sm:text-2xl font-black text-white leading-tight">
                {{ heroData.title || 'Your Hero Title Will Appear Here' }}
              </h2>

              <!-- Subtitle -->
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {{ heroData.subtitle || 'Your subtitle and introductory message explaining your background will appear here in high contrast.' }}
              </p>

              <!-- Rotating tags preview -->
              <div v-if="parsedStrings.length" class="flex items-center gap-1.5 pt-1">
                <span class="text-xs text-slate-400 font-medium">I build:</span>
                <span class="text-xs text-blue-400 font-bold border-b border-blue-400">
                  {{ parsedStrings[0] }}
                </span>
              </div>

              <!-- CTA buttons -->
              <div class="flex flex-wrap gap-2.5 pt-2">
                <a 
                  v-if="heroData.exploreText"
                  :href="heroData.exploreLink || '#'"
                  class="btn btn-primary btn-sm h-9 px-4 text-xs font-semibold"
                >
                  {{ heroData.exploreText }}
                </a>
                <a 
                  v-if="heroData.contactText"
                  :href="heroData.contactLink || '#'"
                  class="btn btn-outline btn-sm h-9 px-4 text-xs font-semibold text-white border-slate-700 hover:bg-slate-800"
                >
                  {{ heroData.contactText }}
                </a>
              </div>
            </div>

            <!-- Preview Image if set -->
            <div v-if="heroData.image" class="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-3">
              <img 
                :src="heroData.image" 
                :alt="heroData.imageAlt || 'Hero visual'"
                class="w-12 h-12 rounded-lg object-cover border border-slate-700" 
              />
              <div class="overflow-hidden">
                <p class="text-[11px] font-medium text-slate-400">Hero Media Asset</p>
                <p class="text-xs text-slate-200 truncate">{{ heroData.imageAlt || 'Visual banner' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "HeroAdmin",
  data() {
    return {
      isSaving: false,
      saveSuccess: false,
      heroData: {
        image: "",
        imageAlt: "",
        subtitle: "",
        title: "",
        exploreText: "",
        exploreLink: "",
        contactText: "",
        contactLink: "",
        typedStrings: "",
      },
    };
  },
  computed: {
    ...mapState(["hero"]),
    parsedStrings() {
      if (!this.heroData.typedStrings) return [];
      return this.heroData.typedStrings.split(',').map(s => s.trim()).filter(Boolean);
    }
  },
  methods: {
    ...mapActions(["fetchHero", "updateHero"]),
    async handleHeroUpdate() {
      try {
        this.isSaving = true;
        this.saveSuccess = false;
        
        // Format typedStrings back to array or string as needed
        const payload = {
          ...this.heroData,
          typedStrings: this.parsedStrings
        };
        
        await this.updateHero(payload);
        await this.fetchHero();
        this.saveSuccess = true;
        setTimeout(() => {
          this.saveSuccess = false;
        }, 3000);
      } catch (error) {
        console.error("Error updating hero:", error);
      } finally {
        this.isSaving = false;
      }
    },
  },
  async mounted() {
    await this.fetchHero();
    if (this.hero && this.hero.length > 0) {
      const heroItem = this.hero[0];
      this.heroData = {
        image: heroItem.image || "",
        imageAlt: heroItem.imageAlt || "",
        subtitle: heroItem.subtitle || "",
        title: heroItem.title || "",
        exploreText: heroItem.exploreText || "",
        exploreLink: heroItem.exploreLink || "",
        contactText: heroItem.contactText || "",
        contactLink: heroItem.contactLink || "",
        typedStrings: Array.isArray(heroItem.typedStrings) 
          ? heroItem.typedStrings.join(', ') 
          : (heroItem.typedStrings || '')
      };
    }
  },
};
</script>
