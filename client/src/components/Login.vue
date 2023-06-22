<template>
  <div class="login-page">
    <form v-if="!user" class="login-form" @submit.prevent="submitForm">
      <h2>Têkeve Rûpelê</h2>
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="name@example.com"
          v-model="username"
          required
        />
        <label for="floatingInput">Navê Bikarhêner</label>
      </div>
      <div class="form-floating">
        <input
          type="password"
          class="form-control"
          placeholder="Password"
          v-model="password"
          required
        />
        <label for="floatingPassword">Borînpeyv</label>
      </div>
      <button type="submit">Têkeve</button>
    </form>
    <div class="silav-user" v-if="user">Silav, {{ user.name }}! Tu çi dikî li vir? Here rûpela xwe zû! <router-link :to="`/profile/${user.username}`"><i class="fas fa-arrow-alt-circle-right"></i>
</router-link></div>
  </div>
</template>

<script>
import axios from "axios";
import VueCookies from "vue-cookies";

export default {
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
      user: null,
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_BASE_URL}/users`);
        const user = response.data.find(
          (k) => k.username === this.username && k.password === this.password
        );
        if (user) {
          VueCookies.set("user", user);
          this.user = user;
          window.location.href = `/profile/${user.name}`;
        } else {
          alert("Incorrect email or password");
        }
      } catch (error) {
        console.error(error);
        alert("hi zinar, you have an error");
      }
    },
  },
  created() {
    this.user = VueCookies.get("user");
  },
};
</script>

<style>

.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 72px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  background-color: var(--colorbg);
  color: var(--colortext);
  box-shadow: var(--shadow);
}

form div {
  display: flex;
  flex-direction: column;
  margin: 10px 0px;
}

form label {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 5px;
}
.form-control {
  color: var(--colortext) !important;
  background-color: var(--colorbg);
}
.form-control input{
  color: var(--colortext) !important;
  background-color: var(--colorbg) !important;
}

form input {
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1.2rem;
  padding: 5px;
  width: 100%;
  color: var(--colortext) !important;
  background-color: var(--colorbg) !important;
}

form button {
  background-color: #0077cc;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 10px;
  padding: 10px;
  width: 100%;
}
.silav-user {
  font-size: 32px;
}
</style>
