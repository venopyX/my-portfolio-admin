<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Hero Admin</h1>
    <div class="mt-4">
      <h2 class="text-xl font-bold">Update Hero</h2>
      <form @submit.prevent="updateHero">
        <input
          v-model="heroData.image"
          placeholder="Image URL"
          class="input input-bordered w-full max-w-xs"
        />
        <input
          v-model="heroData.imageAlt"
          placeholder="Image Alt"
          class="input input-bordered w-full max-w-xs"
        />
        <input
          v-model="heroData.subtitle"
          placeholder="Subtitle"
          class="input input-bordered w-full max-w-xs"
        />
        <input
          v-model="heroData.title"
          placeholder="Title"
          class="input input-bordered w-full max-w-xs"
        />
        <input
          v-model="heroData.exploreText"
          placeholder="Explore Text"
          class="input input-bordered w-full max-w-xs"
        />
        <input
          v-model="heroData.exploreLink"
          placeholder="Explore Link"
          class="input input-bordered w-full max-w-xs"
        />
        <input
          v-model="heroData.contactText"
          placeholder="Contact Text"
          class="input input-bordered w-full max-w-xs"
        />
        <input
          v-model="heroData.contactLink"
          placeholder="Contact Link"
          class="input input-bordered w-full max-w-xs"
        />
        <input
          v-model="heroData.typedStrings"
          placeholder="Typed Strings"
          class="input input-bordered w-full max-w-xs"
        />
        <button type="submit" class="btn btn-primary">Update</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "HeroAdmin",
  data() {
    return {
      heroData: {
        image: "",
        imageAlt: "",
        subtitle: "",
        title: "",
        exploreText: "",
        exploreLink: "",
        contactText: "",
        contactLink: "",
        typedStrings: [],
      },
    };
  },
  computed: {
    ...mapState(["hero"]),
  },
  methods: {
    ...mapActions(["fetchHero", "updateHero"]),
    async updateHero() {
      await this.updateHero(this.heroData);
      await this.fetchHero();
    },
  },
  async mounted() {
    await this.fetchHero();
    if (this.hero.length > 0) {
      this.heroData = this.hero[0];
    }
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
