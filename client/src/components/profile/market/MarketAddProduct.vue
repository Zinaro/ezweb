<template>
  <div v-if="user && user.permission === 'root'" class="market-add-product">
    <h1>Add Product</h1>
    <form @submit.prevent="addProduct" class="market-form mb-4">
      <div class="platform-row">
        <div class="productName">
          <label for="productName">Product Name:</label>
          <input type="text" id="productName" v-model="productName" required />
        </div>
        <div class="productImage">
          <label for="productImage">Product Image:</label>
          <input
            type="file"
            id="productImage"
            @change="handleProductImage"
            ref="fileInput"
            required
          />
          <div class="product-image-preview" v-show="thumbImage">
            <img :src="thumbImage" alt="Thumbnail" />
          </div>
        </div>
        <div class="platforms-selected">
          <label for="platforms">Platform:</label>
          <select
            id="platforms"
            v-model="selectedPlatformId"
            class="form-select"
          >
            <option value="">Platform Hilbijere</option>
            <option
              v-for="platform in platforms"
              :key="platform._id"
              :value="platform._id"
            >
              {{ platform.platformName }}
            </option>
          </select>
        </div>

        <div v-if="selectedPlatformId" class="selected-platform">
          <h3>Selected Platform</h3>
          <div class="selected-platform-name">
            <p>{{ getPlatformName(selectedPlatformId) }}</p>
            <p>URL:</p>
            <a @click="addPlatform"><i class="fas fa-plus-circle"></i></a>
          </div>
          <div class="selected-platform-row">
            <img
              v-if="getPlatformImage(selectedPlatformId)"
              :src="getPlatformImage(selectedPlatformId)"
              class="platform-image"
              alt="Platform Image"
            />
            <input
              type="text"
              id="platformUrl"
              placeholder="https://example.com/"
              v-model="platformUrl"
              required
            />
          </div>
        </div>
        <div
          v-for="(platform, index) in platformList"
          :key="index"
          class="selected-platform-list"
        >
          <div class="selected-platform-row">
            <div
              class="selected-platform-row"
              style="justify-content: space-between; min-width: 200px"
            >
              <p>{{ platform.name }}</p>
              <img
                v-if="getPlatformImage(platform.id)"
                :src="getPlatformImage(platform.id)"
                class="platform-image"
                alt="Platform Image"
                style="max-height: 30px"
              />
            </div>
            <div class="selected-platform-row mt-2">
              <a
                @click="deletePlatform(index)"
                style="margin-top: -13px; margin-bottom: 15px"
                ><i class="fas fa-trash"></i
              ></a>
            </div>
          </div>
          <div class="selected-platform-url">
            URL: <a :href="platform.url" target="_blank">{{ platform.url }}</a>
          </div>
        </div>
      </div>

      <button type="submit" class="productSave">Save Product</button>
    </form>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import axios from "axios";

export default {
  name: "MarketAddProductPage",
  data() {
    return {
      user: null,
      platforms: [],
      platformList: [],
      selectedPlatformId: "",
      platformUrl: "",
      productName: "",
      productImage: "",
      thumbImage: null,
      previewUrl: null,
      fileInput: null,
    };
  },
  created() {
    this.user = VueCookies.get("user");
    document.title = "Market Add Product";
  },
  computed: {
    selectedPlatform() {
      return (
        this.platforms.find(
          (platform) => platform._id === this.selectedPlatformId
        ) || {}
      );
    },
  },
  mounted() {
    this.getPlatforms();
  },
  methods: {
    async addProduct() {
      if (this.previewUrl) {
        await this.uploadImage();
      }
      if (this.platformList.length === 0) {
        alert("Platform list is empty. Please add platforms.");
        return;
      }
      const hasEmptyUrl = this.platformList.some((platform) => !platform.url);
  if (hasEmptyUrl) {
    alert("Please provide a URL for all platforms.");
    return;
  }
      const platforms = this.platformList.map((platform) => {
        return {
          id: platform.id,
          url: platform.url,
          name: platform.name,
          img: platform.img
        };
      });
      const requestData = {
        productName: this.productName,
        productImage: this.productImage,
        platforms: platforms,
      };
      try {
        await axios.post("http://localhost:3000/product", requestData);
        this.clearInputs();
      } catch (error) {
        console.error(error);
      }
    },
    clearInputs() {
      this.platformList = [];
      this.selectedPlatformId = "";
      this.platformUrl = "";
      this.productName = "";
      this.productImage = "";
      this.thumbImage = null;
      this.previewUrl = null;
      this.$refs.fileInput.value = "";
    },
    async uploadImage() {
      const formData = new FormData();
      formData.append("image", this.previewUrl);
      try {
        const response = await axios.post(
          `http://localhost:3000/product/image/upload`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        this.productImage = response.data.imageUrl;
      } catch (error) {
        console.error(error);
      }
    },
    async getPlatforms() {
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
    getPlatformName(platformId) {
      const platform = this.platforms.find((p) => p._id === platformId);
      return platform ? platform.platformName : "";
    },
    getPlatformImage(platformId) {
      const platform = this.platforms.find((p) => p._id === platformId);
      return platform
        ? require(`@/assets/images/pimages/${platform.platformImage}`)
        : "";
    },
    getPlatformImg(platformId) {
      const platform = this.platforms.find((p) => p._id === platformId);
      return platform
        ? platform.platformImage
        : "";
    },
    addPlatform() {
      const platform = {
        url: this.platformUrl,
        id: this.selectedPlatformId,
        name: this.getPlatformName(this.selectedPlatformId),
        img: this.getPlatformImg(this.selectedPlatformId),
      };
      this.platformList.push(platform);
      this.selectedPlatformId = "";
      this.platformUrl = "";
    },
    deletePlatform(index) {
      this.platformList.splice(index, 1);
    },
    handleProductImage(e) {
      this.previewUrl = e.target.files[0];
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.thumbImage = reader.result;
      };
      reader.readAsDataURL(file);
    },
  },
};
</script>
<style>
.platform-row {
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 20px;
}
.market-add-product {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}
.market-add-product form {
  box-shadow: none;
}
.platforms-selected {
  margin-top: 30px !important;
  padding: 10px;
  border-radius: 5px;
  box-shadow: var(--shadow);
}
.platforms-selected select {
  background-color: var(--colorbg);
  color: var(--colortext);
}
.platforms-selected select .form-select {
  color: var(--colortext) !important;
}
.selected-platform {
  margin-top: 30px !important;
  padding: 10px;
  border-radius: 5px;
  box-shadow: var(--shadow);
}
.productImage {
  margin-top: 30px !important;
  padding: 10px;
  border-radius: 5px;
  box-shadow: var(--shadow);
}
.product-image-preview img {
  margin-top: 10px;
  border-radius: 5px;
}
.productName {
  margin-top: 30px !important;
  padding: 10px;
  border-radius: 5px;
  box-shadow: var(--shadow);
}
.productSave {
  margin-top: 30px !important;
  box-shadow: var(--shadow);
}
.selected-platform-name {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.selected-platform-name a {
  margin-top: -13px;
  margin-bottom: 15px;
}
.selected-platform-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.selected-platform-row input {
  margin-left: 20px;
}
.market-add-product form div {
  margin: 0;
}
.selected-platform-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: var(--shadow);
  border-radius: 5px;
  padding: 10px;
  margin-top: 30px !important;
}
.selected-platform-url {
  text-align: start;
}
</style>
