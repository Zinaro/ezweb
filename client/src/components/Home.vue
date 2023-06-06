<template>
  <div class="container">
    <h1 class="title pt-3">Silav Zinar, {{ msg }}</h1>
    <Posts></Posts>
  </div>
</template>

<script>
import Posts from "./Posts.vue";

export default {
  name: "HomePage",
  props: {
    msg: {
      type: String,
      default: "Silav, MongoDB!",
    },
  },
  components: {
    Posts
  },

};
</script>

<style>

</style>
