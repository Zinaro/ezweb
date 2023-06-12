<template>
  <div v-if="user && user.permission === 'root'" class="market-control">
    <h1>Product Information</h1>
    <div class="tabs is-toggle is-medium mt-3 pb-4">
      <ul>
        <li :class="{ 'is-active': activeTab === 'addplatform' }">
          <a 
            :class="{ active: activeTab === 'addplatform' }"
            @click="activeTab = 'addplatform'"
            ><i class="fas fa-plus-circle"></i> Add Platform</a
          >
        </li>
        <li :class="{ 'is-active': activeTab === 'addproduct' }">
          <a 
            :class="{ active: activeTab === 'addproduct' }"
            @click="activeTab = 'addproduct'"
            ><i class="fas fa-cart-plus"></i> Add Product</a
          >
        </li>
        <li :class="{ 'is-active': activeTab === 'productlist' }">
          <a 
            :class="{ active: activeTab === 'productlist' }"
            @click="activeTab = 'productlist'"
            ><i class="fas fa-th-list"></i> Product List</a
          >
        </li>
      </ul> 
    </div>
    <div class="bottom-active">
        <component :is="activeTabComponent"></component>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import MarketAddPlatform from "@/components/profile/market/MarketAddPlatform.vue";
import MarketAddProduct from "@/components/profile/market/MarketAddProduct.vue"
import MarketProductList from "@/components/profile/market/MarketProductList.vue"

export default {
  name: "MarketPage",
  components: {
    MarketAddPlatform,
    MarketAddProduct,
    MarketProductList,
  },
  data() {
    return {
      user: null,
      product: {
        productName: "",
        productImage: "",
        platforms: [
          {
            platformName: "",
            platformImage: "",
            platformUrl: "",
          },
        ],
      },
      platforms: [],
      platformName: "",
      platformUrl: "",
      platformImage: null,
      platformImageInput: null,
      activeTab: "addplatform",
    };
  },
  computed: {
    activeTabComponent() {
      switch (this.activeTab) {
        case "addplatform":
          return "MarketAddPlatform";
        case "addproduct":
          return "MarketAddProduct";
        case "productlist":
          return "MarketProductList";
        default:
          return "MarketAddPlatform";
      }
    },
  },
  created() {
    this.user = VueCookies.get("user");
    document.title = "Market Control";
  },
  methods: {
    handleProductImage(event) {
      this.product.productImage = event.target.files[0];
    },
    handlePlatformImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.platformImage = reader.result;
    };
    reader.readAsDataURL(file);
  },
    addPlatform() {
      const newPlatform = {
        platformName: this.platformName,
        platformUrl: this.platformUrl,
        platformImage: this.platformImage,
      };
      this.platforms.push(newPlatform);
      this.platformName = "";
      this.platformUrl = "";
      this.platformImage = null;
      this.$refs.platformImageInput.value = '';
    },
    removePlatform(plt) {
      const index = this.platforms.indexOf(plt);
      if (index !== -1) {
        this.platforms.splice(index, 1);
      }
    },
  },
};
</script>
<style>
.market-control {
  align-items: center;
  margin-top: 20px;
}
.market-form {
  width: 100%;
}

.product-firstland {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border: var(--border);
  box-shadow: var(--shadow);
  border-radius: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.market-control .tabs ul {
  display: flex;
  justify-content: center;
  list-style-type: none;
  padding: 0;
}

.market-control .tabs ul li a {
  text-decoration: none;
  color: var(--colortext);
}
.market-control .tabs ul li a:hover {
  color: #243447;
}
.market-control .tabs ul li a i{
  margin-right: 10px;
  padding-bottom: 5px;
}


</style>
