<template>
    <div>
        <Followers v-if="user"></Followers>
        <Login v-else></Login>
    </div>
</template>
<script>
import Login from "@/components/Login.vue";
import Followers from "@/components/profile/Followers.vue";
import VueCookies from "vue-cookies"

export default {
  name: 'FollowersView',
  components: {
    Login,
    Followers
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