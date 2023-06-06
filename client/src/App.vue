<template>
  <nav role="navigation" aria-label="main navigation" class="navbar">
    <div class="navbar-brand">
      <a class="navbar-item" href="http://localhost:8080">
        <img src="@/assets/logo.png" width="112" height="28" />
      </a>
      <div class="navbar-burger burger" :class="{ 'is-active': navbarOpen }" @click="toggleNavbar">
  <span :class="{ 'is-active': !navbarOpen }"></span>
  <span :class="{ 'is-active': !navbarOpen }"></span>
  <span :class="{ 'is-active': !navbarOpen }"></span>
</div>

    </div>
    <div class="navbar-menu" :class="{ 'is-active': !navbarOpen }">
      <div class="navbar-end">
        <div class="navbar-item" @click="toggleNavbar">
          <router-link class="text-decoration-none" to="/">Home</router-link>
        </div>
        <div class="navbar-item" @click="toggleNavbar">
          <router-link class="text-decoration-none" to="/about">About</router-link>
        </div>
        <div class="navbar-item" @click="toggleNavbar">
          <router-link class="text-decoration-none" to="/users">Users</router-link>
        </div>
        <div class="dropdown is-hoverable" @click="toggleDropdown">
          <div class="dropdown-trigger">
            <a class="text-decoration-none" aria-haspopup="true" @click.prevent="$router.push('/categories')">
              Categories
            </a>
          </div>
          <div class="dropdown-menu" :class="{ 'is-active': showDropdown }">
            <div class="dropdown-content">
              <a
                v-for="category in categories"
                :key="category._id"
                class="dropdown-item"
                @click="goToCategory(category)"
              >
                {{ category.name }}
              </a>
            </div>
          </div>
        </div>
        <div v-if="user" class="navbar-item">
          Bi xer hati,
          <a v-if="user" class="position-relative ml-2 text-decoration-none" @click="$router.push('/profile/' + user.username)">
            {{ user.name }}
          </a>
        </div>
        <div class="navbar-item">
          <a v-if="!user" class="ml-2 text-decoration-none" @click="$router.push('/signup')">SignUp</a>
          <a v-if="!user" class="ml-2 text-decoration-none" @click="$router.push('/login')">Login</a>
          <a v-if="user" class="text-decoration-none" @click.prevent="logout">Logout</a>
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
    toggleNavbar() {
      this.navbarOpen = !this.navbarOpen;
    },
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
    logout() {
      VueCookies.remove("user");
      this.user = null;
      window.location.href = "/";
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
@import url("https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css");

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-top: 75px;
  background-color: rgba(0, 238, 255, 0.1);
}

.navbar {
  position: fixed;
  padding-bottom: 10px !important;
  top: 0;
  left: 0;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-item {
  color: #333;
  text-decoration: none;
}

.dropdown-trigger {
  text-align: center;
  padding-top: 9px;
}

.dropdown-menu {
  display: none;
}

.dropdown-menu.is-active {
  display: block;
}

@media screen and (max-width: 768px) {
  .navbar-menu {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: #fff;
    padding: 10px;
  }

  .navbar-end {
    margin-top: 10px;
  }

  .navbar-item {
    display: block;
    margin-bottom: 10px;
  }

  .dropdown.is-hoverable .dropdown-menu {
    position: static;
    display: none;
  }
  
  .navbar-burger {
    display: block;
  }
  
  .navbar-menu.is-active {
    display: none;
  }
  
  .navbar-menu.is-active + .navbar-burger span {
    background-color: #000;
  }
  
  .navbar-menu.is-active + .navbar-burger span:after,
  .navbar-menu.is-active + .navbar-burger span:before {
    background-color: #000;
    top: 0;
  }
}
@media screen and (max-width: 1028px) {
  .navbar-menu {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: #fff;
    padding: 10px;
  }

  .navbar-end {
    margin-top: 10px;
  }

  .navbar-item {
    display: block;
    margin-bottom: 10px;
  }

  .dropdown.is-hoverable .dropdown-menu {
    position: static;
    display: none;
  }
  
  .navbar-burger {
    display: block;
  }
  
  .navbar-menu.is-active {
    display: none;
  }
  
  .navbar-menu.is-active + .navbar-burger span {
    background-color: #000;
  }
  
  .navbar-menu.is-active + .navbar-burger span:after,
  .navbar-menu.is-active + .navbar-burger span:before {
    background-color: #000;
    top: 0;
  }
}
</style>


