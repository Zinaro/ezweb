<template>
  <div class="container">
    <h1 class="pt-3">Categories</h1>
    <div class="tabs is-toggle is-medium center">
      <ul>
        <li v-for="category in categories" :key="category._id" :class="{ 'is-active': category === activeCategory }">
          <a @click="selectCategory(category)">{{ category.name }}</a>
        </li>
      </ul>
    </div>
    <Category v-if="activeCategory != null" :catID="activeCategory._id" :key="activeCategory._id" />
  </div>
</template>

<script>
import axios from 'axios';
import Category from '@/components/Category.vue'

export default {
  name: "CategoriesPage",
  components: {
    Category,
  },
  data() {
    return {
      categories: [],
      activeCategory: null
    }
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_BASE_URL}/category`);
        this.categories = response.data;
        this.activeCategory = this.categories[0];
      } catch (error) {
        console.log(error);
      }
    },
    selectCategory(category) {
      this.activeCategory = category;
    },
  }
};
</script>

<style>
.tabs {
  padding: 15px;
}
.tabs ul li {
}
.tabs ul li:hover{
  color: #243447;
}

@media screen and (max-width: 768px) {
  .tabs ul {
    display: flex;
    flex-direction: column;
  }

  .tabs ul li {
    width: 100%;
  }

}
</style>
