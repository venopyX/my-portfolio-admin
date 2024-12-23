<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Profile Admin</h1>
    <div class="mt-4">
      <h2 class="text-xl font-bold">Update Profile</h2>
      <form @submit.prevent="updateProfile">
        <input
          v-model="profileData.image"
          placeholder="Image URL"
          class="input input-bordered w-full max-w-xs"
        />
        <input
          v-model="profileData.name"
          placeholder="Name"
          class="input input-bordered w-full max-w-xs"
        />
        <textarea
          v-model="profileData.description"
          placeholder="Description"
          class="textarea textarea-bordered w-full max-w-xs"
        ></textarea>
        <button type="submit" class="btn btn-primary">Update</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "ProfileAdmin",
  data() {
    return {
      profileData: {
        image: "",
        name: "",
        description: "",
      },
    };
  },
  computed: {
    ...mapState(["profile"]),
  },
  methods: {
    ...mapActions(["fetchProfile", "updateProfile"]),
    async updateProfile() {
      await this.updateProfile(this.profileData);
      await this.fetchProfile();
    },
  },
  async mounted() {
    await this.fetchProfile();
    if (this.profile.length > 0) {
      this.profileData = this.profile[0];
    }
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
