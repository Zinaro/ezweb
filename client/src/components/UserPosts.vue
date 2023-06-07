<template>
  <div class="list">
    <div v-for="item in sortedUserItems" :key="item._id" class="list-item">
      <PostCard :item="item"></PostCard>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import VueCookies from "vue-cookies";
import PostCard from "@/components/post/PostCard.vue"

export default {
  name: "UserPostsPage",
  props: {
    userID: {
      type: String,
      required: true
    }
  },
  components: {
    PostCard,
  },
  data() {
    return {
      items: [],
      user: VueCookies.get("user"),
      numOfLoadedItems: 9,
    };
  },
  async created() {
    try {
      this.refreshData();
    } catch (error) {
      console.error(error);
    }
  },
  computed: {
    sortedItems() {
      return this.items
        .slice(Math.max(this.items.length - this.numOfLoadedItems, 0))
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
      return this.sortedItems.length === this.items.length;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.scrollListener);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.scrollListener);
  },

  methods: {
    loadMoreItems() {
      this.numOfLoadedItems += this.itemsPerPage;
    },
    scrollListener() {
      const scrollY = window.scrollY;
      const innerHeight = window.innerHeight;
      const offset = document.documentElement.offsetHeight;
      if (scrollY + innerHeight >= offset) {
        this.numOfLoadedItems += 3; // num of items to load
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
    async refreshData() {
      try {
        const response = await axios.get(
          "http://localhost:3000/posts/approved"
        );
        const posts = response.data;
        for (const post of posts) {
          const prof = await this.getAutor(post.postAutorId);
          post.profileImage = prof;
          const name = await this.getAutorName(post.postAutorId);
          post.postAutorName = name;
        }
        this.items = posts.filter(post => post.postAutorId === this.userID);
      } catch (error) {
        console.error(error);
      }
    },




  },
};
</script>

<style>
.list {
  display: flex;
  flex-wrap: wrap;
  justify: flex-start;
  margin: -10px;
}

.list-item {
  width: calc(33.33% - 20px);
  margin: 10px;
}
@media (max-width: 767.98px) {
 .list-item {
    width: 100%;
    margin: 10px 0;
  }
}
@media (max-width: 991.98px) {
 .list-item {
    width: 100%;
    margin: 10px 0;
  }
}
</style>
