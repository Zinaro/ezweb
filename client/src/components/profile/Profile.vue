<template>
  <div v-if="user" class="profile">
    <div class="settings">
  <div @click="$router.push('/')">
    <i class="fas fa-home"></i>
    Rûpela Sereke
  </div>
  <div @click="$router.push('/' + user.username)">
    <i class="fas fa-user"></i>
    Profîla min
  </div>
  <div v-if="user && user.permission === 'root'" :class="{ active: activeTab === 'add-category' }" @click="activeTab = 'add-category'">
    <i class="fas fa-plus"></i>
    Kategorî Tevlî Bike
  </div>
  <div v-if="user && user.permission === 'root'" :class="{ active: activeTab === 'market-control' }" @click="activeTab = 'market-control'">
    <i class="fas fa-shopping-cart"></i>
    Market Control
  </div>
  <div v-if="(user && user.permission === 'root') || user.permission === 'admin'" :class="{ active: activeTab === 'user-control' }" @click="activeTab = 'user-control'">
    <i class="fas fa-users"></i>
    User Control
  </div>
  <div v-if="(user && user.permission === 'root') || user.permission === 'admin' || user.permission === 'editor'" :class="{ active: activeTab === 'post-control' }" @click="activeTab = 'post-control'">
    <i class="fas fa-edit"></i>
    Post Control
  </div>
  <div :class="{ active: activeTab === 'settings' }" @click="activeTab = 'settings'">
    <i class="fas fa-cog"></i>
    Sazkarî
  </div>
  <div v-if="(user && user.permission === 'root') || user.permission === 'admin' || user.permission === 'editor' || user.permission === 'niviskar'" :class="{ active: activeTab === 'add-post' }" @click="activeTab = 'add-post'">
    <i class="fas fa-plus"></i>
    Şandî Tevlî Bike
  </div>
</div>

    <div class="content-section">
      <div class="top-section pt-2">
        <div class="profile-row">
          <div class="profile-image">
            <img
              v-if="user.profileImage"
              :src="require(`@/assets/images/${user.profileImage}`)"
              alt="Wêneya Profîlê"
              class="profile-image"
            />
            <img
              v-else
              src="../../assets/images/default.jpg"
              alt="Wêneya Profîlê"
              class="profile-image"
            />
          </div>
          <div class="profile-info">
            <h2>{{ user.name }}</h2>
            <p>{{ user.mail }}</p>
          </div>
        </div>
        <div class="tabs is-toggle is-medium">
          <ul>
            <li
              v-if="
                user.permission === 'root' ||
                user.permission === 'admin' ||
                user.permission === 'editor' ||
                user.permission === 'niviskar'
              "
              :class="{ 'is-active': activeTab === 'my-posts' }"
            >
              <a @click="activeTab = 'my-posts'">
                <span :class="{ active: activeTab === 'my-posts' }"
                  ><i class="fas fa-pencil-alt"></i> Şandiyên min</span
                >
              </a>
            </li>
            <li :class="{ 'is-active': activeTab === 'following' }">
              <a @click="activeTab = 'following'">
                <span :class="{ active: activeTab === 'following' }"
                  ><i class="fas fa-user-friends"></i> Dişopîne</span
                >
              </a>
            </li>
            <li
              v-if="
                user.permission === 'root' ||
                user.permission === 'admin' ||
                user.permission === 'editor' ||
                user.permission === 'niviskar'
              "
              :class="{ 'is-active': activeTab === 'followers' }"
            >
              <a @click="activeTab = 'followers'">
                <span><i class="fas fa-users"></i> Şopîner</span>
              </a>
            </li>
            <li :class="{ 'is-active': activeTab === 'favorites' }">
              <a @click="activeTab = 'favorites'">
                <span><i class="fas fa-heart"></i> Hezkirinên min</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="bottom-section">
        <component :is="activeTabComponent"></component>
      </div>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import MyPosts from "../profile/MyPosts.vue";
