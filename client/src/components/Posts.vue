<template>
      <div class="list" @mousemove="moveShadow">
        <div v-for="item in sortedUserItems" :key="item._id" class="list-item">
          <card title="Item">
            <div class="kart">
              <div class="item-card">
                <div class="item-nav">{{ item.postTitle }}</div>
                <div v-html="item.postContent" class="item-dil"></div>
                <div class="item-dil">
                  {{ getDifference(item.postDate) }} Created By
                  {{ item.postAutorName }} Likes count
                  {{ Object.keys(item.likes).length }}
                </div>
                <button
                  class="like"
                  @click="likePost(item._id, item)"
                  v-if="user && !item.likes.some((l) => l.likeId == user._id)"
                >
                  Hez bike
                </button>
                <button
                  class="likered"
                  @click="likePost(item._id, item)"
                  v-else-if="user"
                >
                  Hez neke
                </button>
                <button class="like" @click="viewPost(item)">
                  Şandiyê Nîşan bide
                </button>
                <Post v-if="selectedPost" :post="selectedPost" />
              </div>
            </div>
          </card>
        </div>
      </div>
  </template>
  
  <script>
  import axios from "axios";
  import VueCookies from "vue-cookies";
  import { parse } from "date-fns";
  import Post from "@/components/Post.vue";
  
  
  export default {
    name: "PostsPage",
    components: {
      Post,
    },
    data() {
      return {
        posttitle: "",
        postcontent: "",
        postdate: null,
        items: [],
        editedItem: {},
        user: VueCookies.get("user"),
        selectedPost: false,
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
        return this.items.slice(Math.max(this.items.length - this.numOfLoadedItems, 0)).reverse();
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
      viewPost(post) {
        this.$router.push({
          name: "post",
          params: { postId: post._id },
          props: { post },
        });
      },
      async refreshData() {
        try {
          const response = await axios.get("http://localhost:3000/posts");
          this.items = response.data;
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
      getDifference(postDate) {
        const currentDate = new Date();
        const postDateObj = parse(postDate, "dd.MM.yyyy HH:mm:ss", new Date());
        const diffInMs = currentDate - postDateObj;
        const diffInSec = Math.floor(diffInMs / 1000);
        const diffInMin = Math.floor(diffInSec / 60);
        const diffInHr = Math.floor(diffInMin / 60);
        const diffInDay = Math.floor(diffInHr / 24);
        const diffInWeek = Math.floor(diffInDay / 7);
  
        if (diffInWeek > 0) {
          return `${diffInWeek} week ago`;
        } else if (diffInDay > 0) {
          return `${diffInDay} day ago`;
        } else if (diffInHr > 0) {
          return `${diffInHr} hour ago`;
        } else if (diffInMin > 0) {
          return `${diffInMin} munite ago`;
        } else if (diffInSec > 0) {
          return `${diffInSec} seconds ago`;
        } else {
          return "now";
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
  .item-card {
    padding: 20px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    border: 0.2px solid cyan;
    border-radius: 55px;
    position: relative;
    background-color: rgba(1, 68, 37, 0.1);
    z-index: 999;
  }
  .kart {
    padding-right: 5px;
    padding-top: 5px;
    background-color: rgba(0, 0, 0);
    border-radius: 55px;
    position: relative;
    transform: scale(0.95);
    background-image: linear-gradient(to bottom right, black, cyan, cyan, black);
    background-size: 200% 200%;
    background-position: center;
    animation: gradient 10s ease infinite;
  }
  @keyframes gradient {
    0% {
      background-position: 0% 0%;
    }
    50% {
      background-position: 100% 100%;
    }
    100% {
      background-position: 0% 0%;
    }
  }
  
  .item-nav {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .item-dil {
    margin-bottom: 5px;
  }
  
  .like,
  .likered {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px;
    margin-top: 10px;
    cursor: pointer;
  }
  
  .likered {
    background-color: #f44336;
  }
  
  .like:hover,
  .likered:hover {
    opacity: 0.8;
  }
  </style>
  