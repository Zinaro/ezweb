<template>
  <div v-if="user && user.permission === 'root'" class="market-add-platform">
    <h1>Add Platform</h1>
    <ul class="platform-row">
      <li
        v-for="platform in platforms"
        :key="platform.id"
        class="add-platform-item">
        <div class="add-platform-name">{{ platform.platformName }}</div>
        <div class="add-platform-name">
          <img
              v-if="platform.platformImage"
              :src="require(`@/assets/images/pimages/${platform.platformImage}`)"
              alt="Platform Image"
              class="platform-image"
            />
        </div>
        <button @click="deletePlatform(platform)" class="add-platform-delete">
          Delete
        </button>
        <button @click="editPlatform(platform)" class="add-platform-update">
          Update
        </button>
        <div v-if="platform.showDeleteConfirmation" class="dialog">
          <v-dialog max-width="500">
            <v-card>
              <p>
                Are you sure you want to delete this platform?<br />{{
                  platform.platformName
                }} &emsp; <img
              v-if="platform.platformImage"
              :src="require(`@/assets/images/pimages/${platform.platformImage}`)"
              alt="Platform Image"
              class="platform-image"
              style="max-height: 25px;"
            />
              </p>
              <v-card-actions class="custom-actions">
                <v-btn
                  class="custom-button na"
                  text
                  @click="cancelDelete(platform)"
                  ><i class="fas fa-undo"></i> NA</v-btn
                >
                <v-btn
                  class="custom-button ere"
                  text
                  @click="confirmDelete(platform)"
                  ><i class="fas fa-trash"></i> ERÊ</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </li>
    </ul>
    <div v-if="showEditForm" class="dialog">
      <v-dialog max-width="500">
        <v-card>
          <form @submit.prevent="updatePlatform" class="add-platform-form">
            <input
              type="text"
              v-model="editPlatformName"
              placeholder="New Platform Name"
              class="add-platform-input"
            />
            <img
              v-if="editPlatformImage"
              :src="require(`@/assets/images/pimages/${editPlatformImage}`)"
              alt="Platform Image"
              class="platform-image"
              
            />
            <input
        type="file"
        @change="onFileChange"
        ref="fileInput"
        accept="image/*"
        class="add-platform-input"
        style="margin-top: 20px;"
      />
      <div class="image-preview platform-image" v-show="thumbImage">
            <img :src="thumbImage" alt="Thumbnail" />
          </div>
            <button type="submit" class="add-platform-submit">Save</button>
            <button class="add-platform-cancel" @click="cancelPlatform">
              Cancel
            </button>
          </form>
        </v-card>
      </v-dialog>
    </div>
    <div class="platform-row">
      <div v-if="user && showEditForm == false" class="add-form-section">
        <form @submit.prevent="addPlatform" class="add-platform-form">
          <h1>Platform Tevlî Bike</h1>
          <input
            type="text"
            v-model="platformName"
            placeholder="New Platform Name"
            class="add-platform-input"
          />
          <input
        type="file"
        @change="onFileChange"
        ref="fileInput"
        accept="image/*"
        class="add-platform-input"
      />
      <div class="image-preview platform-image" v-show="thumbImage">
            <img :src="thumbImage" alt="Thumbnail" />
          </div>
          <button type="submit" class="add-platform-submit">
            Add Platform
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import axios from "axios";

