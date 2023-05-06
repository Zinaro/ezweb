<template>
  <div class="add-post">
    <div v-if="user" class="form-section-add-post">
      <h1>Şandî Tevlî bike</h1>
      <div v-if="showMessage" class="success-message">Şandî Tevlî bû</div>
      <div class="firsland">
        <div class="form-group">
          <label for="posttitle" class="label">Sernav:</label>
          <input
            type="text"
            id="posttitle"
            v-model="posttitle"
            class="input"
            required
          />
        </div>
        <div class="form-group form-postcontent">
          <label for="postcontent" class="label">Naverok:</label>
          <Tiny ref="editor" v-model="postcontent"></Tiny>
        </div>
      </div>
      <div class="lastland">
        <div class="thumbnail-picker">
          <div class="select-image">
            <input
              type="file"
              ref="image"
              accept="image/*"
              @change="onFileChange"
              @click="$refs.image.click()"
            />
          </div>
          <div class="image-preview" v-show="thumbImage">
            <img :src="thumbImage" alt="Thumbnail" />
          </div>
        </div>
        <div class="form-group">
          <label for="postcategory" class="label">Kategori:</label>
          <select
            id="postcategory"
            v-model="postcategory"
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

        <button
          type="submit"
          class="button is-primary"
          @click.prevent="addItem"
        >
          Tevlî bike
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import axios from "axios";
import Tiny from "@/components/profile/post/Tiny.vue";
export default {
  name: "AddPostPage",
  data() {
    return {
      user: null,
      posttitle: "",
      postcategory: "",
      postcontent: "",
      postdate: null,
      postimage: "",
      showMessage: false,
      categories: [],
      previewUrl: null,
      thumbImage: null
    };
  },
  components: {
    Tiny,
  },
  created() {
    this.user = VueCookies.get("user");
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
    onFileChange(e) {
      this.previewUrl = e.target.files[0];
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.thumbImage = reader.result;
      };
      reader.readAsDataURL(file);
      
    },
    async uploadImage() {
      const formData = new FormData();
      formData.append("image", this.previewUrl);
      try {
        const response = await axios.post(
          `http://localhost:3000/image/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        this.previewUrl = null;
        this.postimage = response.data.imageUrl;
      } catch (error) {
        console.error(error);
      }
    },
    async addItem() {
        if (this.previewUrl) {
          await this.uploadImage();
        } else {
          this.postimage = '';
        }
      const item = {
        postTitle: this.posttitle,
        postCategory: this.postcategory,
        postContent: this.$refs.editor.editorData,
        postDate: new Date().toLocaleString("tr-TR"),
        postAutorId: this.user._id,
        postAutorName: this.user.name,
        postImage: this.postimage,
      };
      try {
        const response = await axios.post("http://localhost:3000/posts", item);
        const postId = response.data._id;
        const categoryResponse = await axios.put(
          `http://localhost:3000/category/${this.postcategory}/addpost`,
          { postId }
        );
        console.log(categoryResponse.data);
        const itemsResponse = await axios.get("http://localhost:3000/posts");
        this.items = itemsResponse.data;
        this.clearInputs();
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 3000);
      } catch (error) {
        console.error(error);
        alert("hi zinar, you have an error");
      }
    },
    clearInputs() {
      this.posttitle = "";
      this.postcontent = "";
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
.add-post {
  width: 100%;
  padding-bottom: 100px;
  display: flex;
}
.form-section-add-post {
  background-color: white;
}
.firsland {
  width: 75%;
  height: 100%;
  float: left;
  padding-right: 5px;
}
.lastland {
  width: 25%;
  height: 100%;
  float: right;
  padding-left: 5px;
  padding-right: 10px;
}

.thumbnail-picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
}

.select-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s;
  margin: 15px;
}

img {
  max-width: 200px;
  max-height: 200px;
}
</style>
