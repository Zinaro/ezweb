<template>
  <div class="about-profile">
    <h1>About Edit Page</h1>
    <div class="about-content">
      <div class="about-section">
        <label>Address:</label>
        <input
          v-if="awaitPls"
          type="text"
          v-model="about.address"
          class="input"
        />
      </div>
      <div class="about-section">
        <label>Phone:</label>
        <input
          v-if="awaitPls"
          type="text"
          v-model="about.phone"
          class="input"
        />
      </div>
      <div class="about-section">
        <label>Email:</label>
        <input
          v-if="awaitPls"
          type="text"
          v-model="about.email"
          class="input"
        />
      </div>
      <div class="about-section">
        <label>Android App Url:</label>
        <input
          v-if="awaitPls"
          type="text"
          v-model="about.androidApp"
          class="input"
        />
      </div>
      <div class="about-section">
        <label>IOS App Url:</label>
        <input
          v-if="awaitPls"
          type="text"
          v-model="about.iosApp"
          class="input"
        />
      </div>
      <div class="about-section">
        <label>Company Map Url:</label>
        <input
          v-if="awaitPls"
          type="text"
          v-model="about.siteMapUrl"
          class="input"
        />
      </div>
      <div class="about-section">
        <label for="about">KKVK:</label>
        <Tiny
          v-if="awaitPls"
          ref="editor"
          v-model="kkvk"
          :value="about.kkvk"
          :config="config"
        ></Tiny>
      </div>
      <div class="about-section">
        <label for="about">Privacy Policy:</label>
        <Tiny
          v-if="awaitPls"
          ref="editorP"
          v-model="privacyPolicy"
          :value="about.privacyPolicy"
          :config="config"
        ></Tiny>
      </div>
      <button
        type="submit"
        class="button is-primary tevli-bike about-section mb-5"
        @click.prevent="updateAbout"
      >
        Update
      </button>
    </div>
  </div>
</template>
<script>
import Tiny from "@/components/profile/post/Tiny.vue";
import axios from "axios";

export default {
  name: "AboutProfilePage",
  data() {
    return {
      kkvk: "",
      privacyPolicy: "",
      about: {},
      awaitPls: false,
      aboutsID: null,
      config: {
        styles: [
          {
            name: "Custom Color",
            element: "span",
            styles: {
              color: "#FF0000",
            },
          },
        ],
      },
    };
  },
  components: {
    Tiny,
  },
  created() {
    this.getAbouts();
  },
  methods: {
    async getAbouts() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_BASE_URL}/abouts`
        );
        this.about = await response.data;
        this.aboutsID = this.about._id;
        if (this.about) {
          this.awaitPls = true;
        }
      } catch (error) {
        console.error("An error occurred while retrieving abouts:", error);
      }
    },
    async updateAbout() {
      const item = {
        kkvk: this.$refs.editor.editorData,
        privacyPolicy: this.$refs.editorP.editorData,
        siteMapUrl: this.about.siteMapUrl,
        androidApp: this.about.androidApp,
        iosApp: this.about.iosApp,
        address: this.about.address,
        phone: this.about.phone,
        email: this.about.email,
      };
      try {
        await axios.put(
          `${process.env.VUE_APP_BASE_URL}/abouts/${this.aboutsID}`,
          item
        );
        this.getAbouts();
        location.reload();
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style>
.about-profile {
  display: flex;
  flex-direction: column;
  margin: 20px;
}
.about-content {
  width: 100%;
  float: left;
  padding-right: 5px;
}
.tiny-editor {
  margin-top: 10px;
}
.about-section {
  margin-top: 40px;
  padding-top: 10px;
  box-shadow: var(--shadow);
  border-radius: 5px;
}
</style>
