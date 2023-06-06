<template>
  <div class="following">
    <h1>Rûpela yên Dişopînim</h1>
    <ul>
      <li
        v-for="person in followingList"
        :key="person.name"
        class="following-item"
      >
        <div class="following-item__content">
          <div class="following-item__image">
            <img
              v-if="person.profileImage"
              :src="
                require(`@/assets/images/${person.profileImage}`)
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
          <div class="following-item__info">
            <router-link
              :to="'/' + person.username"
              class="following-item__name"
              >{{ person.name }}</router-link
            >
            <p class="following-item__username">@{{ person.username }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import axios from "axios";

export default {
  name: "FollowingPage",
  data() {
    return {
      user: null,
      followingList: [],
    };
  },
  created() {
    this.user = VueCookies.get("user");
    document.title = 'Dişopîne';
  },
  mounted() {
    this.getFollowingList();
  },
  methods: {
    async getFollowingList() {
      try {
        const response = await axios.get(
          `http://localhost:3000/users/${this.user._id}/following`
        );
        const followingIds = response.data;
        const users = [];
        for (let i = 0; i < followingIds.length; i++) {
          const userResponse = await axios.get(
            `http://localhost:3000/users/${followingIds[i]}`
          );
          users.push(userResponse.data);
        }
        this.followingList = users;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style>
.following {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
}

.following h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.following ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.following-item {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.following-item__content {
  display: flex;
  align-items: center;
}

.following-item__image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.following-item__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.following-item__info {
    margin: 0;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.following-item__name {
    font-weight: bold;
  font-size: 18px;
  color: blue;
  margin: 0 0 5px 0;
  margin-left: 10px;
}

.following-item__username {
    color: #666;
  margin: 0;
  margin-left: 10px;
}
</style>
