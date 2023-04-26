<template>
  <div class="add-post">
    <h1>Şandî Tevlî bike</h1>

    <div v-if="user" class="form form-section">
      <div class="form-group">
        <label for="posttitle" class="label">Sernav:</label>
        <input
          type="text"
          id="posttitle"
          v-model="posttitle"
          class="input"
          required
        />
      </div>
      <div class="form-group">
        <label for="postcategory" class="label">Kategori:</label>
        <select id="postcategory" v-model="postcategory" class="input" required>
          <option value="">Kategori Hilbijere</option>
          <option
            v-for="category in categories" :key="category._id" :value="category._id">
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="form-group form-postcontent">
        <label for="postcontent" class="label">Naverok:</label>
        <div ref="editor" :style="{ 'min-height': '150px' }"></div>
      </div>
      <button type="submit" class="button is-primary" @click.prevent="addItem">
        Tevlî bike
      </button>
    </div>
    <div v-if="showMessage" class="success-message">Şandî Tevlî bû</div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import axios from "axios";
import "quill/dist/quill.snow.css";
import Quill from "quill";

export default {
  name: "AddPostPage",
  data() {
    return {
      user: null,
      posttitle: "",
      postcategory: "",
      postcontent: "",
      postdate: null,
      showMessage: false,
      categories: [],
    };
  },
  created() {
    this.user = VueCookies.get("user");
  },
  mounted() {
    const toolbarOptions = [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ["clean"],
    ];
    const editor = new Quill(this.$refs.editor, {
      modules: {
        toolbar: toolbarOptions,
      }, theme: "snow",});
    editor.on("text-change", () => {
      this.postcontent = editor.root.innerHTML;
    });

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
    async addItem() {
      const item = {
        postTitle: this.posttitle,
        postCategory: this.postcategory,
        postContent: this.postcontent,
        postDate: new Date().toLocaleString("tr-TR"),
        postAutorId: this.user._id,
        postAutorName: this.user.name,
      };
      try {
        const response = await axios.post("http://localhost:3000", item);
        const postId = response.data._id;
        const categoryResponse = await axios.put(`http://localhost:3000/category/${this.postcategory}/addpost`, { postId });
        console.log(categoryResponse.data);
        const itemsResponse = await axios.get("http://localhost:3000");
        this.items = itemsResponse.data;
        this.clearInputs();
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 3000);
      } catch (error) {
        console.error(error);
        alert("hi zinar, you have an error");
      }
    },
    clearInputs() {
      this.posttitle = "";
      this.postcontent = "";
      const editor = new Quill(this.$refs.editor, {
        modules: {
          toolbar: true,
        },
        theme: "snow",
      });
      editor.setText("");
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

.add-post {
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 100px;
}
.form-section {
  max-width: 600px;
  margin: 0 auto;
}
</style>
