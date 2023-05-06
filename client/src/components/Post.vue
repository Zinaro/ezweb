<template>
    <div class="post-view">
        <h1>{{ post.postTitle }}</h1>
        <div class="post-image">
            <img v-if="post.postImage"
            :src="require(`@/assets/images/postimages/${post.postImage}`)"
              alt="Wêneya Postê"
              class="post-image"
            />
            
          </div>
        <div v-html="post.postContent"></div>
        <div v-html="post.postImage"></div>
         <p>Likes: {{ post.likes ? Object.keys(post.likes).length : 0 }}</p>
         <p>Created by {{ post.postAutorName }}</p>
    </div>
</template>
<script>
import VueCookies from "vue-cookies";
import axios from "axios";

export default {
    name: "PostPage",
    data() {
        return {
            user: null,
            post: {}
        }
    },
    created() {
        this.user = VueCookies.get("user");
        const postId = this.$route.params.id;
        this.getPost(postId);
    },
    methods: {
    async getPost(postId) {
      try {
        const response = await axios.get(`http://localhost:3000/post/${postId}`);
        this.post = response.data;
        console.log(typeof this.post.postImage)
      } catch (error) {
        console.log(error);
      }
    },
  }

};
</script>
<style>

.post-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.post-view h1 {
  font-size: 32px;
  margin-bottom: 10px;
}

.post-view p {
  font-size: 18px;
  margin-bottom: 10px;
}

.post-view p:last-child {
  margin-bottom: 0;
}

.post-image {
  width: 100%;
  position: relative;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}



</style>