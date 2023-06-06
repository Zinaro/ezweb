<template>
  <div class="post-view">
    <h1>{{ post.postTitle }}</h1>
    <div class="post-image">
      <img
        v-if="post.postImage"
        :src="require(`@/assets/images/postimages/${post.postImage}`)"
        alt="Wêneya Postê"
        class="post-image"
      />
    </div>
    <div v-html="post.postContent"></div>

    <div class="post-autor-bottom">
      <div class="post-autor">
        <img
          v-if="autor.profileImage"
          :src="require(`@/assets/images/${autor.profileImage}`)"
          alt="Wêneya Postê"
          class="post-image"
        />
        <img
          v-else
          src="../assets/images/default.jpg"
          alt="Wêneya Profîlê"
          class="profile-image"
        />
        <div class="post-autor-name">
          <a
            href="#"
            @click.prevent="goToProfile(autor.username)"
            class="item-nav"
            >{{ autor.name }}</a
          >
        </div>
      </div>
      <div class="post-autor-likes">
        <svg
          v-if="!userLiked"
          @click="likePost(post._id, post)"
          style="cursor: pointer"
          color="rgb(255, 48, 64)"
          fill="rgb(255, 48, 64)"
          height="24"
          role="img"
          viewBox="0 0 24 24"
          width="24"
        >
          <path
            d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"
          ></path>
        </svg>
        <svg
          v-if="user && userLiked"
          @click="likePost(post._id, post)"
          style="cursor: pointer"
          color="rgb(255, 48, 64)"
          fill="rgb(255, 48, 64)"
          height="24"
          role="img"
          viewBox="0 0 50 50"
          width="24"
        >
          <path
            d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"
          ></path>
        </svg>

        <div class="post-autor-likes-count">
          {{ post.likes ? Object.keys(post.likes).length : 0 }} liked.
        </div>
      </div>
      <div class="post-autor-date">{{ getDifference(post.postDate) }}</div>
      <div
        class="post-category"
        @click="goToCategory(post.postCategory)"
        style="cursor: pointer; text-decoration: underline"
      >
        {{ category }}
      </div>
    </div>
    <div class="post-comments">
      <h3>Commnets</h3>
      <div class="comment-list">
        <div
          v-for="(comment, index) in displayedComments"
          :key="index"
          class="comment-item"
        >
          <div class="comment-item-top">
            <div class="post-autor">
              <img
                v-if="commentAuthorProfileImages[comment.commentAuthorId]"
                :src="
                  require(`@/assets/images/${commentAuthorProfileImages[comment.commentAuthorId]}`)
                "
                alt="Wêneya Postê"
                class="post-image"
              />
              <img
                v-else
                src="@/assets/images/default.jpg"
                alt="Wêneya Profîlê"
                class="profile-image"
              />
              <div class="post-autor-name">
                <a
                  href="#"
                  @click.prevent="getUserNameAndGoToProfile(comment.commentAuthorId)"
                  class="item-nav"
                  >{{ commentAuthorNames[comment.commentAuthorId] }}</a
                >
              </div>
            </div>
            <div class="post-autor-date">
              {{ getDifference(comment.commentDate) }}
            </div>
            <button
              v-if="canDeleteComment(comment)"
              type="button" class="btn btn-outline-danger"
              @click="deleteComment(comment._id)"
            >
              Delete
            </button>
          </div>
          <div class="comment-item-bottom">
            <div class="comment-content">
              {{ comment.commentContent }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="showNextButton" class="next-button">
        <button type="button" class="btn btn-outline-info" @click="showMoreComments">Next</button>
      </div>
      <div class="add-comment">
        <p>Your Commit:</p>
        <div class="comment-input">
          <textarea
            name="commentContent"
            :disabled="!user"
            v-model="comment"
            :placeholder="placeholderText"
            rows="3"
            required
          ></textarea>
        </div>
        <button v-if="user" class="btn btn-outline-success" type="button" @click="submitComment">Send</button>
      </div>
    </div>
  </div>
</template>
<script>
import VueCookies from "vue-cookies";
import axios from "axios";
import { parse } from "date-fns";
import { reactive } from 'vue';

export default {
  name: "PostPage",
  data() {
    return {
      user: null,
      post: {},
      autor: {},
      userLiked: false,
      category: null,
      placeholderText: "",
      comment: "",
      commentsPerPage: 10,
      displayedComments: [],
      allComments: [],
      currentIndex: 0,
      commentAuthorNames: reactive({}),
      commentAuthorProfileImages: reactive({})
    };
  },

  async created() {
    this.user = VueCookies.get("user");
    const postId = this.$route.params.id.slice(-24);
    await this.getPost(postId);
    if (!this.user) {
      this.placeholderText = "Login to comment..";
    }
    this.allComments = this.post.postComments;
    this.updateDisplayedComments();
    for (const comment of this.displayedComments) {
      this.getCommentAuthorName(comment);
      this.getCommentAuthorProfileImage(comment);
    }
  },
  computed: {
    showNextButton() {
      return this.currentIndex + this.commentsPerPage < this.allComments.length;
    },
  },
  methods: {
    async getPost(postId) {
      try {
        const response = await axios.get(
          `http://localhost:3000/post/${postId}`
        );
        this.post = response.data;

        if (this.user) {
          this.userLiked = this.post.likes.some(
            (like) => like.likeId === this.user._id
          );
        }
        const resuser = await axios.get(
          `http://localhost:3000/users/${response.data.postAutorId}`
        );
        const rescategory = await axios.get(
          `http://localhost:3000/category/${response.data.postCategory}`
        );
        this.category = rescategory.data.category.name;
        this.autor = resuser.data;
        document.title = this.post.postTitle;
      } catch (error) {
        console.log(error);
      }
    },
    async submitComment() {
      try {
        await axios.post(`http://localhost:3000/comment/${this.post._id}`, {
          commentContent: this.comment,
          commentAuthorId: this.user._id,
        });
        this.comment = "";
        location.reload();
      } catch (error) {
        console.error(error);
      }
    },
    async deleteComment(commentId) {
      const postId = this.post._id;
      try {
        await axios.delete(
          `http://localhost:3000/comment/${postId}/${commentId}`
        );
        location.reload();
      } catch (error) {
        console.error(error);
      }
    },
    canDeleteComment(comment) {
      return (
        (this.user &&
          comment.commentAuthorId === this.user._id) ||
        ["root", "admin"].includes(this.user.permission)
      );
    },
    async getUserNameAndGoToProfile(commentAuthorId) {
      const username = await this.getUserName(commentAuthorId);
      this.goToProfile(username);
    },
    goToProfile(username) {
      this.$router.push({ name: "username", params: { username } });
    },
    goToCategory(category) {
      this.$router.push(`/category/${this.category}-${category}`);
    },
    async getUserCome(comID) {
      const resuser = await axios.get(`http://localhost:3000/users/${comID}`);
      return resuser.data;
    },
    async getCommentAuthorName(comment) {
      if (!this.commentAuthorNames[comment.commentAuthorId]) {
        const user = await this.getUserCome(comment.commentAuthorId);
        this.commentAuthorNames[comment.commentAuthorId] = user.name;
      }
    },
    async getCommentAuthorProfileImage(comment) {
      if (!this.commentAuthorProfileImages[comment.commentAuthorId]) {
        const user = await this.getUserCome(comment.commentAuthorId);
        this.commentAuthorProfileImages[comment.commentAuthorId] = user.profileImage || "";
      }
    },
    async getUserName(comID) {
      const resuser = await this.getUserCome(comID);
      console.log(resuser.username);
      return resuser.username;
    },
    async likePost(postttId) {
      if (this.user) {
        try {
          const userId = this.user._id;
          const data = { userId, postttId };
          const sec = this.post;
          if (sec.likes.some((l) => l.likeId == userId)) {
            await axios.delete(`http://localhost:3000/posts/${postttId}/like`, {
              data,
            });
            sec.likes = sec.likes.filter((like) => like.likeId !== userId);
            this.userLiked = !this.userLiked;
            await this.getPost(postttId);
          } else {
            await axios.put(
              `http://localhost:3000/posts/${postttId}/like`,
              data
            );
            this.userLiked = !this.userLiked;
            await this.getPost(postttId);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        this.$router.push("/login");
      }
    },
    getDifference(postDate) {
      const currentDate = new Date();
      const postDateObj = parse(postDate, "dd.MM.yyyy HH:mm:ss", new Date());
      const diffInMs = currentDate - postDateObj;
      const diffInSec = Math.floor(diffInMs / 1000);
      const diffInMin = Math.floor(diffInSec / 60);
      const diffInHr = Math.floor(diffInMin / 60);
      const diffInDay = Math.floor(diffInHr / 24);
      const diffInWeek = Math.floor(diffInDay / 7);

      if (diffInWeek > 0) {
        return `${diffInWeek} week ago`;
      } else if (diffInDay > 0) {
        return `${diffInDay} day ago`;
      } else if (diffInHr > 0) {
        return `${diffInHr} hour ago`;
      } else if (diffInMin > 0) {
        return `${diffInMin} munite ago`;
      } else if (diffInSec > 0) {
        return `${diffInSec} seconds ago`;
      } else {
        return "now";
      }
    },
    showMoreComments() {
      this.currentIndex += this.commentsPerPage;
      this.updateDisplayedComments();
    },
    updateDisplayedComments() {
      this.displayedComments = this.allComments.slice(
        this.currentIndex,
        this.currentIndex + this.commentsPerPage
      );
    },
  },
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
.post-autor-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.post-autor {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.post-autor img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin: 5px;
}

.post-autor-name {
  margin-left: 10px;
  font-size: 18px;
  font-weight: bold;
}

.post-autor-likes {
  display: flex;
  align-items: center;
  margin-left: 10px;
  font-size: 16px;
}

.post-autor-likes * {
  margin-left: 10px;
}

.post-autor-date {
  margin-left: 10px;
  font-size: 14px;
}
.post-category {
  margin-left: 10px;
  font-size: 14px;
}

.post-comments {
  margin-left: 10px;
  font-size: 14px;
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.post-comments h3 {
  margin-top: 0;
}
.add-comment {
  margin-left: 10px;
  font-size: 14px;
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.comment-input {
  margin: 10px;
}
.comment-input textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
  white-space: pre-wrap;
  word-wrap: break-word;
  box-sizing: border-box;
  margin: 0;
}
.comment-list {
  margin-top: 20px;
}

.comment-item {
  background-color: rgba(173, 235, 245, 0.466);
  align-items: center;
  justify-content: space-between;
  margin: 5px;
}
.comment-item-top {
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.comment-content {
  font-size: 14px;
  margin: 10px;
  text-align: left;
}

.comment-author {
  font-size: 12px;
  color: gray;
}
</style>
