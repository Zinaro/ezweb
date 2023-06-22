<template>
  <div v-if="user && user.permission === 'root'" class="market-product-list">
    <h1>Product List</h1>
    <div>
      <ul>
        <li
          v-for="product in products"
          :key="product._id"
          class="product-list-row"
        >
          <div class="product-image-list" v-show="product.productImage">
            <img
              :src="
                require(`@/assets/images/productimages/${product.productImage}`)
              "
              :alt="product.productName"
            />
            <a @click="deleteProduct(product)"><i class="fas fa-trash del-icon"></i></a>
          </div>
          <div class="">
            <h2>
              <span v-if="product.productPrice" style="color: darkgreen; !important">{{ product.productPrice.slice(0, 20) }} </span>
            {{ product.productName }}</h2>
          </div>
          <ul>
            <li
              v-for="platform in product.platforms"
              :key="platform._id"
              class="platform-list"
            >
              <div class="product-image-preview" v-show="product.productImage">
                <img v-if="platform.img" :src="require(`@/assets/images/pimages/${platform.img}`)"
                  :alt="platform.name"
                  style="max-height: 30px" /> <img v-else :alt="platform.name" />
              </div>
              <p>URL:</p>
              <a :href="platform.url" target="_blank">{{ platform.url }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
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
      products: {},
    };
  },
  created() {
    this.user = VueCookies.get("user");
    document.title = "Market Product List";
  },
  mounted() {
    this.getProducts();
  },
  methods: {
    async getProducts() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_BASE_URL}/products`);
        this.products = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async deleteProduct(product) {
      await axios.delete(`${process.env.VUE_APP_BASE_URL}/product/delete/${product._id}`);
      this.getProducts();
    },
  },
};
</script>
<style>
.market-product-list {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}
.product-list-row {
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 20px;
  box-shadow: var(--shadow);
  padding: 10px;
}
.platform-list {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.platform-list p {
  margin-top: 8px;
}
.platform-list a {
  text-align: start;
}
.platform-list > :first-child {
  min-width: 150px;
}
.product-image-list {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
}
.product-image-list img {
  border-radius: 10px;
  max-height: 200px;
}
.product-image-list a {
  margin-bottom: 120px;
}
.product-image-list i {
  font-size: 48px;
  padding: 10px;
}
.del-icon {
  color: darkred;
}
.del-icon:hover {
  color: red;
}
@media (max-width: 768px) {
  .market-product-list {
    max-width: 80% !important;
    margin-bottom: 20px;
  }
}
</style>
