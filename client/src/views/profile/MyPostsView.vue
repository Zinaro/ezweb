<template>
    <div>
        <MyPosts v-if="user"></MyPosts>
        <Login v-else></Login>
    </div>
</template>
<script>
import Login from "@/components/Login.vue";
import MyPosts from "@/components/profile/MyPosts.vue";
import VueCookies from "vue-cookies"

export default {
  name: 'MyPostsView',
  components: {
    Login,
    MyPosts
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