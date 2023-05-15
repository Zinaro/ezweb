<template>
  <div class="list" @mousemove="moveShadow">
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
  name: "PostsPage",
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
        this.items = posts;
      } catch (error) {
        console.error(error);
      }
    },

    async likePost(postttId) {
      try {
        const userId = this.user._id;
        const data = { userId, postttId };
        const post = this.items.find((item) => item._id == postttId);
        if (post.likes.some((l) => l.likeId == userId)) {
          await axios.delete(`http://localhost:3000/posts/${postttId}/like`, {
            data,
          });
          post.likes = post.likes.filter((like) => like.likeId !== userId);
        } else {
          const response = await axios.put(
            `http://localhost:3000/posts/${postttId}/like`,
            data
          );
          const updatedPost = response.data;
          await this.refreshData();
          const index = this.items.findIndex(
            (item) => item._id === updatedPost._id
          );
          if (index !== -1) {
            this.items.splice(index, 1, updatedPost);
          }
        }
        console.log(`The like process is ok`);
      } catch (error) {
        console.log(error);
      }
    },

    async getItems() {
      try {
        const response = await axios.get("http://localhost:3000");
        this.items = response.data;
      } catch (error) {
        console.error(error);
        alert("hi zinar, you have an error");
      }
    },
    moveShadow(event) {
      const cards = document.querySelectorAll(".list-item");
      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const distanceX = Math.min(
          Math.abs(mouseX - cardRect.left),
          Math.abs(mouseX - cardRect.right),
          cardRect.width / 2
        );
        const distanceY = Math.min(
          Math.abs(mouseY - cardRect.top),
          Math.abs(mouseY - cardRect.bottom),
          cardRect.height / 2
        );
        const shadowX =
          ((mouseX - cardRect.left - cardRect.width / 2) / 10) *
          (distanceX / (cardRect.width / 2));
        const shadowY =
          ((mouseY - cardRect.top - cardRect.height / 2) / 10) *
          (distanceY / (cardRect.height / 2));
        const distance = Math.sqrt(shadowX ** 2 + shadowY ** 2);
        const shadow = card.querySelector(".kart");
        shadow.style.boxShadow = `${-shadowX}px ${-shadowY}px ${
          distance * 0.2
        }px rgba(0, 70, 137, ${1 - distance / 70})`;
      });
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
</style>
