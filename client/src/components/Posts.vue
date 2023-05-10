<template>
  <div class="list" @mousemove="moveShadow">
    <div v-for="item in sortedUserItems" :key="item._id" class="list-item">
      <card title="Post">
        <div class="kart">
          <div class="item-card">
            <div class="post-image-smole">
              <img
                v-if="item.postImage"
                @click="viewPost(item)"
                style="cursor: pointer"
                :src="require(`@/assets/images/postimages/${item.postImage}`)"
                alt="Wêneya Postê"
                class="post-image-smole"
              />
            </div>
            <div
              class="item-post-title"
              @click="viewPost(item)"
              style="cursor: pointer"
            >
              {{ item.postTitle }}
            </div>
            <div
              class="item-post-content"
              v-html="truncateText(item.postContent, 410)"
            ></div>
            <div class="item-post-content">
              <div class="post-content-autor-bottom">
                <div class="post-autor">
                  <img
                    v-if="item.profileImage"
                    :src="
                      require(`@/assets/images/${item.postAutorId}/${item.profileImage}`)
                    "
                    alt="Wêneya Profîlê"
                    class="post-image"
                  />
                  <img
                    v-else
                    src="../assets/images/default.jpg"
                    alt="Wêneya Profîlê"
                    class="profile-image"
                  />
                  <div class="post-autor-name">
                    {{ item.postAutorName }}
                  </div>
                </div>
                {{ Object.keys(item.likes).length }} liked.
              </div>
            </div>

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
    viewPost(item) {
      const kurdishChars = "ğüşöçİıĞÜŞÖÇêîûÊÎÛ";
      const englishChars = "gusocIiGUSOCeiuEIU";
      let postName = item.postTitle.toLowerCase();
      for (let i = 0; i < kurdishChars.length; i++) {
        postName = postName.replace(
          new RegExp(kurdishChars.charAt(i), "g"),
          englishChars.charAt(i)
        );
      }
      postName = postName.replace(/[^a-zA-Z0-9]/g, "-");
      this.$router.push({
        name: "post",
        params: { postname: postName, id: item._id },
      });
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
    truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      }
      return text;
    },
  },
};
</script>

<style>
.post-image-smole {
  object-fit: cover;
  object-position: top;
  width: 100%;
  border-top-left-radius: 55px;
  border-top-right-radius: 55px;
  height: 210px;
}

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
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  border: 0.2px solid cyan;
  border-radius: 55px;
  position: relative;
  background-color: rgba(1, 68, 37, 0.1);
  z-index: 999;
  height: 420px;
  max-height: 420px;
  min-height: 420px;
}
.kart {
  padding-bottom: 5px;
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
.item-post-title {
  font-size: 18px;
  font-weight: bold;
  margin-top: 3px;
  margin-left: 3px;
  margin-right: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.item-post-content {
  padding-left: 8px;
  padding-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
.post-content-autor-bottom {
  position: absolute;
  padding-left: 30px;
  padding-right: 30px;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(1, 68, 37, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  font-size: 14px;
  border-bottom-left-radius: 55px;
  border-bottom-right-radius: 55px;
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
