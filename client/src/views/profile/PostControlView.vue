<template>
    <div>
        <PostControl v-if="user && user.permission === 'root' || user.permission === 'admin' || user.permission === 'editor'"></PostControl>
        <Login v-else></Login>
    </div>
</template>
<script>
import Login from "@/components/Login.vue";
import PostControl from "@/components/profile/PostControl.vue";
import VueCookies from "vue-cookies"

export default {
  name: 'PostControlView',
  components: {
    Login,
    PostControl
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