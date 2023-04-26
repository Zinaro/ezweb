<template>
    <div>
        <AddCategory v-if="user"></AddCategory>
        <Login v-else></Login>
    </div>
</template>
<script>
import Login from "@/components/Login.vue";
import AddCategory from "@/components/profile/AddCategory.vue";
import VueCookies from "vue-cookies"

export default {
  name: 'AddCategoryView',
  components: {
    Login,
    AddCategory
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