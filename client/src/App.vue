<template>
    <nav class="navbar">
    <div class="navbar-menu" :class="{ 'is-active': navbarOpen }">
      <div class="navbar-start">
        <a class="navbar-item button" @click="$router.push('/')">Home</a>
        <a class="navbar-item button" @click="$router.push('/about')">About</a>
        <a class="navbar-item button" @click="$router.push('/users')">Users</a>
        <div class="navbar-item dropdown is-hoverable">
          <button class="" @click="toggleDropdown">
            Categories
            <span class="icon">
              <i class="fas fa-angle-down"></i>
            </span>
          </button>
          <div class="navbar-dropdown" v-show="showDropdown">
            <a v-for="category in categories" :key="category._id"
              class="navbar-item" @click="goToCategory(category)">
              {{ category.name }}
            </a>
          </div>
        </div>
        <div v-if="user" class="navbar-item button">
          Bi xer hati,<a
            v-if="user"
            class="navbar-item button"
            @click="$router.push('/profile/' + user.username)"
          >
            {{ user.name }}
          </a>
        </div>
      </div>
      <div class="navbar-end">
        <div class="navbar-item button">
          <a v-if="!user" class="button button" @click="$router.push('/signup')"
            >Sign up</a
          >
          <a v-if="!user" class="button button" @click="$router.push('/login')"
            >Login</a
          >
          <button v-if="user" class="button button" @click.prevent="logout">
            Log out
          </button>
        </div>
      </div>
    </div>
  </nav>
  <router-view />
</template>

<script>
import VueCookies from "vue-cookies";
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      navbarOpen: false,
      user: VueCookies.get("user"),
      categories: [],
      showDropdown: false,
    };
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    async fetchCategories() {
      try {
        const response = await axios.get("http://localhost:3000/category");
        this.categories = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    toggleNavbar() {
      this.navbarOpen = !this.navbarOpen;
    },
    logout() {
      VueCookies.remove("user");
      this.user = null;
      window.location.href = '/';
    },
    goToCategory(category) {
    this.$router.push(`/category/${category.name}-${category._id}`);
    window.location.href = `/category/${category.name}-${category._id}`;
  },
  },
};
</script>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.3/css/bulma.min.css");

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 52px;
  background-color: rgba(0, 238, 255, 0.1);
}

.navbar-dropdown {
  position: absolute;
  top: 100%;
  z-index: 20;
  display: none;
  min-width: 10rem;
  padding: 0.5rem 0;
  font-size: 1rem;
  text-align: left;
  list-style: none;
  background-clip: padding-box;
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
}


.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-burger {
  border: none;
  background-color: transparent;
  padding: 0.5rem;
}

.navbar-burger span {
  display: block;
  width: 1.5rem;
  height: 0.2rem;
  margin: 0.3rem;
  background-color: #333;
  transition: transform 0.3s ease-in-out;
}

.navbar-burger span:first-child {
  transform: rotate(45deg);
}

.navbar-burger span:nth-child(2) {
  transform: scaleX(0);
}

.navbar-burger span:last-child {
  transform: rotate(-45deg);
}

.navbar-menu.is-active {
  display: block;
}

.navbar-start {
  margin-right: auto;
}

.navbar-item {
  padding: 0.5rem 1rem;
  color: #333;
  text-decoration: none;
}

.navbar-item:hover {
  background-color: #3e8e41;
}

.button,
.my-button {
  margin: 10px 0;
  margin-left: 5px;
  margin-right: 5px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
}

.button:hover,
.my-button:hover {
  background-color: #3e8e41;
  color: darkblue;
}

.buttons .button {
  margin-left: 0.5rem;
}
</style>
