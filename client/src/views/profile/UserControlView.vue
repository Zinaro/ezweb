<template>
    <div>
        <UserControl v-if="user && user.permission === 'root'"></UserControl>
        <Login v-else></Login>
    </div>
</template>
<script>
import Login from "@/components/Login.vue";
import UserControl from "@/components/profile/UserControl.vue";
import VueCookies from "vue-cookies"

export default {
  name: 'UserControlView',
  components: {
    Login,
    UserControl
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