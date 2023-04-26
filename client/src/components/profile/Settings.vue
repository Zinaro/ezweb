<template>
  <div class="settings-page">
    <h1>Sazkarî</h1>
    <div class="settings-form">
      <div class="form-group">
        <label for="profile-image">Wêneyê Profîlê</label>
        <input type="file" id="profile-image" @change="onFileChange" />
        <button @click.prevent="uploadImage">Wêneyê Profîlê Bişîne</button>
      </div>
      <form @submit.prevent="updateUser">
        <div class="form-group">
          <label for="name">Nav</label>
          <input type="text" id="name" v-model="name" required />
        </div>
        <div class="form-group">
          <label for="email">E-name</label>
          <input type="email" id="email" v-model="mail" required />
        </div>
        <div class="form-group">
          <label for="current-password">Borînpeyva Heyî</label>
          <input
            type="password"
            id="current-password"
            v-model="currentPassword"
            required
          />
        </div>
        <div class="form-group">
          <label for="new-password">Borînpeyva Nû</label>
          <input
            type="password"
            id="new-password"
            v-model="newPassword"
            required
          />
        </div>
        <div class="form-group">
          <label for="new-password-confirm">Borînpeyva Nû Bipejirîne</label>
          <input
            type="password"
            id="new-password-confirm"
            v-model="newPasswordConfirm"
            required
          />
        </div>
        <button type="submit">Rojane bike</button>
      </form>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import axios from "axios";

export default {
  name: "SettingsPage",
  data() {
    return {
      user: null,
      name: "",
      mail: "",
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
      profileImage: null,
    };
  },
  created() {
    this.user = VueCookies.get("user");
    this.name = this.user.name;
    this.mail = this.user.mail;
    console.log(this.user.mail);
  },
  methods: {
    onFileChange(e) {
      this.profileImage = e.target.files[0];
    },
    async uploadImage() {
      const formData = new FormData();
      formData.append("image", this.profileImage);
      try {
        const response = await axios.post(
          `http://localhost:3000/upload/${this.user._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response.data.imageUrl);
        this.profileImage = null;
        alert("Profile image uploaded successfully");
        console.log(response.data.imageUrl)
        await axios.put(`http://localhost:3000/users/${this.user._id}`, {
          profileImage: response.data.imageUrl,
        });
        location.reload();
      } catch (error) {
        console.error(error);
      }
    },

    async updateUser() {
      if (this.newPassword !== this.newPasswordConfirm) {
        alert("New passwords do not match");
        return;
      }

      const data = {
        name: this.name,
        mail: this.mail,
      };

      if (this.currentPassword == this.user.password) {
        if (this.newPassword) {
          data.password = this.newPassword;
        }
        try {
          await axios.put(`http://localhost:3000/users/${this.user._id}`, data);
          this.user.name = this.name;
          this.user.mail = this.mail;
          this.user.password = this.newPassword || this.user.password;
          this.user.imageUrl = this.profileImage;
          VueCookies.set("user", this.user);
          alert("User information updated successfully");
        } catch (error) {
          console.error(error);
        }
      } else {
        alert("Current password is incorrect");
      }
    },
  },
};
</script>
<style>
.settings-form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button[type="submit"] {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: #0069d9;
}
</style>
