<template>
  <div class="category container">
    <h1>{{ categoryName }}</h1>
    <div class="category-view">
      <div v-for="item in sortedUserItems" :key="item._id" class="category-list-item">
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
  name: "CategoryPage",
  components: {
    PostCard,
  },
  data() {
    return {
      user: null,
      posts: [],
      categoryName: 'Category',
      numOfLoadedItems: 9,
    };
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
    await this.refreshData();
  },
  mounted() {
    window.addEventListener("scroll", this.scrollListener);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.scrollListener);
  },

  methods: {
    async refreshData() {
      try {
        const categoryId = this.$route.params.id.slice(-24);
        const response = await axios.get(
          `http://localhost:3000/category/${categoryId}`
        );
        const datame = response.data.posts;
        for (const post of datame) {
          const prof = await this.getAutor(post.postAutorId);
          post.profileImage = prof;
          const name = await this.getAutorName(post.postAutorId);
          post.postAutorName = name;
        }
        this.posts = datame;
        this.categoryName = response.data.category.name;
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
    loadMoreItems() {
      this.numOfLoadedItems += this.itemsPerPage;
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
.category {
    padding-top: 8px;
    height: 100%;
    min-height: 100vh;
}
.category-view {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: 0 auto;
  margin-top: 10px;
}
.category-list-item {
  width: calc(33.33% - 20px);
  margin: 10px;
}
</style>
