<template>
  <div class="profile">
    <div class="settings">
      <button @click="$router.push('/')">Rûpela Sereke</button>
      <button @click="$router.push('/@' + user.username)">Profîla min</button>
      <button @click="$router.push('/about')">Derbar</button>
      <button
        @click="
          showSettings = true;
          showMyPosts = false;
          showFollowing = false;
          showFollowers = false;
          showFavorites = false;
          showAddPost = false;
        "
      >
        Sazkarî
      </button>
      <button
        @click="
          showAddPost = true;
          showMyPosts = false;
          showFollowing = false;
          showFollowers = false;
          showFavorites = false;
          showSettings = false;
        "
      >
        Şandî Tevlî bike
      </button>
    </div>
    <div class="content-section">
      <div class="top-section">
        <div class="profile-row">
            <div class="profile-image">
                <img
            v-if="user.profileImage"
            :src="
              require(`@/assets/images/${user.username}/${user.profileImage}`)
            "
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
        <div class="button-row">
          <button
            class="button-profile"
            :class="{ active: showMyPosts }"
            @click="
              showMyPosts = true;
              showFollowing = false;
              showFollowers = false;
              showFavorites = false;
              showAddPost = false;
              showSettings = false;
            "
          >
            Şandiyên min
          </button>
          <button
            class="button-profile"
            :class="{ active: showFollowing }"
            @click="
              showMyPosts = false;
              showFollowing = true;
              showFollowers = false;
              showFavorites = false;
              showAddPost = false;
              showSettings = false;
            "
          >
            Dişopîne
          </button>
          <button
            class="button-profile"
            :class="{ active: showFollowers }"
            @click="
              showMyPosts = false;
              showFollowing = false;
              showFollowers = true;
              showFavorites = false;
              showAddPost = false;
              showSettings = false;
            "
          >
            Şopîner
          </button>
          <button
            class="button-profile"
            :class="{ active: showFavorites }"
            @click="
              showMyPosts = false;
              showFollowing = false;
              showFollowers = false;
              showFavorites = true;
              showAddPost = false;
              showSettings = false;
            "
          >
            Hezkirinên min
          </button>
        </div>
      </div>
      <div class="bottom-section">
        <MyPosts v-if="showMyPosts"></MyPosts>
        <Following v-if="showFollowing"></Following>
        <Followers v-if="showFollowers"></Followers>
        <Favorite v-if="showFavorites"></Favorite>
        <AddPost v-if="showAddPost"></AddPost>
        <Settings v-if="showSettings"></Settings>
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
import axios from "axios";

export default {
  name: "ProfilePage",
  data() {
    return {
      user: null,
      showMyPosts: true,
      showFollowing: false,
      showFollowers: false,
      showFavorites: false,
      showAddPost: false,
      showSettings: false,
    };
  },
  created() {
    this.user = VueCookies.get("user");
  },
  mounted() {
    axios.get(`http://localhost:3000/users/${this.user._id}`).then(response => {
      this.user.profileImage = response.data.profileImage;
    });
  },
  components: {
    MyPosts,
    Following,
    Followers,
    Favorite,
    AddPost,
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
  background-color: aqua;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
}

button,
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
  background-color: darkgray;
  display: flex;
  flex-direction: column;
}

.top-section {
  position: sticky;
  height: 100%;
  max-height: 400px;
  width: 100%;
  max-width: 100%;
  background-color: aquamarine;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.profile-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  margin-top: 10px;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
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
  background-color: darkseagreen;
}
</style>
