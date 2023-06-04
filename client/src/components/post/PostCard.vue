<template>
  
    <card title="Post">
      <div class="kart">
        <div class="item-card">
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
            <div class="post-content-autor-bottom">
              <div class="post-autor">
                <img
                  v-if="item.profileImage"
                  :src="
                    require(`@/assets/images/${item.profileImage}`)
                  "
                  alt="Wêneya Profîlê"
                  class="post-image"
                />
                <img
                  v-else
                  src="@/assets/images/default.jpg"
                  alt="Wêneya Profîlê"
                  class="profile-image"
                />
                <div class="post-autor-name">
                  {{ item.postAutorName }}
                </div>
              </div>
              {{ Object.keys(item.likes).length }} liked.
            </div>
          </div>

          <Post v-if="selectedPost" :post="selectedPost" />
        </div>
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
.post-image-smole {
  object-fit: cover;
  object-position: top;
  width: 100%;
  border-top-left-radius: 55px;
  border-top-right-radius: 55px;
  height: 210px;
}
.item-card {
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  border: 0.2px solid cyan;
  border-radius: 55px;
  position: relative;
  background-color: rgba(255, 255, 255, 0.70);
  z-index: 999;
  height: 420px;
  max-height: 420px;
  min-height: 420px;
}
.kart {
  padding-bottom: 5px;
  background-color: #fff;
  border-radius: 55px;
  position: relative;
  transform: scale(0.95);
  background-image: linear-gradient(to bottom right, white, white,white, rgba(0, 247, 255, 0.4), white, white, white);
  background-size: 200% 200%;
  background-position: center;
  animation: gradient 25s ease infinite;
}
@keyframes gradient {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
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
.post-content-autor-bottom {
  position: absolute;
  padding-left: 30px;
  padding-right: 30px;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 255, 255, 0.050);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  font-size: 14px;
  border-bottom-left-radius: 55px;
  border-bottom-right-radius: 55px;
}

.like,
.likered {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;
}

.likered {
  background-color: #f44336;
}

.like:hover,
.likered:hover {
  opacity: 0.8;
}
</style>
