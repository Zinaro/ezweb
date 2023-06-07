<template>
  <div class="favorite">
    <h1>Rûpela Hezkirnên min</h1>
    <div class="favorite-list">
      <div
        v-for="item in sortedUserItems"
        :key="item._id"
        class="favorite-list-item"
      >
        <PostCard :item="item"></PostCard>
      </div>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import axios from "axios";
import PostCard from "@/components/post/PostCard.vue";

export default {
  name: "FavoritePage",
  data() {
    return {
      user: null,
      posts: [],
      numOfLoadedItems: 9,
    };
  },
  components: {
    PostCard,
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
          .filter((item) => item.postAutorId === this.user._id)
          .concat(
            this.sortedItems.filter(
              (item) => item.postAutorId !== this.user._id
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
  async created() {
    this.user = VueCookies.get("user");
    document.title = 'Hezkirinên min';
    await this.getItems();
  },
  mounted() {
    window.addEventListener("scroll", this.scrollListener);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.scrollListener);
  },
  methods: {
    async getItems() {
      const userId = this.user._id;
      try {
        const response = await axios.get(
          `http://localhost:3000/users/${userId}/posts/favorites`
        );
        const datame = response.data;
        for (const post of datame) {
          const prof = await this.getAutor(post.postAutorId._id);
          post.profileImage = prof;
          const name = await this.getAutorName(post.postAutorId._id);
          post.postAutorName = name;
          post.postAutorId = post.postAutorId._id;
        }
        this.posts = datame;
      } catch (err) {
        console.error(err);
      }
    },
    async getAutor(userid) {
      const resuser = await axios.get(`http://localhost:3000/users/${userid}`);
      const prof = resuser.data.profileImage;
      return prof;
    },
    async getAutorName(userid) {
      const resuser = await axios.get(`http://localhost:3000/users/${userid}`);
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
};
</script>
<style>
.favorite {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.favorite-list {
  display: flex;
  flex-wrap: wrap;
}
.favorite h1 {
  font-size: 24px;
  margin-bottom: 20px;
}
.favorite-list-item {
  width: calc(50% - 20px);
  margin: 10px;
}
@media (max-width: 767.98px) {
 .favorite-list-item {
    width: 100%;
    margin: 10px 0;
  }
}
@media (max-width: 991.98px) {
 .favorite-list-item {
    width: 100%;
    margin: 10px 0;
  }
}
</style>