export default {
  name: "MarketAddPlatformPage",
  data() {
    return {
      user: null,
      showEditForm: false,
      platformName: "",
      platformImage: null,
      editPlatformId: null,
      editPlatformName: null,
      editPlatformImage: null,
      previewImage: null,
      thumbImage: null,
      fileInput: null,
      showDeleteConfirmation: false,
      platforms: [],
    };
  },
  created() {
    this.user = VueCookies.get("user");
    document.title = "Market Add Platform";
  },
  mounted() {
    this.fetchPlatforms();
  },
  methods: {
    async fetchPlatforms() {
      try {
        const response = await axios.get("http://localhost:3000/platform");
        this.platforms = response.data.map((platform) => ({
          ...platform,
          showDeleteConfirmation: false,
        }));
      } catch (error) {
        console.log(error);
      }
    },
    async addPlatform() {
      if (
        this.platforms.some(
          (platform) => platform.platformName === this.platformName
        )
      ) {
        alert("This platform already exists!");
        return;
      }
      if (this.previewUrl) {
          await this.uploadImage();
        } else {
          this.platformImage = '';
        }
      const requestData = {
        platformName: this.platformName,
        platformImage: this.platformImage,
      };
      try {
        const response = await axios.post(
          "http://localhost:3000/platform",
          requestData
        );
        this.platforms = response.data;
        this.platformName = "";
        this.platformImage = '';
        this.previewUrl = null;
        this.thumbImage = null,
        this.$refs.fileInput.value = '';
        this.fetchPlatforms();
      } catch (error) {
        console.error(error);
      }
    },
    async uploadImage() {
      
      const formData = new FormData();
      formData.append("image", this.previewUrl);
      try {
        const response = await axios.post(
          `http://localhost:3000/platform/image/upload`,
          formData, {headers: {"Content-Type": "multipart/form-data",},}
        );
        this.platformImage = response.data.imageUrl;
      } catch (error) {
        console.error(error);
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
    async confirmDelete(platform) {
      const platformId = platform._id;
      try {
        await axios.delete(`http://localhost:3000/platform/${platformId}`);
        this.platforms = this.platforms.filter((platform) => platform.id !== platformId);
        this.fetchPlatforms();
        platform.showDeleteConfirmation = false;
      } catch (error) {
        console.log(error);
      }
      
    },
    async updatePlatform() {
      if (this.previewUrl) {
          await this.uploadImage();
        } else {
          this.platformImage = '';
        }
      try {
        await axios.put(`http://localhost:3000/platform/${this.editPlatformId}`, {
          platformName: this.editPlatformName,
          platformImage: this.platformImage,
        });
        this.clearInputs();
      } catch (error) {
        console.log(error);
      }
    },
    clearInputs(){
      this.showEditForm = false;
      this.editPlatformId = null;
      this.editPlatformImage = null;
      this.editPlatformName = '';
      this.previewUrl = null;
      this.thumbImage = null,
      this.$refs.fileInput.value = '';
      this.fetchPlatforms();
    },
    editPlatform(platform) {
      this.showEditForm = true;
      this.editPlatformId = platform._id;
      this.editPlatformName = platform.platformName;
      this.editPlatformImage = platform.platformImage;
    },
    cancelPlatform() {
      this.showEditForm = !this.showEditForm;
    },
    deletePlatform(platform) {
      platform.showDeleteConfirmation = true;
    },
    cancelDelete(platform) {
      platform.showDeleteConfirmation = false;
    },
  },
};
</script>
<style>
.market-add-platform {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.platform-row {
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 20px;
}
.item-plt {
  flex-direction: column;
}

.platform-item {
  flex-direction: row;
  justify-content: space-around;
}
ul {
  padding-left: 0;
}

.add-platform-title {
  text-align: center;
}

.add-platform-list {
  list-style-type: none;
  padding: 0;
}

.add-platform-item {
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  box-shadow: var(--shadow);
  padding-left: 7px;
  padding-top: 7px;
  border-radius: 5px;
}

.add-platform-name {
  margin-right: 10px;
  min-width: 100px;
  display: flex;
  align-items: flex-start;
}

.add-platform-item button {
  margin-left: 8px;
  margin-right: 8px;
}

.add-platform-form {
  display: flex;
  align-items: center;
}

.add-form-section form {
  width: 100%;
  margin-bottom: 50px;
}
.add-platform-input {
  padding: 5px;
  border-radius: 3px;
  margin-bottom: 20px;
}
.platform-image {
  border-radius: 5px;
  max-width: 100px;
  max-height: 50px;
}
.add-platform-submit {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.add-platform-cancel {
  padding: 5px 10px;
  background-color: #d80d0d;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.add-platform-cancel:hover {
  background-color: #8b0808;
}
.add-platform-delete {
  background-color: #d80d0d;
}
.add-platform-delete:hover {
  background-color: #8b0808;
}
</style>
