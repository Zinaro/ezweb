<template>
  <div class="container pt-3">
    <Editors></Editors>
    <div class="border-top mt-5 pb-2"></div>
    <Niviskars></Niviskars>
    <div class="border-top mt-5 pb-2"></div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import Editors from "@/components/Editors.vue"
import Niviskars from "@/components/Niviskars.vue"

export default {
  name: "UsersPage",
  components: {
    Editors,
    Niviskars
  },
  data() {
    return {
      user: VueCookies.get("user"),
    };
  },
};
</script>

<style>
.profile-image {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  overflow: hidden;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