import Following from "../profile/Following.vue";
import Followers from "../profile/Followers.vue";
import Favorite from "../profile/Favorite.vue";
import AddPost from "../profile/AddPost.vue";
import Settings from "../profile/Settings.vue";
import AddCategory from "../profile/AddCategory.vue";
import UserControl from "../profile/UserControl.vue";
import PostControl from "../profile/PostControl.vue";
import MarketControl  from "@/components/profile/market/MarketControl.vue"
import axios from "axios";

export default {
  name: "ProfilePage",
  data() {
    return {
      user: null,
      activeTab: "my-posts",
    };
  },
  computed: {
    activeTabComponent() {
      switch (this.activeTab) {
        case "my-posts":
          return "MyPosts";
        case "following":
          return "Following";
        case "followers":
          return "Followers";
        case "favorites":
          return "Favorite";
        case "add-post":
          return "AddPost";
        case "add-category":
          return "AddCategory";
        case "market-control":
          return "MarketControl";
        case "user-control":
          return "UserControl";
        case "post-control":
          return "PostControl";
        case "settings":
          return "Settings";
        default:
          return this.user.permission == "user" ? "Favorite" : "MyPosts";
      }
    },
  },
  created() {
    this.user = VueCookies.get("user");
    document.title = this.user.name;
  },
  mounted() {
    axios
      .get(`http://localhost:3000/users/${this.user._id}`)
      .then((response) => {
        this.user.profileImage = response.data.profileImage;
      });
  },
  components: {
    MyPosts,
    Following,
    Followers,
    Favorite,
    AddPost,
    AddCategory,
    MarketControl,
    UserControl,
    PostControl,
    Settings,
  },
};
</script>
<style>

.settings {
  position: fixed;
  height: 100%;
  width: 25%;
  max-width: 25%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: flex-start;
  padding: 20px;
  border-right: 1px solid grey;
}

.settings > div {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  width: 100%;
  margin-left: 10px;
  border-radius: 20px;
  cursor: pointer;
}

.settings > div i {
  margin-right: 15px; 
  font-size: 18px;
  width: 20px; 
  text-align: center;
  margin-bottom: 5px;
}

.settings > div:hover {
  background-color: var(--bghover);
}

button,
.my-button {
  margin: 10px 0;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

button:hover,
.my-button:hover {
  background-color: #3e8e41;
  color: white;
}

.my-button {
  margin: 10px 0;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: white !important;
  font-size: 16px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.my-button:hover {
  background-color: #3e8e41;
  color: white;
}

.content-section {
  margin-left: 25%;
  display: flex;
  flex-direction: column;
}

.top-section {
  position: sticky;
  max-height: 400px;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid gray;
}
.tabs {
  padding-left: 20px;
  padding-right: 20px;
}
.tabs li {
  box-shadow: var(--shadow);
}
.tabs li:hover {
  color: #243447;
}

.profile-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  margin-top: 10px;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: var(--border);
  box-shadow: var(--shadowpp);
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  display: flex;
  flex-direction: column;
  margin-left: 40px;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.button-profile {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  flex: 1;
  min-width: 150px;
  max-width: 200px;
  text-align: center;
}

.button-profile:hover {
  background-color: #3e8e41;
}

.bottom-section {
  position: sticky;
  height: 100%;
  max-height: 65%;
  width: 100%;
  max-width: 100%;
  top: 400px;
  overflow-y: scroll;
}

@media screen and (max-width: 768px) {
  .tabs ul {
    display: flex;
    flex-direction: column;
  }

  .tabs ul li {
    width: 100%;
  }
  .settings {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 10%;
    width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    z-index: 9999;
    background-color: var(--colorbg);
    border-top: 1px solid gray;
}


.content-section {
  margin-left: 0%;
  margin-bottom: 10%;
  display: flex;
  flex-direction: column;
}
}

</style>
