<template>
  <div class="container">
    <h1 class="title">Veriler {{ msg }}</h1>
    <div>
      <card title="Items">
        <ul class="list">
          <li v-for="item in items" :key="item._id" class="list-item">
            <div class="item-card">
              <div class="item-nav">{{ item._id }}</div>
              <div class="profile-sec">
                <div class="profile-image">
                  <img
                    v-bind:src="
                      item.profileImage
                        ? require(`@/assets/images/${item._id}/${item.profileImage}`)
                        : require(`@/assets/images/default.jpg`)
                    "
                    alt="Profile Image"
                  />
                </div>
                <div class="item-dilnav">
                  <a href="#" @click.prevent="goToProfile(item.username)" class="item-nav">{{ item.name }}</a>
                  <div class="item-nav">{{ item.name }}</div>
                  <div class="item-dil">{{ item.username }}</div>
                </div>
              </div>
              <div class="item-dil">
                FOLLOWING = {{ Object.keys(item.following).length }}
                {{ followingNames(item._id) }}
              </div>
              <div class="item-dil">
                FOLLOWERS = {{ Object.keys(item.followers).length }}
                {{ followersNames(item._id) }}
              </div>
              <button
                v-if="
                  user &&
                  item &&
                  item._id !== this.user._id &&
                  !item.followers.some((f) => f.followerId == this.user._id)
                "
                class="button is-primary"
                @click.prevent="following(item)"
              >
                Follow
              </button>
              <button
                v-if="
                  user &&
                  item &&
                  item._id !== this.user._id &&
                  item.followers.some((f) => f.followerId == this.user._id)
                "
                class="button is-danger"
                @click.prevent="followers(item)"
              >
                Unfollow
              </button>
            </div>
          </li>
        </ul>
      </card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import VueCookies from "vue-cookies";

export default {
  name: "UsersPage",
  props: {
    msg: {
      type: String,
      default: "Merhaba, MongoDB!",
    },
  },
  data() {
    return {
      name: "",
      username: "",
      mail: "",
      items: [],
      user: VueCookies.get("user"),
      isFollowing: false,
      fList: [],
    };
  },
  async created() {
    try {
      this.refreshData();
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    goToProfile(username) {
    this.$router.push({ name: 'username', params: { username } });
  },
    async refreshData() {
      try {
        const response = await axios.get("http://localhost:3000/users", {
          params: {
            projection: { name: 1, username: 1, _id: 0 },
          },
        });
        this.items = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    followingNames(itemId) {
      const item = this.items.find((item) => item._id === itemId);
      if (!item) {
        return [];
      }
      const followerIds = item.following.map((follower) => follower.followerId);
      const following = this.items.filter((item) =>
        followerIds.includes(item._id)
      );
      const followerNames = following.map((follower) => follower.name);
      return followerNames;
    },
    followersNames(itemId) {
      const item = this.items.find((item) => item._id === itemId);
      if (!item) {
        return [];
      }
      const followerIds = item.followers.map((follower) => follower.followerId);
      const followers = this.items.filter((item) =>
        followerIds.includes(item._id)
      );
      const followerNames = followers.map((follower) => follower.name);
      return followerNames;
    },

    async following(item) {
      if (this.user && item) {
        try {
          const data = {
            followerId: this.user._id,
            userId: item._id,
          };
          const response = await axios.put(
            `http://localhost:3000/users/${item._id}/followers`,
            data
          );
          if (response.status === 200) {
            this.isFollowing = true;
            this.items = response.data;
            const followingData = {
              followerId: item._id,
              userId: this.user._id,
            };
            const responsessss = await axios.put(
              `http://localhost:3000/users/${this.user._id}/following`,
              followingData
            );
            if (responsessss.status === 200) {
              this.isFollowing = false;
              this.refreshData();

              console.log(`following`);
            }
          }
        } catch (error) {
          alert("hi zinar, you have an error");
        }
      }
    },
    async followers(item) {
      if (this.user && item) {
        try {
          const data = {
            followerId: this.user._id,
            userId: item._id,
          };
          const response = await axios.delete(
            `http://localhost:3000/users/${item._id}/followers`,
            { data }
          );
          if (response.status === 200) {
            this.isFollowing = false;
            this.items = response.data;
            const followingData = {
              followerId: item._id,
              userId: this.user._id,
            };
            const responsessss = await axios.delete(
              `http://localhost:3000/users/${this.user._id}/following`,
              { data: followingData }
            );
            if (responsessss.status === 200) {
              this.isFollowing = false;
              this.refreshData();
              console.log(`unflowed`);
            }
          }
        } catch (error) {
          alert("hi zinar, you have an error");
        }
      }
    },
    async getItems() {
      try {
        const response = await axios.get("http://localhost:3000/users", {
          params: {
            projection: { name: 1, username: 1, _id: 0 },
          },
        });
        this.items = response.data;
      } catch (error) {
        console.error(error);
        alert("hi zinar, you have an error");
      }
    },
  },
};
</script>

<style>
@import url("../assets/styles.css");
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
</style>
