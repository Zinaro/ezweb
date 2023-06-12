<template>
  <div class="market-page">MARKET PAGE</div>
   <div class="product-cards">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img :src="require(`@/assets/images/productimages/${product.productImage}`)" alt="Product Image" class="product-image">
        <div class="product-info">
          <h3 class="product-name">{{ product.productName }}</h3>
            <div class='platforms'>
          <div v-for="platform in product.platforms" :key="platform.id" class="platform">
             <div class="platform-image"><a :href="platform.url" target="_blank"><img :src="require(`@/assets/images/pimages/${platform.img}`)" :alt="platform.name"></a></div>
          </div>
         </div>
        </div>
      </div>
    </div>
</template>
<script>
import VueCookies from "vue-cookies";
import axios from "axios";

export default {
  name: 'MarketPage',
  data() {
  return {
  user: null,
  products: {},
}
},
  created() {
   VueCookies.get("user");
   this.getProducts();
},
methods: {
  async getProducts() {
  const response = await axios.get('http://localhost:3000/products');
  this.products = response.data;
  console.log(this.products);
},
},
}
</script>

<style>

.market-page {
  margin: 0 auto;
  padding: 20px;

}
.product-cards {
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
  border-radius: 10px;
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
  flex-direction: row;
}

.platform-image img {
  max-height: 30px;
}
.platform {
 padding: 10px; 
}

</style>




