<template>
  <div class="category container">
    <h1>{{ categoryName }}</h1>
    <div class="category-view">
      <div v-for="item in sortedUserItems" :key="item._id" class="list-item">
        <PostCard :item="item"></PostCard>
      </div>
    </div>
  </div>
  <Footer />
</template>
<script>
import VueCookies from "vue-cookies";
import axios from "axios";
import PostCard from "@/components/post/PostCard.vue";
import Footer from '@/components/Footer.vue';

export default {
  name: "CategoryPage",
  props: {
    catID: {
      type: String
    }
  },
  components: {
    PostCard,
    Footer, 
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
        let categoryId;
        if (this.catID == null) {
          categoryId = this.$route.params.id.slice(-24);
        } else {
          categoryId = this.catID;
        }
        const response = await axios.get(
          `${process.env.VUE_APP_BASE_URL}/category/${categoryId}`
        );
        const datame = response.data.posts;
        for (const post of datame) {
          const prof = await this.getAuthor(post.postAuthorId);
          post.profileImage = prof;
          const name = await this.getAuthorName(post.postAuthorId);
          post.postAuthorName = name;
        }
        this.posts = datame;
        this.categoryName = response.data.category.name;
        document.title = this.categoryName;
      } catch (err) {
        console.error(err);
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
};
</script>
<style>
.category {
    padding-top: 8px;
}
.category-view {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: 0 auto;
  margin-top: 10px;
}
</style>
