<template>
    <div>
        <Following v-if="user"></Following>
        <Login v-else></Login>
    </div>
</template>
<script>
import Login from "@/components/Login.vue";
import Following from "@/components/profile/Following.vue";
import VueCookies from "vue-cookies"

export default {
  name: 'FollowingView',
  components: {
    Login,
    Following
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