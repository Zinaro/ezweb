<template>
    <div class="category">
      <Category></Category>
    </div>
  </template>
  <script>
  import Category from "@/components/Category.vue";
  import VueCookies from "vue-cookies"
  
  export default {
    name: 'CategoryeView',
    components: {
      Category
    },
    data() {
      return {
        user: null,
      }
    },
    created() {
      this.user = VueCookies.get("user");
    },
  }
  </script>