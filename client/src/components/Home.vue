<template>
  <div class="container">
    <h1 class="title">Hi zinar, {{ msg }}</h1>
    <div>
      <div v-if="user" class="form-section">
        <form v-if="user" @submit.prevent="addItem" class="form">
          <div class="form-group">
            <label for="nav" class="label">Title:</label>
            <input type="text" id="nav" v-model="posttitle" class="input" required>
          </div>
          <div class="form-group form-dil">
            <label for="dil" class="label">Content:</label>
            <textarea id="dil" v-model="postcontent" class="input" rows="3" required></textarea>
          </div>
          <button type="submit" class="button is-primary">Add</button>
        </form>
      </div>

      <card title="Items">
        <ul class="list">
          <li v-for="item in sortedUserItems" :key="item._id" class="list-item">
            <div v-if="editedItem._id === item._id" class="update-inputs">
              <input type="text" v-model="editedItem.postTitle" class="input">
              <input type="text" v-model="editedItem.postContent" class="input">
              <div class="list-item-buttons">
                <button @click="updateItem" class="button is-primary">Saved</button>
                <button @click="cancelEdit" class="button is-danger">Cancel</button>
              </div>
            </div>
            <div v-else>
              <div class="item-card">
                <div class="item-nav">{{ item.postTitle }}</div>
                <div class="item-dil">{{ item.postContent }}</div>
                <div class="item-dil">{{ getDifference(item.postDate) }}</div>
                <div class="item-dil">Created By {{ item.postAutorName }}</div>
                <div class="item-dil">Likes count {{ Object.keys(item.likes).length }}</div>
                <button class="like" @click="likePost(item._id, item)"
                  v-if="!item.likes.some((l) => l.likeId == user._id) && user">Like</button>
                <button class="likered" @click="likePost(item._id, item)" v-else>Dislike</button>
                <button @click="viewPost(item)">View Post</button>
                <Post v-if="selectedPost" :post="selectedPost"/>
              </div>
              <div class="list-item-buttons">
                <button v-if="user && item.postAutorId === user._id" @click="deleteItem(item._id)"
                  class="button is-danger">Delete</button>
                <button v-if="user && item.postAutorId === user._id" @click="editItem(item)"
                  class="button is-primary">Update</button>
              </div>
            </div>
          </li>
        </ul>
      </card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import VueCookies from 'vue-cookies';
import { parse } from 'date-fns';
import Post from '@/components/Post.vue'

export default {
  name: "HomePage",
  props: {
    msg: {
      type: String,
      default: "Silav, MongoDB!",
    },
  },
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
      selectedPost: false
    };
  },
  async created() {
    try {
      this.refreshData()
        } catch (error) {
      console.error(error);
    }
  },
  computed: {
    sortedItems() {
      return this.items.slice().reverse();
    },
    sortedUserItems() {
      if (this.user) {
        return this.sortedItems.filter(item => item.postAutorId === this.user._id).concat(this.sortedItems.filter(item => item.postAutorId !== this.user._id));
      } else {
        return this.sortedItems;
      }
    },

  },

  methods: {
    viewPost(post) {
  this.$router.push({ name: "post", params: { postId: post._id }, props: { post } });
},
    async refreshData() {
      try {
        const response = await axios.get('http://localhost:3000')
        this.items = response.data
      } catch (error) {
        console.error(error)
      }
    },
    async likePost(postttId) {
      try {
        const userId = this.user._id;
        const data = { userId, postttId };
        const post = this.items.find((item) => item._id == postttId);
        if (post.likes.some((l) => l.likeId == userId)) {
          await axios.delete(`http://localhost:3000/posts/${postttId}/like`, { data });
          post.likes = post.likes.filter((like) => like.likeId !== userId);
        } else {
          const response = await axios.put(`http://localhost:3000/posts/${postttId}/like`, data);
          const updatedPost = response.data;
          this.refreshData()
          const index = this.items.findIndex((item) => item._id === updatedPost._id);
          if (index !== -1) {
            this.items.splice(index, 1, updatedPost);
          }

        }
        console.log(`The like process is ok`)
      } catch (error) {
        console.log(error);
      }
    },
    getDifference(postDate) {
      const currentDate = new Date();
      const postDateObj = parse(postDate, 'dd.MM.yyyy HH:mm:ss', new Date());
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
        return 'now';
      }
    },
    async addItem() {
      const item = {
        postTitle: this.posttitle,
        postContent: this.postcontent,
        postDate: new Date().toLocaleString('tr-TR'),
        postAutorId: this.user._id,
        postAutorName: this.user.name
      };
      try {
        await axios.post("http://localhost:3000", item);
        const response = await axios.get("http://localhost:3000");
        this.items = response.data;
        this.clearInputs();
      } catch (error) {
        console.error(error);
        alert("hi zinar, you have an error");
      }
    },
    async deleteItem(itemId) {
      try {
        await axios.delete(`http://localhost:3000/${itemId}`);
        this.items = this.items.filter((item) => item._id !== itemId); // Silinen öğeyi listeden kaldırın
      } catch (error) {
        console.error(error);
        alert("hi zinar, you have an error");
      }
    },
    async editItem(item) {
      this.editedItem = {
        _id: item._id,
        postTitle: item.postTitle,
        postContent: item.postContent,
        postDate: new Date().toLocaleString('tr-TR'),
        postAutorName: this.user.name
      };
    },
    async updateItem() {
      try {
        const response = await axios.put(
          `http://localhost:3000/${this.editedItem._id}`,
          this.editedItem
        );
        const index = this.items.findIndex(
          (item) => item._id === response.data._id
        );
        this.items.splice(index, 1, response.data);
        this.editedItem = {};
        this.getItems();
      } catch (error) {
        console.error(error);
        alert("hi zinar, you have an error");
      }
    },
    clearInputs() {
      this.posttitle = "";
      this.postcontent = "";
    },
    cancelEdit() {
      this.editedItem = {};
    },
    async getItems() {
      try {
        const response = await axios.get('http://localhost:3000');
        this.items = response.data;
      } catch (error) {
        console.error(error);
        alert('hi zinar, you have an error');
      }
    },
  },
};
</script>

<style>
@import url('../assets/styles.css');

.like {
  background-color: #3e8e41;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  color: white !important;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  margin-right: 10px;
  outline: none;
  padding: 8px 16px;
  text-decoration: none;
  transition: box-shadow 0.3s ease-in-out;
}

.like:hover {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  color: #e0245e;
}
.likered {
  background-color: #f44336;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  color: white !important;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  margin-right: 10px;
  outline: none;
  padding: 8px 16px;
  text-decoration: none;
  transition: box-shadow 0.3s ease-in-out;
}

.likered:hover {
  background-color: #f44336;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  color: #e0245e;
}
</style>