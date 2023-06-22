<template>
  <div class="slider">
    <swiper :options="swiperOptions" >
      <swiper-slide v-for="(post, index) in lastposts" :key="index" class="swiper-slide">
        <a @click="viewPost(post)">
          <img v-if='post.postImage' class='slider-image'
            :src="require(`@/assets/images/postimages/${post.postImage}`)"
            alt="Post Image"
          />
	</a>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/swiper-bundle.css';
import axios from 'axios'

export default {
  name: "SliderPage",
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      wiperOptions: {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
      },
      lastposts: {}
    };
  },
  created() {
    this.getLastPosts();
  },
  methods: {
    async getLastPosts() {
      const response = await axios.get(`${process.env.VUE_APP_BASE_URL}/posts/approved`);
      this.lastposts = response.data.slice(0,10).reverse();
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
<style scoped>
.slider {
  width: 100%;
  max-height: 350px;
  overflow: hidden;
  margin-left: 5px;
  margin-bottom: 40px;
  margin-top: 10px;
  border: var(--border);
  border-radius: 10px;
  box-shadow: var(--shadow);
}

.slider img {
  flex: 1;
  height: auto;
  width: 100%;
  object-fit: contain;
}

@media screen and (max-width: 768px) {

  .slider {
    margin-left: -2px;
  }
}


</style>
