<template>
    <div>
        <AddPost v-if="user"></AddPost>
        <Login v-else></Login>
    </div>
</template>
<script>
import Login from "@/components/Login.vue";
import AddPost from "@/components/profile/AddPost.vue";
import VueCookies from "vue-cookies"

export default {
  name: 'AddPostView',
  components: {
    Login,
    AddPost
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