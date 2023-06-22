<template>
  <div class="market-page">
  <div class='market-top'><h1>Products List</h1></div>
    <div class="product-cards">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img
          :src="
            require(`@/assets/images/productimages/${product.productImage}`)
          "
          alt="Product Image"
          class="product-image"
        />
        <div class="product-info">
          <div class="product-name">
            <div v-if="product.productPrice" class="price-overlay">
              <span class="product-price"> {{ product.productPrice.slice(0, 20) }}</span>
            </div>
            <h1>{{ product.productName }}</h1>
          </div>
          <div class="platforms">
            <div
              v-for="platform in product.platforms"
              :key="platform.id"
              class="platform"
            >
              <div class="platform-image">
                <a :href="platform.url" target="_blank"
                  ><img
                    v-if="platform.img"
                    :src="require(`@/assets/images/pimages/${platform.img}`)"
                    :alt="platform.name" />
                    <img v-else :alt="platform.name" />
                  </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>
<script>
import VueCookies from "vue-cookies";
import axios from "axios";
import Footer from '@/components/Footer.vue';

export default {
  name: "MarketPage",
  data() {
    return {
      user: null,
      products: {},
    };
  },
  components:  {
  Footer,
  },
  created() {
    VueCookies.get("user");
    this.getProducts();
  },
  methods: {
    async getProducts() {
      const response = await axios.get(`${process.env.VUE_APP_BASE_URL}/products`);
      this.products = response.data.reverse();
    },
  },
};
</script>

<style>
.market-page {
  margin: 0 auto;
}
.product-cards {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 auto;
  margin-top: 10px;
  padding: 40px;
}

.product-card {
  width: calc(50% - 20px);
  border-radius: 10px;
  border: var(--border);
  box-shadow: var(--shadow);
  margin-bottom: 60px;
}

.product-image {
  width: 100%;
  border-radius: 10px 10px 0 0;
  max-height: 500px;
  height: auto;
}

.product-info {
  padding: 10px;
}

.product-name {
  font-weight: bold;
}

.product-description {
  margin-top: 10px;
}
.platforms {
  display: flex;
  flex-wrap: wrap;
}

.platform-image img {
  max-height: 30px;
}
.platform {
  padding: 10px;
}
.price-overlay {
  position: absolute;
  border-radius: 0 30px 0 0;
  background-color: rgba(255, 255, 255, 0.555);
  color: darkgreen;
  margin-top: -68px;
  padding: 8px;
  margin-left: -10px;
}

.product-price {
  font-weight: bold;
  font-size: 28px;
  margin: 10px !important;
}
.market-top {
 margin-top: 30px;  
}

@media (max-width: 767.98px) {
  .product-card {
    width: calc(100% - 20px);
  }
  .platforms {
    display: flex;
    flex-direction: column;
  }
}
@media (max-width: 991.98px) {
  .product-card {
    width: calc(100% - 20px);
  }
}
</style>
