<template>
  <div v-if="about.kkvk" class="kkvk" v-html="about.kkvk"></div>
  <div v-else class="kkvk"><h1>NIHA VALAYE</h1></div>
</template>
<script>
import axios from "axios";

export default {
  name: "KKVKPage",
  data() {
    return {
      about: {},
    };
  },
  created() {
    this.getAbouts();
    this.redirectToKKVK();
  },

  methods: {
    async getAbouts() {
      const response = await axios.get(
        `${process.env.VUE_APP_BASE_URL}/abouts`
      );
      this.about = response.data;
      document.title = "KKVK";
    },
    redirectToKKVK() {
      if (this.$route.path !== "/about/kkvk") {
        const newPath = "/about/kkvk";
        window.history.replaceState(null, "", newPath);
      }
    },
  },
};
</script>
<style>
.kkvk {
  margin: 30px;
  padding: 20px;
  box-shadow: var(--shadow);
  border-radius: 5px;
  border: var(--border);
  margin-bottom: 0;
}
@media (max-width: 767.98px) {
  .kkvk {
    margin: 0;
  }
}
</style>
