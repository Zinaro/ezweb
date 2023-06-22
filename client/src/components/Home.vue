<template>
  <div class="container">
    <Slider />
    <Posts></Posts>
    <Footer />
  </div>
  
</template>

<script>
import Posts from "@/components/Posts.vue";
import Footer from '@/components/Footer.vue';
import Slider from '@/components/post/Slider.vue'

export default {
  name: "HomePage",
  props: {
    msg: {
      type: String,
      default: "Silav, MongoDB!",
    },
  },
  components: {
    Posts,
    Footer,
    Slider
  },

};
</script>

<style>

</style>
