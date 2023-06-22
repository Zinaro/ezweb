<template>
  <div class="add-category-container">
    <h1 class="add-category-title">Categories</h1>
    <ul class="add-category-list">
      <li v-for="category in categories" :key="category.id" class="add-category-item">
        <div class="add-category-name">{{ category.name }}</div>
        <button @click="deleteCategory(category)" class="add-category-delete">Delete</button>
        <button @click="editCategory(category)" class="add-category-update">Update</button>
        <div v-if="category.showDeleteConfirmation" class="dialog">
          <v-dialog max-width="500">
            <v-card>
              <p>Are you sure you want to delete this category?<br>{{ category.name }}</p>
              <v-card-actions class="custom-actions">
                <v-btn
                  class="custom-button na"
                  text
                  @click="cancelDelete(category)"
                  >NA</v-btn
                >
                <v-btn
                  class="custom-button ere"
                  text
                  @click="confirmDelete(category)"
                  >ERÊ</v-btn
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
          <form @submit.prevent="updateCategory" class="add-category-form">
        <input type="text" v-model="editCategoryName" placeholder="New Category Name" class="add-category-input" />
        <button type="submit" class="add-category-submit">Save</button>
        <button class="add-category-cancel" @click="cancelCategory">Cancel</button>
      </form>
        </v-card>
      </v-dialog>
    </div>
    
    <div v-if="user && showEditForm == false" class="add-form-section">
      <form @submit.prevent="addCategory" class="add-category-form">
        <h1>Kategorî Tevlî Bike</h1>
        <input type="text" v-model="categoryName" placeholder="New Category Name" class="add-category-input" />
        <button type="submit" class="add-category-submit">Add Category</button>
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
    document.title = 'Kategorî Tevlî Bike';
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_BASE_URL}/category`);
        this.categories = response.data.map(category => ({
      ...category,
      showDeleteConfirmation: false
    }));
      } catch (error) {
        console.log(error);
      }
    },
    async addCategory() {
      if (this.categories.some(category => category.name === this.categoryName)) {
    alert('This category already exists!');
    return;
  }
      try {
        const response = await axios.post(`${process.env.VUE_APP_BASE_URL}/category`, {
          name: this.categoryName,
        });
        this.categories.push(response.data);
        this.categoryName = '';
      } catch (error) {
        console.log(error);
      }
    },
    async deleteCategory(category) {
      category.showDeleteConfirmation = true;
    },
    async confirmDelete(category) {
      const categoryId = category._id;
      try {
        await axios.delete(`${process.env.VUE_APP_BASE_URL}/category/${categoryId}`);
        this.categories = this.categories.filter((category) => category.id !== categoryId);
        this.fetchCategories();
        category.showDeleteConfirmation = false;
      } catch (error) {
        console.log(error);
      }
      
    },
    cancelDelete(category) {
      category.showDeleteConfirmation = false;
    },
    editCategory(category) {
      this.showEditForm = true;
      this.editCategoryId = category._id;
      this.editCategoryName = category.name;
    },
    async updateCategory() {
      try {
        await axios.put(`${process.env.VUE_APP_BASE_URL}/category/${this.editCategoryId}`, {
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
    cancelCategory() {
      this.showEditForm = !this.showEditForm;
    }
  },
};
</script>
<style>
.add-category-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 5px;
  align-items: center;
}

.add-category-title {
  text-align: center;
}

.add-category-list {
  list-style-type: none;
  padding: 0;
}

.add-category-item {
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  box-shadow: var(--shadow);
  padding-left: 7px;
  padding-top: 7px;
  border-radius: 5px;
}

.add-category-name {
  margin-right: 10px;
  min-width: 100px;
  display: flex;
  align-items: flex-start;
}

.add-category-item button {
  margin-left: 8px;
  margin-right: 8px;
}

.add-category-form {
  display: flex;
  align-items: center;
}


.add-form-section form{
  width: 100%;
  margin-bottom: 50px;
}
.add-category-input {
  padding: 5px;
  border-radius: 3px;
}
.add-category-submit {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.add-category-cancel {
  padding: 5px 10px;
  background-color: #d80d0d;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.add-category-cancel:hover {
  background-color: #8b0808;
}
.add-category-delete {
  background-color: #d80d0d;
}
.add-category-delete:hover {
  background-color: #8b0808;
}
@media (max-width: 767.98px) {
  .add-category-container {
    max-width: 100%;
    padding: 10px;
  }
  
  .add-category-item {

  }
  
  .add-category-item button {
    margin-top: 10px;
    margin-left: 0;
    flex-basis: 100%;
  }
  
  .add-category-input,
  .add-category-submit {
    width: 100%;
  }
  .add-category-input,
  .add-category-cancel {
    width: 100%;
  }
}
@media (max-width: 991.98px) {
  .add-category-container {
    max-width: 100%;
    padding: 10px;
  }
  
  .add-category-item {

  }
  
  .add-category-item button {
    margin-top: 10px;
    margin-left: 0;
    flex-basis: 100%;
  }
  
  .add-category-input,
  .add-category-submit {
    width: 100%;
  }
  .add-category-input,
  .add-category-cancel {
    width: 100%;
  }
}
</style>
