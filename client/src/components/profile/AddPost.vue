<template>
  <div class="add-post">
    <div v-if="user" class="form-section-add-post">
      <h1>Şandî Tevlî Bike</h1>
      <div v-if="showMessage" class="success-message">Şandî Tevlî Bû</div>
      <div class="firsland">
        <div class="form-group-sernav">
          <label for="posttitle">Sernav:</label>
          <input
            type="text"
            id="posttitle"
            v-model="posttitle"
            class="input"
            :maxlength="100"
            required
          />
        </div>
        <div class="form-group form-postcontent">
          <label for="postcontent">Naverok:</label>
          <Tiny class="tiny-editor" ref="editor" v-model="postcontent"></Tiny>
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
        <div class="form-group-category">
          <label for="postcategory">Kategori:</label>
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
          class="button is-primary tevli-bike"
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
    document.title = 'Şandî Tevlî Bike';
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
        postAutorImage: this.user.profileImage ? this.user.profileImage : null,
        postImage: this.postimage,
        postUrl: this.posttitle.toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, '')
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
  display: flex;
}
.form-section-add-post {
  padding: 20px;
  background-color: var(--colorbg);
}
.firsland {
  width: 75%;
  float: left;
  padding-right: 5px;
}
.form-group-sernav {
  background-color: var(--colorbg);
  color: var(--colortext);
  box-shadow: var(--shadow);
  padding-top: 10px;
  margin-top: 10px;
  border-radius: 5px;
}
.firsland input{
  margin-top: 10px;
  background-color: var(--colorbg);
  color: var(--colortext);
}
.form-postcontent {
  margin-top: 30px;
  padding-top: 10px;
  background-color: var(--colorbg);
  color: var(--colortext);
  box-shadow: var(--shadow);
  
}
.tiny-editor {
  margin-top: 10px;
  
}
.lastland {
  width: 25%;
  float: right;
  padding: 10px;
}

.thumbnail-picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.select-image {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--colorbg);
  border: 1px solid #ccc;
  box-shadow: var(--shadow);
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
}
.select-image input {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.image-preview {
  margin-top: 10px;
  margin-bottom: 10px;
  box-shadow: var(--shadow);
  border-radius: 10px;
  overflow: hidden;
}
.form-group-category {
  padding-top: 10px;
  margin-top: 20px;
  margin-bottom: 10px;
  box-shadow: var(--shadow);
  border-radius: 5px;
}
.form-group-category .input {
  margin-top: 10px;
  background-color: var(--colorbg);
  color: var(--colortext);

}
.tevli-bike {
  margin-top: 20px;
  box-shadow: var(--shadow);
}
@media (max-width: 767.98px) {
  .firsland {
  width: 100%;
  float: left;
  padding-right: 5px;
  margin-bottom: 40px;
}

.lastland {
  width: 100%;
  float: right;
  padding: 10px;
  margin-bottom: 40px;
}
}
@media (max-width: 991.98px) {
  .firsland {
  width: 100%;
  float: left;
  padding-right: 5px;
  margin-bottom: 40px;
}

.lastland {
  width: 100%;
  float: right;
  padding: 10px;
  margin-bottom: 40px;
}
}

</style>
