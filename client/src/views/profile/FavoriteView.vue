<template>
    <div>
        <Favorite v-if="user"></Favorite>
        <Login v-else></Login>
    </div>
</template>
<script>
import Login from "@/components/Login.vue";
import Favorite from "@/components/profile/Favorite.vue";
import VueCookies from "vue-cookies"

export default {
  name: 'FavoriteView',
  components: {
    Login,
    Favorite
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