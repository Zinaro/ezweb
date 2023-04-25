
<template>
    <div class="profile">
      <div class="profile-header">
        <div class="profile-image">
          <img
            v-bind:src="
              user.profileImage
                ? require(`@/assets/images/${user.username}/${user.profileImage}`)
                : require(`@/assets/images/default.jpg`)
            "
            alt="Profile Image"
          />
        </div>
        <div class="profile-info">
          <div class="profile-name">{{ user.name }}</div>
          <div class="profile-username">{{ user.username }}</div>
          <div class="profile-followers">
            <span class="profile-followers-count">{{ followersCount }}</span> followers
          </div>
          <div class="profile-following">
            <span class="profile-following-count">{{ followingCount }}</span> following
          </div>
        </div>
      </div>
      <div class="profile-content">
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "UserProfile",
    data() {
      return {
        user: {},
        followersCount: 0,
        followingCount: 0,
      };
    },
    mounted() {
      this.getUserInfo();
    },
    methods: {
      getUserInfo() {
        const userId = this.$route.params.id;
        const users = [
          {
            _id: "1",
            name: "John Doe",
            username: "johndoe",
            profileImage: "profile.jpg",
            followers: [{ followerId: "2" }, { followerId: "3" }],
            following: [{ followingId: "2" }, { followingId: "3" }],
          },
          {
            _id: "2",
            name: "Jane Doe",
            username: "janedoe",
            profileImage: "profile.jpg",
            followers: [{ followerId: "1" }, { followerId: "3" }],
            following: [{ followingId: "1" }, { followingId: "3" }],
          },
          {
            _id: "3",
            name: "Bob Smith",
            username: "bobsmith",
            profileImage: "profile.jpg",
            followers: [{ followerId: "1" }, { followerId: "2" }],
            following: [{ followingId: "1" }, { followingId: "2" }],
          },
        ];
        const user = users.find((u) => u._id === userId);
        if (user) {
          this.user = user;
          this.followersCount = user.followers.length;
          this.followingCount = user.following.length;
        }
      },
    },
  };
  </script>
  
  <style scoped>
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