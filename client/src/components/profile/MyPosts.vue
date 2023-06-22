<template>
  <div class="myposts">
    <h1>Şandiyên min</h1>
    <div class="myposts-view">
      <div v-for="item in sortedUserItems" :key="item._id" class="myposts-list-item">
        <PostCard :item="item"></PostCard>
      </div>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import axios from "axios";
import PostCard from "@/components/post/PostCard.vue"

export default {
  name: "MyPostsPage",
  data() {
    return {
      user: null,
      posts: [],
      numOfLoadedItems: 9,
    };
  },
  components: {
    PostCard
  },
  async created() {
    this.user = VueCookies.get("user");
    document.title = 'Şandiyên min';
    await this.getItems();
  },
  computed: {
    sortedItems() {
      return this.posts
        .slice(Math.max(this.posts.length - this.numOfLoadedItems, 0))
        .reverse();
    },
    sortedUserItems() {
      if (this.user) {
        return this.sortedItems
          .filter((item) => item.postAuthorId === this.user._id)
          .concat(
            this.sortedItems.filter(
              (item) => item.postAuthorId !== this.user._id
            )
          );
      } else {
        return this.sortedItems;
      }
    },
    isItemsFullyLoaded() {
      return this.sortedItems.length === this.posts.length;
    },
  },
  methods: {
    async getItems() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_BASE_URL}/posts/${this.user._id}/user`);
        const datame = response.data;
        for (const post of datame) {
          const prof = await this.getAuthor(post.postAuthorId);
          post.profileImage = prof;
          const name = await this.getAuthorName(post.postAuthorId);
          post.postAuthorName = name;
        }
        this.posts = datame;
      } catch (error) {
        console.error(error);
        alert("hi zinar, you have an error");
      }
    },
    async getAuthor(userid) {
      const resuser = await axios.get(`${process.env.VUE_APP_BASE_URL}/users/${userid}`);
      const prof = resuser.data.profileImage;
      return prof;
    },
    async getAuthorName(userid) {
      const resuser = await axios.get(`${process.env.VUE_APP_BASE_URL}/users/${userid}`);
      const prof = resuser.data.name;
      return prof;
    },
    scrollListener() {
      const scrollY = window.scrollY;
      const innerHeight = window.innerHeight;
      const offset = document.documentElement.offsetHeight;
      if (scrollY + innerHeight >= offset) {
        this.numOfLoadedItems += 3;
      }
    },
  },
  mounted() {
    window.addEventListener("scroll", this.scrollListener);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.scrollListener);
  },
};
</script>
<style>
.myposts {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.myposts h1 {
  font-size: 24px;
  margin-bottom: 20px;
}
.myposts-view {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: 0 auto;
  margin-top: 10px;
}
.myposts-list-item {
  width: calc(50% - 20px);
  margin: 10px;
}
@media (max-width: 767.98px) {
 .myposts-list-item {
    width: 100%;
    margin: 10px 0;
  }
}
@media (max-width: 991.98px) {
 .myposts-list-item {
    width: 100%;
    margin: 10px 0;
  }
}
</style>
