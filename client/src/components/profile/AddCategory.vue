<template>
  <div v-if="user && user.permission === 'root'" class="add-category">
    <h1>Categories</h1>
      <ul>
        <li v-for="category in categories" :key="category.id">
          {{ category.name }}
          <button @click="deleteCategory(category._id)">Delete</button>
        <button @click="editCategory(category)">Update</button>
        </li>
      </ul>
      <div v-if="showEditForm" class="form form-section">
      <form @submit.prevent="updateCategory">
        <input type="text" v-model="editCategoryName" placeholder="Nave Kategori ye" />
        <button type="submit">Save</button>
      </form>
    </div>
    <div v-if="user" class="form form-section">
      <form @submit.prevent="addCategory">
        <input type="text" v-model="categoryName" placeholder="Nave Kategori ye" />
        <button type="submit">Kategori Tevlî bû</button>
      </form>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import axios from "axios";

export default {
  name: "AddCategoryPage",
  data() {
    return {
      user: null,
      categories: [],
      categoryName: "",
      showEditForm: false,
      editCategoryId: null,
      editCategoryName: '',
    };
  },
  created() {
    this.user = VueCookies.get("user");
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:3000/category');
        this.categories = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async addCategory() {
      try {
        const response = await axios.post('http://localhost:3000/category', {
          name: this.categoryName,
        });
        this.categories.push(response.data);
        this.categoryName = '';
      } catch (error) {
        console.log(error);
      }
    },
    async deleteCategory(categoryId) {
      try {
        await axios.delete(`http://localhost:3000/category/${categoryId}`);
        this.categories = this.categories.filter((category) => category.id !== categoryId);
        this.fetchCategories();
      } catch (error) {
        console.log(error);
      }
    },
    editCategory(category) {
      this.showEditForm = true;
      this.editCategoryId = category._id;
      this.editCategoryName = category.name;
    },
    async updateCategory() {
      try {
        await axios.put(`http://localhost:3000/category/${this.editCategoryId}`, {
          name: this.editCategoryName,
        });
        this.showEditForm = false;
        this.editCategoryId = null;
        this.editCategoryName = '';
        this.fetchCategories();
      } catch (error) {
        console.log(error);
      }
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

.form-section {
  max-width: 600px;
  margin: 0 auto;
}
</style>
