<template>
  <div
    v-if="
      (user && user.permission === 'root') ||
      user.permission === 'admin' ||
      user.permission === 'editor'
    "
    class="allpost"
  >
    <div v-if="dialog" class="dialog">
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title class="headline">Error</v-card-title>
          <v-card-text>{{ errorMessage }}</v-card-text>
          <v-card-actions class="custom-actions">
            <v-btn
              class="custom-button"
              color="primary"
              text
              @click="dialogChange()"
              >OK</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div>
      <h1>ALLPOST</h1>
      <ul>
        <li v-for="post in sortedItems" :key="post._id">
          <h1 v-show="!post.showModal" style="font-weight: bold; font-size: 18px;">{{ post.postTitle }}</h1>
          <div v-if="!post.showMore && post.postContent.length > 500">
              <div v-html="post.postContent.slice(0, 500)"></div>
              <span>...</span>              <a
                href="#"
                class="more-link"
                @click.prevent="post.showMore = true"
                >more</a
              >
            </div>
            <div v-else v-show="!post.showModal" v-html="post.postContent"></div>
          <p v-show="!post.showModal">{{ post.postDate }}</p>
          <p v-show="!post.showModal">{{ post.postAutorName }}</p>
          <div class="modalll" v-show="post.showModal">
            <EditPost
              :post="post"
              @save="savePost"
              @close="showModal = false"
            />
          </div>
          <button v-if="!post.showModal" @click="editPost(post)">Edit</button>
          <button v-if="post.showModal" @click="post.showModal = false">
            Cancel
          </button>
        </li>
      </ul>
      <button class="show-more-posts" @click="showMorePosts">Show More Posts</button>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import axios from "axios";
import EditPost from "../EditPost.vue";

export default {
  components: {
    EditPost,
  },
  name: "AllPostPage",
  data() {
    return {
      user: null,
      posts: [],
      dialog: false,
      showModal: false,
      showMore: false,
      selectedPost: null,
      editingPost: false,
      loadMoreCount: 5,
    };
  },

  created() {
    this.user = VueCookies.get("user");
    this.getPosts();
  },

  watch: {
    errorMessage(newValue) {
      if (newValue) {
        this.dialog = true;
      }
    },
  },
  computed: {
    sortedItems() {
      const sortedPosts = this.posts.slice().reverse();
      return sortedPosts.slice(0, this.loadMoreCount);
    },
  },
  methods: {
    async getPosts() {
      try {
        const response = await axios.get(
          "http://localhost:3000/posts"
        );
        this.posts = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    showMorePosts() {
    this.loadMoreCount += 5;
  },
    dialogChange() {
      this.dialog = !this.dialog;
      this.cancelEdit();
    },
    editPost(post) {
      this.posts.forEach((p) => (p.showModal = false));
      post.showModal = true;
      this.selectedPost = post;
    },
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
  position: sticky;
  margin-top: 10px;
  margin-bottom: 10px;
}

.show-more-posts {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
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
.allpost {
  flex-direction: row;
  justify-content: space-between;
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
