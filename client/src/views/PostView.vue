<template>
  <div class="post">
    <Post></Post>
  </div>
</template>
<script>
import Post from "@/components/Post.vue";
import VueCookies from "vue-cookies"

export default {
  name: 'FavoriteView',
  components: {
    Post
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