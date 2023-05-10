<template>
  <div class="myposts">
    <h1 class="item-nav">Şandiyên min</h1>
    <card title="Items">
      <ul class="list">
        <li v-for="item in sortedItems" :key="item._id" class="list-item">
          <div class="kart">
            <div class="item-card">
            <div class="item-post-title">{{ item.postTitle }}</div>
            <div v-if="!item.showModal && item.postContent.length > 500">
              <div v-html="item.postContent.slice(0, 500)"></div>
              <span>...</span>              <a
                href="#"
                class="more-link"
                @click.prevent="item.showModal = true"
                >more</a
              >
            </div>
            <div v-else v-html="item.postContent"></div>
            <div v-if="item.showModal" class="modal">
              <div class="modal-content">
                <span class="close" @click="item.showModal = false"
                  >&times;</span
                >
                <div v-html="item.postContent"></div>
              </div>
            </div>
            <div class="item-dil">Created By {{ item.postAutorName }}</div>
          </div>
          </div>
          <div class="list-item-buttons">
            <button
              v-if="user && item.postAutorId === user._id"
              @click="deleteItem(item._id)"
              class="button is-danger"
            >
              Delete
            </button>
            <button
              v-if="user && item.postAutorId === user._id"
              @click="editItem(item)"
              class="button is-primary"
            >
              Update
            </button>
          </div>
        </li>
      </ul>
    </card>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import axios from "axios";

export default {
  name: "MyPostsPage",
  data() {
    return {
      user: null,
      posttitle: "",
      postcontent: "",
      postdate: null,
      items: [],
      showModal: false,
    };
  },
  async created() {
    this.user = VueCookies.get("user");
    try {
      const response = await axios.get("http://localhost:3000");
      this.items = response.data;
    } catch (error) {
      console.error(error);
    }
  },
  computed: {
    sortedItems() {
      const filteredItems = this.items.filter((item) => item.postAutorId === this.user._id);
      return filteredItems.slice().reverse();
    },
  },
  methods: {
    async deleteItem(itemId) {
      try {
        await axios.delete(`http://localhost:3000/${itemId}`);
        this.items = this.items.filter((item) => item._id !== itemId);
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
        postDate: new Date().toLocaleString("tr-TR"),
        postAutorName: this.user.name,
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
        const response = await axios.get("http://localhost:3000");
        this.items = response.data;
      } catch (error) {
        console.error(error);
        alert("hi zinar, you have an error");
      }
    },
  },
};
</script>
<style>
.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
.more-link {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
  margin-left: 5px;
}

.more-link:hover {
  text-decoration: underline;
  cursor: pointer;
}

.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
