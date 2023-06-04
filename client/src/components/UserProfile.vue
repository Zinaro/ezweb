<template>
  <div class="profile">
    <div v-if="userNotFound" class="user-not-found">User not found</div>
    <div v-else class="profile-header">
      <div class="profile-image">
        <img
          v-bind:src="
            user.profileImage
              ? require(`@/assets/images/${user.profileImage}`)
              : require(`@/assets/images/default.jpg`)
          "
          alt="Profile Image"
        />
      </div>
      <div class="profile-info">
        <div class="profile-name">{{ user.name }}</div>
        <div class="profile-username">{{ user.username }}</div>
        <div class="profile-followers">
          <span class="profile-followers-count">{{ followersCount }}</span>
          followers
        </div>
        <div class="profile-following">
          <span class="profile-following-count">{{ followingCount }}</span>
          following
        </div>
      </div>
    </div>
    <div class="profile-content"></div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "UserProfile",
  data() {
    return {
      user: {},
      followersCount: 0,
      followingCount: 0,
      userNotFound: false
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
  const username = this.$route.params.username;
  axios.get(`http://localhost:3000/users/username/${username}`)
    .then(response => {
      const user = response.data;
      if (user) {
        this.user = user;
        this.followersCount = user.followers.length;
        this.followingCount = user.following.length;
        this.userNotFound = false;
      } else {
        this.userNotFound = true;
      }
    })
    .catch(() => {
      this.userNotFound = true
      console.clear();
    });
},
  },
};
</script>

<style scoped>

.user-not-found {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-top: 50px;
}
.profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.profile-username {
  font-size: 18px;
  color: #999;
  margin-bottom: 10px;
}

.profile-followers,
.profile-following {
  font-size: 14px;
  color: #999;
  margin-bottom: 5px;
}

.profile-followers-count,
.profile-following-count {
  font-weight: bold;
  color: #333;
}
</style>
