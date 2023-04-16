<template>
    <div>
        <Profile v-if="user"></Profile>
        <Login v-else></Login>
    </div>
</template>
<script>
import Profile from "@/components/profile/Profile.vue";
import Login from "@/components/Login.vue";
import VueCookies from "vue-cookies"

export default {
  name: 'ProfileView',
  components: {
    Profile,
    Login
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