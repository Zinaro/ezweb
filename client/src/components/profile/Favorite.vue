<template>
    <div class="favorite">
        <h1>My Favorite Page</h1>
        <ul>
            <li v-for="item in items" :key="item._id">
                <h2>{{ item.postTitle }}</h2>
                <p>{{ item.postContent }}</p>
                <p>Author: {{ item.postAutorName }}</p>
                <p>Date: {{ item.postDate }}</p>
                <button class="like" @click="likePost(item._id, item)"
                    v-if="!item.likes.some((l) => l.likeId == user._id) && user">Like</button>
                <button class="likered" @click="likePost(item._id, item)" v-else>Dislike</button>
                <button @click="viewPost(item)">View Post</button>
            </li>
        </ul>
    </div>
</template>

<script>
import VueCookies from "vue-cookies"
import axios from "axios"

export default {
    name: "FavoritePage",
    data() {
        return {
            user: null,
            items: {}
        }
    },
    async created() {
        this.user = VueCookies.get("user");
        await this.getItems();
    },
    methods: {
        async getItems() {
            const userId = this.user._id;
            try {
                const response = await fetch(`http://localhost:3000/users/${userId}/posts/favorites`);
                const posts = await response.json();
                this.items = posts;
                console.log(posts);
            } catch (err) {
                console.error(err);
            }
        },
        viewPost(post) {
            this.$router.push({ name: "post", params: { postId: post._id }, props: { post } });
        },
        async likePost(postttId) {
      try {
        const userId = this.user._id;
        const data = { userId, postttId };
        const post = this.items.find((item) => item._id == postttId);
        if (post.likes.some((l) => l.likeId == userId)) {
          await axios.delete(`http://localhost:3000/posts/${postttId}/like`, { data });
          post.likes = post.likes.filter((like) => like.likeId !== userId);
          this.getItems();
        } else {
          const response = await axios.put(`http://localhost:3000/posts/${postttId}/like`, data);
          const updatedPost = response.data;
          this.getItems();
          const index = this.items.findIndex((item) => item._id === updatedPost._id);
          if (index !== -1) {
            this.items.splice(index, 1, updatedPost);
          }

        }
        console.log(`Like process successful`)
      } catch (error) {
        console.log(error);
      }
    },
    }
};
</script>
<style></style>