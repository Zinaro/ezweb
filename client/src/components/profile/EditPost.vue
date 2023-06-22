<template>
  <div class="edit-post">
    <div v-if="user" class="form form-section-add">
      <div class="thumbnail-picker-edit">
        <img
          v-if="postCopy.postImage"
          @click="viewPost(item)"
          style="cursor: pointer"
          :src="require(`@/assets/images/postimages/${postCopy.postImage}`)"
          alt="Wêneya Postê"
          class="post-image-edit"
        />
        <div class="select-image-edit">
          <input
            type="file"
            ref="image"
            accept="image/*"
            @change="onFileChange"
            @click="$refs.image.click()"
          />
        </div>

        <img
          v-show="thumbImage"
          class="post-image-edit"
          :src="thumbImage"
          alt="Thumbnail"
        />
      </div>
      <div class="form-group tomar-bike">
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
            Tomar Bike
          </button>
          <button
            v-if="user.permission === 'root' || user.permission === 'admin'"
            type="delete"
            class="button is-danger"
            @click.prevent="dialogVeke()"
          >
            Delete
          </button>
        </div>
      </div>
      <div v-if="dialog" class="dialog">
        <v-dialog v-model="dialog" max-width="500">
          <v-card>
            <v-card-title class="headline">OPS!</v-card-title>
            <v-card-text>Bi rastî jî dixwazî jê bibî?</v-card-text>
            <v-card-actions class="custom-actions">
              <v-btn class="custom-button na" text @click="dialogVeke()"
                >NA</v-btn
              >
              <v-btn
                class="custom-button ere"
                text
                @click="deletePost(this.postCopy._id)"
                >ERÊ</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <div class="form-group">
        <label for="posttitle">Sernav:</label>
        <input
          type="text"
          id="posttitle"
          v-model="postCopy.postTitle"
          class="input"
          required
        />
      </div>

      <div class="form-group">
        <label for="postcategory">Kategori:</label>
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
        <label>Naverok:</label>
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
      dialog: false,
      editorContent: "",
      postimage: "",
      previewUrl: null,
      thumbImage: null,
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
        const response = await axios.get(`${process.env.VUE_APP_BASE_URL}/category`);
        this.categories = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    dialogVeke() {
      this.dialog = !this.dialog;
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
          `${process.env.VUE_APP_BASE_URL}/image/upload`,
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
    async deletePost(postID) {
      try {
        await axios.delete(`${process.env.VUE_APP_BASE_URL}/posts/${postID}`);
        this.fetchCategories();
        location.reload();
      } catch (error) {
        console.error(error);
        alert("hi zinar, you have an error");
      }
    },
    async updatePost() {
      if (this.previewUrl) {
        await this.uploadImage();
      } else {
        this.postimage = this.postCopy.postImage;
      }
      const item = {
        postTitle: this.postCopy.postTitle,
        postCategory: this.postCopy.postCategory,
        postContent: this.$refs.editor.editorData,
        postDate: this.postCopy.postDate,
        postAuthorId: this.postCopy.postAuthorId,
        postImage: this.postimage,
      };
      if (this.postCopy.postApproved) {
        item.postApproved = true;
      } else {
        item.postApproved = false;
      }
      try {
        const response = await axios.put(
          `${process.env.VUE_APP_BASE_URL}/posts/${this.postCopy._id}`,
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
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bghover) !important;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
}
.na {
  background-color: #f44336;
}
.ere {
  background-color: #4caf50;
}
.edit-post {
  background-color: var(--colorbg);
  color: var(--colortext);
}
.form-group {
  margin-top: 40px;
  box-shadow: var(--shadow);
  border-radius: 5px;
  border: none;
}
.tomar-bike {
  padding-bottom: 10px;
}
.form-group input {
  background-color: var(--colorbg);
  color: var(--colortext);
}
.form-group label {
  padding-top: 10px;
  padding-bottom: 10px;
}
.form-group select {
  background-color: var(--colorbg);
  color: var(--colortext);
}
.form-group select option {
  background-color: var(--colorbg);
  color: var(--colortext);
}
.form-section-add {
  margin: 0 auto;
  background-color: var(--colorbg);
  color: var(--colortext);
}

.thumbnail-picker-edit {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  padding: 20px;
}

.post-image-edit {
  max-width: 200px;
  height: 75px;
  margin-right: 20px;
}

.select-image-edit {
  margin-right: 20px;
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
.switch-container > *:first-child {
  flex: none;
}
.switch-container > *:last-child {
  margin-right: 0.01;
  flex: 1;
}

.switch {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 40px;
  border-radius: 20px;
  background-color: #d9d9d9;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.switch-knob {
  position: absolute;
  top: 50%;
  left: 2px;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.switch--approved .switch-knob {
  left: calc(100% - 38px);
}

.switch--not-approved .switch-knob {
  left: 2px;
}

.switch--approved {
  background-color: #4caf50;
}

.switch--not-approved {
  background-color: #f44336;
}

@media (max-width: 767.98px) {
  .switch-container {
    display: flex;
    flex-direction: column;
  }
  .switch {
    width: 60px;
    height: 30px;
  }

  .switch-knob {
    width: 26px;
    height: 26px;
    left: 2px;
    transform: translateY(-50%);
  }
  .switch--approved .switch-knob {
    left: calc(117% - 38px);
  }
}
@media (max-width: 991.98px) {
  .switch-container {
    display: flex;
    flex-direction: column;
  }
  .switch {
    width: 60px;
    height: 30px;
  }

  .switch-knob {
    width: 26px;
    height: 26px;
    left: 2px;
    transform: translateY(-50%);
  }
  .switch--approved .switch-knob {
    left: calc(117% - 38px);
  }
}
</style>
