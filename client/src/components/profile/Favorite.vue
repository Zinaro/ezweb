<template>
    <div class="favorite">
        <h1>Rûpela Hezkirnên min</h1>
        <ul>
            <li v-for="item in items" :key="item._id">
                <h2>{{ item.postTitle }}</h2>
                <div v-html="item.postContent"></div>
                <p>Nivîskar: {{ item.postAutorName }}</p>
                <p>Dem: {{ item.postDate }}</p>
                <button class="like" @click="likePost(item._id, item)"
                    v-if="!item.likes.some((l) => l.likeId == user._id) && user">Hez bike</button>
                <button class="likered" @click="likePost(item._id, item)" v-else>Hez neke</button>
                <button @click="viewPost(item)">Şandiyê Nîşan bide</button>
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
            } catch (err) {
                console.error(err);
            }
        },
        viewPost(item) {
      const kurdishChars = "ğüşöçİıĞÜŞÖÇêîûÊÎÛ";
      const englishChars = "gusocIiGUSOCeiuEIU";
      let postName = item.postTitle.toLowerCase();
      for (let i = 0; i < kurdishChars.length; i++) {
        postName = postName.replace(
          new RegExp(kurdishChars.charAt(i), "g"),
          englishChars.charAt(i)
        );
      }
      postName = postName.replace(/[^a-zA-Z0-9]/g, "-");
      this.$router.push({
        name: "post",
        params: { postname: postName, id: item._id },
      });
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
<style>
.favorite {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
}
.favorite h1 {
  font-size: 24px;
  margin-bottom: 20px;
}
</style>
