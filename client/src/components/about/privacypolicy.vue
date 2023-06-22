<template>
    <div v-if="about.kkvk" class="privacypolicy" v-html="about.privacyPolicy"></div>
    <div v-else class="privacypolicy"><h1>NIHA VALAYE</h1></div>
</template>
<script>
import axios from 'axios'

export default {
    name: 'PrivacyPolicyPage',
    data() {
        return {
            about: {}
        };
    },
    created() {
        this.getAbouts();
        this.redirectToPrivacyPolicy();
    },
    methods: {
      async getAbouts() {
        const response = await axios.get(`${process.env.VUE_APP_BASE_URL}/abouts`);
        this.about = response.data;
        document.title = 'Privacy Policy'
      },
      redirectToPrivacyPolicy() {
      if (this.$route.path !== "/about/privacypolicy") {
        const newPath = "/about/privacypolicy";
        window.history.replaceState(null, "", newPath);
      }
    },
    },
}
</script>
<style>
.privacypolicy {
    margin: 30px;
    padding: 20px;
    box-shadow: var(--shadow);
    border-radius: 5px;
    border: var(--border);
    margin-bottom: 0;
}
@media (max-width: 767.98px) {
    .privacypolicy {
        margin: 0;
    }
}
</style>