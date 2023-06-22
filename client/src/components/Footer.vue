<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section about-sec">
        <h3>About</h3>
        <a
          class="app-link"
          v-if="about.androidApp"
          :href="about.androidApp"
          target="_blank"
        >
          <img
            style="cursor: pointer"
            class="app-image google"
            :src="require(`@/assets/images/googleplay.png`)"
            alt="Android App"
          />
        </a>
        <a
          class="app-link"
          v-if="about.iosApp"
          :href="about.iosApp"
          target="_blank"
        >
          <img
            style="cursor: pointer"
            class="app-image"
            :src="require(`@/assets/images/appstore.png`)"
            alt="IOS App"
          />
        </a>
        <a class="pri-pol" @click="goToAbout">Privacy Policy</a>
      </div>
      <div class="footer-section">
        <h3>Last Posts</h3>
        <div class="lastposts" v-for="post in lastposts" :key="post._id">
          <img
            v-if="post.postImage"
            @click="viewPost(post)"
            style="cursor: pointer"
            class="lastposts-image"
            :src="require(`@/assets/images/postimages/${post.postImage}`)"
            :alt="post.postTitle"
          />
          <p @click="viewPost(post)" style="cursor: pointer">
            {{ post.postTitle.slice(0, 30) }}
          </p>
        </div>
      </div>
      <div class="footer-section">
        <h3>Contact</h3>
        <div>
          <p v-if="about.address">Address: {{ about.address }}</p>
          <p v-if="about.phone">Phone: {{ about.phone }}</p>
          <p v-if="about.email">Email: {{ about.email }}</p>
        </div>
      </div>
      <div class="footer-section">
        <iframe
          v-if="about"
          id="map-iframe"
          :src="about.siteMapUrl"
          style="border: 0; width: 100%; height: 200px"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          class="custom-iframe"
        ></iframe>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2023 {{ siteName }}. All rights reserved.</p>
    </div>
  </footer>
</template>
<script>
import axios from "axios";

export default {
  name: "FooterPage",
  data() {
    return {
      siteName: "Zinar Web Site",
      lastposts: {},
      about: {},
    };
  },
  created() {
    this.getLastPosts();
    this.getAbouts();
  },

  methods: {
    async getLastPosts() {
      const response = await axios.get(
        `${process.env.VUE_APP_BASE_URL}/posts/approved`
      );
      this.lastposts = response.data.reverse().slice(0, 3);
      console.log(this.lastposts);
    },
    async getAbouts() {
      const response = await axios.get(
        `${process.env.VUE_APP_BASE_URL}/abouts`
      );
      this.about = response.data;
    },
    async viewPost(item) {
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
      await new Promise((resolve) => {
        window.scrollTo({ top: 0, behavior: "auto" });
        setTimeout(resolve, 500);
      });
      await this.$router.push({
        name: "post",
        params: { postname: postName, id: item._id },
      });

      window.location.reload();
    },
    goToAbout() {
      this.$router.push(`/about`);

    },
  },
};
</script>
<style>
.footer {
  background-color: var(--colorbg);
  color: var(--colortext);
  max-height: 330px;
  border-top: var(--border);
  margin-top: 40px;
}
.footer-content {
  display: flex;
  justify-content: space-between;
}
.footer-section {
  flex-basis: 30%;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
}
.footer-section > * {
  margin-left: 0;
}
.app-link:hover {
  background-color: var(--colorbg) !important;
}
.custom-iframe {
  border-radius: 5%;
  box-shadow: var(--shadow);
}
.lastposts {
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
  border-bottom: var(--border);
  margin-right: 10px;
}

.lastposts p {
  margin-top: 8px;
}

.lastposts-image {
  height: 40px;
  width: 70px;
  margin-right: 10px;
  border-radius: 10px;
}
.app-image {
  max-height: 100px;
  max-width: 200px;
}
.google {
  padding-left: 15px;
  padding-right: 15px;
}
.about-sec {
  display: flex;
  flex-direction: column;
}
.about-sec h3 {
  margin-left: 20px;
}

.pri-pol {
  margin-left: 18px;
  margin-bottom: 5px;
  text-decoration: none;
}

@media (max-width: 767.98px) {
  .footer {
    max-height: none;
  }
  .footer-content {
    flex-direction: column;
  }
  .footer-section {
    flex-basis: 100% !important;
    border-bottom: var(--border);
    margin-bottom: 10px;
  }
  .about-sec h3 {
  margin-left: none;
}
}

@media (max-width: 991.98px) {
  .footer {
    max-height: none;
  }
  .footer-content {
    flex-wrap: wrap;
  }
  .footer-section {
    flex-basis: 50%;
    margin-bottom: 20px;
    border-bottom: var(--border);
  }
  .about-sec h3 {
  margin-left: 0;
}
}
</style>
