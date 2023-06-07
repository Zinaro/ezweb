<template>
    <div class="followers">
        <h1>Rûpela Şopînerên min</h1>
        <ul>
            <li v-for="person in followersList" :key="person.name" class="followers-item">
        <div class="followers-item__content">
          <div class="followers-item__image">
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
          <div class="followers-item__info">
            <router-link
              :to="'/' + person.username"
              class="followers-item__name"
              >{{ person.name }}</router-link
            >
            <p class="followers-item__username">@{{ person.username }}</p>
          </div>
        </div>
      </li>
        </ul>
    </div>
</template>

<script>
import VueCookies from "vue-cookies"
import axios from 'axios';

export default {
    name: "FollowersPage",
    data() {
        return {
            user: null,
            followersList: [],
        }
    },
    created() {
        this.user = VueCookies.get("user");
        document.title = 'Şopîner';
    },
    mounted() {
        this.getFollowersList();
    },
    methods: {
        async getFollowersList() {
            try {
                const response = await axios.get(`http://localhost:3000/users/${this.user._id}/followers`);
                const followersIds = response.data;
                const users = [];
                for (let i = 0; i < followersIds.length; i++) {
                    const userResponse = await axios.get(`http://localhost:3000/users/${followersIds[i]}`);
                    users.push(userResponse.data);
                }
                this.followersList = users;
            } catch (error) {
                console.log(error);
            }
        }
    },
};
</script>
<style>
.followers {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.followers h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.followers ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.followers-item {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.followers-item__content {
  display: flex;
  align-items: center;
}

.followers-item__image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.followers-item__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.followers-item__info {
  margin: 0;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.followers-item__name {
  font-weight: bold;
  font-size: 18px;
  margin: 0 0 5px 0;
  margin-left: 10px;
}

.followers-item__username {
  color: #666;
  margin: 0;
  margin-left: 10px;
}
</style>
