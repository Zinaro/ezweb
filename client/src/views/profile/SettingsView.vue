<template>
    <div>
        <Settings v-if="user"></Settings>
        <Login v-else></Login>
    </div>
</template>
<script>
import Login from "@/components/Login.vue";
import Settings from "@/components/profile/Settings.vue";
import VueCookies from "vue-cookies"

export default {
  name: 'SettingsView',
  components: {
    Login,
    Settings
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