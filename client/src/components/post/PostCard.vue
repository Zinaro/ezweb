<template>

  <card title="Post">
      <div class="item-card mt-3 ml-2 mr-2 ">
        <div class="post-image-smole">
          <img
            v-if="item.postImage"
            @click="viewPost(item)"
            style="cursor: pointer"
            :src="require(`@/assets/images/postimages/${item.postImage}`)"
            alt="Wêneya Postê"
            class="post-image-smole"
          />
        </div>
        <div
          class="item-post-title"
          @click="viewPost(item)"
          style="cursor: pointer"
        >
          {{ item.postTitle }}
        </div>
        <div 
          class="item-post-content"
          v-html="truncateText(item.postContent, 410)"
        ></div>
        <div class="item-post-content">
          <div class="post-content-author-bottom">
            <div class="post-author">
              <img
                v-if="item.profileImage"
                :src="require(`@/assets/images/${item.profileImage}`)"
                alt="Wêneya Profîlê"
                class="post-image-card"
              />
              <img
                v-else
                src="@/assets/images/default.jpg"
                alt="Wêneya Profîlê"
                class="profile-image"
              />
              <div class="post-author-name">
                {{ item.postAuthorName.length > 15 ? item.postAuthorName.substring(0, 15) + '..' : item.postAuthorName }}
              </div>
            </div>
            <div>{{ Object.keys(item.likes).length }} <i class="fas fa-heart" style="color: red;"></i></div>
          </div>
        </div>

        <Post v-if="selectedPost" :post="selectedPost" />
      </div>
  </card>
</template>

<script>
import Post from "@/components/Post.vue";

export default {
  name: "PostCardPage",
  components: {
    Post,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      }
      return text;
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
  },
};
</script>

<style>
@import url('@/assets/styles.scss');
.post-image-smole {
  object-fit: cover;
  object-position: top;
  width: 100%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  height: 210px;
}
.item-card {
  box-shadow: var(--shadow);
  background-color: var(--colorbg);
  border: var(--border);
  border-radius: 15px;
  position: relative;
  height: 420px;
  max-height: 420px;
  min-height: 420px;
}
.item-nav {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.item-post-title {
  font-size: 18px;
  font-weight: bold;
  margin-top: 3px;
  margin-left: 3px;
  margin-right: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.item-post-content {
  padding-left: 8px;
  padding-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
.post-content-author-bottom {
  position: absolute;
  padding-left: 15px;
  padding-right: 15px;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  font-size: 14px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}


</style>
