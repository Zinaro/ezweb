<template>
  <div
    v-if="
      (user && user.permission === 'root') ||
      user.permission === 'admin' ||
      user.permission === 'editor'
    "
    class="post-control"
  >
    <div class="tabs is-toggle is-medium mt-3">
      <ul>
        <li :class="{ 'is-active': activeTab === 'unapproved' }">
          <a 
            :class="{ active: activeTab === 'unapproved' }"
            @click="activeTab = 'unapproved'"
            ><i class="far fa-clock"></i>  Unapproved</a
          >
        </li>
        <li :class="{ 'is-active': activeTab === 'approved' }">
          <a
            :class="{ active: activeTab === 'approved' }"
            @click="activeTab = 'approved'"
            ><i class="fas fa-check-circle"></i>  Approved</a
          >
        </li>
        <li :class="{ 'is-active': activeTab === 'allpost' }">
          <a
            :class="{ active: activeTab === 'allpost' }"
            @click="activeTab = 'allpost'"
            ><i class="fas fa-list"></i>  All Posts</a
          >
        </li>
      </ul>
      
    </div>
    <div class="bottom-active">
        <component :is="activeTabComponent"></component>
      </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import Unapproved from "@/components/profile/post/Unapproved.vue";
import Approved from "@/components/profile/post/Approved.vue";
import AllPost from "@/components/profile/post/AllPost.vue";

export default {
  components: {
    Unapproved,
    Approved,
    AllPost,
  },
  name: "PostControlPage",
  data() {
    return {
      user: null,
      posts: [],
      dialog: false,
      showModal: false,
      selectedPost: null,
      editingPost: false,
      showLoadMoreButton: false,
      loadMoreCount: 100,
      activeTab: "unapproved",
    };
  },
  computed: {
    activeTabComponent() {
      switch (this.activeTab) {
        case "unapproved":
          return "Unapproved";
        case "approved":
          return "Approved";
        case "allpost":
          return "AllPost";
        default:
          return "unapproved";
      }
    },
  },

  created() {
    this.user = VueCookies.get("user");
    document.title = 'Post Control';
  },
};
</script>
<style>
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
}
.form-section {
  position: fixed;
  margin-top: 25px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}
.form-group {
  margin-bottom: 10px;
}





.post-control {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.post-control .tabs ul {
  display: flex;
  justify-content: center;
  list-style-type: none;
  padding: 0;
}

.post-control .tabs ul li a {
  text-decoration: none;
  color: var(--colortext);
}
.post-control .tabs ul li a:hover {
  color: #243447;
}
.post-control .tabs ul li a i{
  margin-right: 10px;
  padding-bottom: 5px;
}







.form-postcontent {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-postcontent .label {
  margin-bottom: 5px;
}

.form-postcontent .ql-editor {
  flex: 1;
  border-radius: 5px;
  padding: 10px;
  margin-top: 5px;
}

.form-group .input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
}

.form-group .label {
  display: block;
  margin-bottom: 5px;
}

.button {
  margin-right: 10px;
}
</style>
