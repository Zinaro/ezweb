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
          <router-link class="text-decoration-none" to="/"><i class="fas fa-home"></i> Home</router-link>
        </div>
        <div class="navbar-item" @click="toggleNavbar">
          <router-link class="text-decoration-none" to="/about"> <i class="fas fa-info-circle"></i> About</router-link>
        </div>
        <div class="navbar-item" @click="toggleNavbar">
          <router-link class="text-decoration-none" to="/users"><i class="fas fa-users"></i> Users</router-link>
        </div>
        <div class="dropdown is-hoverable" @click="toggleDropdown">
          <div class="dropdown-trigger">
            <a class="text-decoration-none" aria-haspopup="true" @click.prevent="$router.push('/categories')">
              <i class="fas fa-tags"></i> Categories
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
          Bi xêr hatî,
          <a v-if="user" class="position-relative ml-2 text-decoration-none" @click="$router.push('/profile/' + user.username)">
            <i class="fas fa-user"></i> {{ user.name }}
          </a>
        </div>
        <div class="navbar-item" @click="toggleTheme">
          <a class="" style="text-decoration: none;">
  <div v-if="theme === 'dark'">
    <i class="far fa-sun"></i> Roj
  </div>
  <div v-else>
    <i class="far fa-moon"></i> Şev
  </div></a>
</div>


        <div class="navbar-item">
          <a v-if="!user" class="ml-2 text-decoration-none" @click="$router.push('/signup')"><i class="fas fa-user-plus"></i> SignUp</a>
          <a v-if="!user" class="ml-2 text-decoration-none" @click="$router.push('/login')"><i class="fas fa-sign-in-alt"></i> Login</a>
          <a v-if="user" class="text-decoration-none" @click.prevent="logout"><i class="fas fa-sign-out-alt"></i> Logout</a>
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
      theme: localStorage.getItem('theme') || 'light',
    };
  },
  mounted() {
    this.fetchCategories();
    document.documentElement.dataset.theme = this.theme;

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
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = this.theme;
      localStorage.setItem('theme', this.theme);
    },
  },

};
</script>




<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.3/css/bulma.min.css");
@import url("https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css");
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
@import url("@/assets/css/theme.scss");

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  padding-top: 75px;
  min-height: 100vh;
  background-color: var(--colorbg);
  color: var(--colortext);
}

.navbar {
  position: fixed;
  padding-bottom: 10px !important;
  top: 0;
  left: 0;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: var(--colorbg);
  color: var(--colortext);
  border-bottom: 1px solid rgba(128, 128, 128, 0.336);
}

.navbar-item {
  color: var(--colortext);
  text-decoration: none;
}

.navbar-burger span {
  color: var(--colortext);
}

.dropdown-trigger {
  text-align: center;
  padding-top: 13px;
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
    background-color: var(--colorbg);
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
  
}
@media screen and (max-width: 1028px) {
  .navbar-menu {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: var(--colorbg);
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
  
}
</style>


