<template>
  <div class="container pt-3">
    <div>
      <h1 class="title">Nivîskarên me!</h1>
        <ul class="list">
          <li v-for="item in items" :key="item._id" class="card ml-2 mr-2 mt-4 list-item shadow">
            <div class="card-body">
              <div class="profile-sec">
                <div class="profile-image float-start">
                  <img
                    v-bind:src="
                      item.profileImage
                        ? require(`@/assets/images/${item.profileImage}`)
                        : require(`@/assets/images/default.jpg`)" alt="Profile Image"/>
                </div>
                <div class="item-dilnav ml-5 mt-2 float-start">
                  <a href="#" @click.prevent="goToProfile(item.username)" class="item-nav">
  {{ item.name.length > 15 ? item.name.substring(0, 15) + '..' : item.name }}
</a>
                  <div class="item-dil">@{{ item.username }}</div>
                </div>
                <div class="float-end">
                  <button v-if="user && item && item._id !== this.user._id &&
                      !item.followers.some((f) => f.followerId == this.user._id)"
                    class="button is-primary" @click.prevent="following(item)">Follow
                  </button>
                  <button v-if=" user && item && item._id !== this.user._id &&
                      item.followers.some((f) => f.followerId == this.user._id)"
                      class="button is-danger" @click.prevent="followers(item)">Unfollow
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="item-dil">
                {{ Object.keys(item.following).length }} Following 
              </div>
              <div class="item-dil">
                {{ Object.keys(item.followers).length }} Followers
              </div>
            </div>
          </li>
        </ul>

    </div>
  </div>
</template>

<script>
import axios from "axios";
import VueCookies from "vue-cookies";

export default {
  name: "NiviskarsPage",
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
        this.items = response.data.filter(item => item.permission === "niviskar");
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

  },
};
</script>

<style>
.profile-image {
  width: 75px;
  height: 75px;
  overflow: hidden;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
