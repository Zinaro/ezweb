<template>
  <div class="about">
    <div class="about-page-content">
      <div class="about-page-section">
        <div class="about-part tabs is-toggle is-medium mt-3 pb-4">
          <ul>
            <li :class="{ 'is-active': activeTab === 'kkvk' }">
              <a
                :class="{ active: activeTab === 'kkvk' }"
                @click="activeTab = 'kkvk'"
                ><i class="fas fa-file-contract"></i>  KKVK</a
              >
            </li>
            <li :class="{ 'is-active': activeTab === 'privacypolicy' }">
              <a
                :class="{ active: activeTab === 'privacypolicy' }"
                @click="activeTab = 'privacypolicy'"
                ><i class="fas fa-shield-alt"></i>  Privacy Policy</a
              >
            </li>
          </ul>
        </div>
        <div class="about-part">
          <div class="bottom-active">
            <component :is="activeTabComponent"></component>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from "@/components/Footer.vue";
import KKVK from "@/components/about/kkvk.vue";
import PrivacyPolicy from "@/components/about/privacypolicy.vue";
export default {
  name: "AboutPage",
  data() {
    return {
      activeTab: "kkvk",
    };
  },
  components: {
    Footer,
    KKVK,
    PrivacyPolicy,
  },
  computed: {
    activeTabComponent() {
      switch (this.activeTab) {
        case "kkvk":
          return "KKVK";
        case "privacypolicy":
          return "PrivacyPolicy";
        default:
          return "kkvk";
      }
    },
  },
};
</script>

<style>
.about-page-content {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.about-page-section {
  flex-basis: 80%;
  flex-direction: column;
  align-items: center;
  margin: auto;
}
.about-part a {
  text-decoration: none;
  color: var(--colortext);
}
.about-part a:hover {
  color: #243447;
}
.about-part a i{
  margin-right: 8px;
  margin-bottom: 5px;
}
</style>
