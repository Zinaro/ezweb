<template>
  <div
    v-if="
      (user && user.permission === 'root') ||
      user.permission === 'admin' ||
      user.permission === 'editor'
    "
    class="post-control"
  >
    <div>
      <h1>Unapproved Submissions</h1>
      <div class="row">
        <div class="col">
          <button :class="{ active: activeTab === 'unapproved' }"
          @click="activeTab = 'unapproved'">Unapproved</button>
        </div>
        <div class="col">
          <button :class="{ active: activeTab === 'approved' }"
          @click="activeTab = 'approved'">Approved</button>
        </div>
        <div class="col">
          <button :class="{ active: activeTab === 'allpost' }"
          @click="activeTab = 'allpost'">All Posts</button>
        </div>
      </div>
      <div class="bottom-active">
        <component :is="activeTabComponent"></component>
      </div>
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
  },
};
</script>
<style>
.row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: #b6d4b4;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: absolute;
  margin-top: 10px;
  margin-bottom: 10px;
}


.col {
  width: calc(33.33% - 20px);
  margin-right: 10px;
  margin-left: 10px;
}

.col:not(:last-child) {
  margin-right: 20px;
}

.col > button {
  width: 100%;
}


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
.post-control {
  flex-direction: row;
  justify-content: space-between;
}
.bottom-active {
  margin-top: 100px;
  height: 100vh;
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

.form-postcontent {
  display: flex;
  flex-direction: column;
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
