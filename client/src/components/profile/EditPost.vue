<template>
  <div class="edit-post">
    <div v-if="user" class="form form-section-add">
      <div class="form-group">
        <div class="switch-container">
          <div
            class="switch"
            :class="{
              'switch--approved': postCopy.postApproved,
              'switch--not-approved': !postCopy.postApproved,
            }"
            @click="togglePostApproval"
          >
            <div class="switch-knob"></div>
          </div>
          <div class="switch-label">
            {{ postCopy.postApproved ? "Approved" : "Unapproved" }}
          </div>
          <button
        type="submit"
        class="button is-primary"
        @click.prevent="updatePost()"
      >
        Tevlî bike
      </button>
          <button v-if="user.permission === 'root' || user.permission === 'admin'"
        type="delete"
        class="button is-danger"
        @click.prevent="deletePost(this.postCopy._id)"
      >
        Delete
      </button>
        </div>
      </div>
      
      <div class="form-group">
        <label for="posttitle" class="label">Sernav:</label>
        <input
          type="text"
          id="posttitle"
          v-model="postCopy.postTitle"
          class="input"
          required
        />
      </div>

      

      <div class="form-group">
        <label for="postcategory" class="label">Kategori:</label>
        <select
          id="postcategory"
          v-model="postCopy.postCategory"
          class="input"
          required
        >
          <option value="">Kategori Hilbijere</option>
          <option
            v-for="category in categories"
            :key="category._id"
            :value="category._id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="form-group form-postcontent">
        <label class="label">Naverok:</label>
        <Tiny
          ref="editor"
          v-model="postCopy.postCategory"
          :value="postCopy.postContent"
          :config="config"
        ></Tiny>
      </div>
      
    </div>
    <div v-if="showMessage" class="success-message">Şandî Tevlî bû</div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import axios from "axios";
import Tiny from "@/components/profile/post/Tiny.vue";

export default {
  name: "EditPostPage",
  data() {
    return {
      user: null,
      postCopy: {},
      categories: [],
      showMessage: false,
      editorContent: "",
      config: {
        styles: [
          {
            name: "Custom Color",
            element: "span",
            styles: {
              color: "#FF0000",
            },
          },
        ],
      },
    };
  },
  components: {
    Tiny,
  },
  props: {
    post: {
      required: true,
    },
  },
  mounted() {
    this.editorContent = this.postCopy.postContent;
  },
  created() {
    this.user = VueCookies.get("user");
    this.postCopy = Object.assign({}, this.post);
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get("http://localhost:3000/category");
        this.categories = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async deletePost(postID) {
      try {
        await axios.delete(`http://localhost:3000/posts/${postID}`);
        this.fetchCategories();
        location.reload();
      } catch (error) {
        console.error(error);
        alert("hi zinar, you have an error");
      }
    },
    async updatePost() {
      const item = {
        postTitle: this.postCopy.postTitle,
        postCategory: this.postCopy.postCategory,
        postContent: this.$refs.editor.editorData,
        postDate: this.postCopy.postDate,
        postAutorId: this.postCopy.postAutorId,
      };
      if (this.postCopy.postApproved) {
        item.postApproved = true;
      } else {
        item.postApproved = false;
      }
      try {
        const response = await axios.put(
          `http://localhost:3000/posts/${this.postCopy._id}`,
          item
        );
        console.log(response.data);
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 3000);
        this.fetchCategories();
        location.reload();
      } catch (error) {
        console.error(error);
        alert("hi zinar, you have an error");
      }
    },
    clearInputs() {
      this.postCopy = null;
    },
    togglePostApproval() {
      this.postCopy.postApproved = !this.postCopy.postApproved;
    },
  },
};
</script>
<style>
.success-message {
  background-color: green;
  color: white;
  padding: 10px;
  margin-top: 10px;
  text-align: center;
}

.form-section-add {
  margin: 0 auto;
  background-color: #fff;
}

.switch-container {
  display: flex;
  align-items: center;
  margin-top: 1rem;
}
.switch-container > * {
  margin-right: 0.5rem;
  margin: 10px;
  flex: 1;
  
}
.switch-container > *:last-child {
  margin-right: 0.01;
  flex: 1;
}

.switch {
  position: relative;
  display: inline-block;
  max-width: 5rem;
  height: 2.5rem;
  border-radius: 1.25rem;
  background-color: #d9d9d9;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.switch-knob {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.switch--approved .switch-knob {
  transform: translate(2.75rem, -50%);
}

.switch--not-approved .switch-knob {
  transform: translate(0, -50%);
}

.switch-label {
  margin-left: 1rem;
}

.switch--approved {
  background-color: #4caf50;
}

.switch--not-approved {
  background-color: #f44336;
}
</style>
