<template>
  <div class="settings-page">
    <div class="setting-sazkari">
      <h1>Sazkarî</h1>
    </div>
    <div v-if="user.permission !== 'user'" class="setting-photo">
      <label for="profile-image">Wêneyê Profîlê:</label>
      <input type="file" id="profile-image" @change="onFileChange" />
      <button @click.prevent="uploadImage">Wêneyê Profîlê Bişîne</button>
    </div>
    <div class="setting-name">
      <label for="name">Nav:</label>
      <input type="text" id="name" v-model="name" required class="input" maxlength="30"/>
      <button @click="updateUser">Rojane bike</button>
    </div>
    <div class="setting-mail">
      <label for="email">E-name:</label>
      <input type="email" id="email" v-model="mail" required class="input"/>
      <button @click="updateUser">Rojane bike</button>
    </div>
    <div class="setting-password">
      <div class="setting-input">
        <label for="current-password">Borînpeyva Heyî:</label>
        <input
          type="password"
          id="current-password"
          v-model="currentPassword"
          required
          class="input"
        />
      </div>
      <div class="setting-input">
        <label for="new-password">Borînpeyva Nû:</label>
        <input
          type="password"
          id="new-password"
          v-model="newPassword"
          required
          class="input"
        />
      </div>
      <div class="setting-input">
        <label for="new-password-confirm">Borînpeyva Nû Bipejirîne:</label>
        <input
          type="password"
          id="new-password-confirm"
          v-model="newPasswordConfirm"
          required
          class="input"
        />
      </div>
      <button @click.prevent="updateUser">Rojane bike</button>
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
    document.title = 'Sazkarî';
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
          `${process.env.VUE_APP_BASE_URL}/upload/${this.user._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        this.profileImage = null;
        alert("Profile image uploaded successfully");
        await axios.put(`${process.env.VUE_APP_BASE_URL}/users/${this.user._id}`, {
          profileImage: `${this.user._id}/${response.data.imageUrl}`,
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
  const data = {};
  if (this.name !== this.user.name) {
    data.name = this.name;
  }
  if (this.mail !== this.user.mail) {
    data.mail = this.mail;
  }
  if (this.newPassword && this.currentPassword == this.user.password) {
    data.password = this.newPassword;
  } else if (this.newPassword && this.currentPassword !== this.user.password) {
    alert("Current password is incorrect");
    return;
  }
  try {
    await axios.put(`${process.env.VUE_APP_BASE_URL}/users/${this.user._id}`, data);
    if (data.name) {
      this.user.name = data.name;
    }
    if (data.mail) {
      this.user.mail = data.mail;
    }
    if (data.password) {
      this.user.password = data.password;
    }
    VueCookies.set("user", this.user);
    alert("User information updated successfully");
    location.reload();
  } catch (error) {
    console.error(error);
  }
},
  },
};
</script>
<style>
.settings-page {
  flex-direction: column;
}
.settings-page input {
  background-color: var(--colorbg);
  color: var(--colortext);
}
.settings-form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.form-group {
  margin-bottom: 20px;
}
.setting-sazkari {
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 36px !important;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 30px;
  border: var(--border);
  border-radius: 5px;
  box-shadow: var(--shadow);
  margin: 20px;
  margin-top: 50px;
  margin-bottom: 50px;
  padding: 20px;
}
.setting-photo {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  border: var(--border);
  border-radius: 5px;
  box-shadow: var(--shadow);
  margin: 20px;
  margin-top: 50px;
  margin-bottom: 50px;
}
.setting-photo :first-child {
  text-align: right;
}
.setting-photo > * {
  flex: 1;
  max-width: 25%;
  padding: 7px;
}


.setting-name {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;


  font-size: 16px;
  font-weight: bold;
  border: var(--border);
  border-radius: 5px;
  box-shadow: var(--shadow);
  margin: 20px;
  margin-top: 50px;
  margin-bottom: 50px;
}
.setting-name :first-child {
  text-align: right;
}
.setting-name > * {
  flex: 1;
  max-width: 25%;
  padding: 7px;
}

.setting-mail {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  font-size: 16px;
  font-weight: bold;
  border: var(--border);
  border-radius: 5px;
  box-shadow: var(--shadow);
  margin: 20px;
  margin-top: 50px;
  margin-bottom: 50px;
}
.setting-mail :first-child {
  text-align: right;
}
.setting-mail > * {
  flex: 1;
  max-width: 25%;
  padding: 7px;
}
.setting-password {
  flex-direction: column;

  font-size: 16px;
  font-weight: bold;
  border: var(--border);
  border-radius: 5px;
  box-shadow: var(--shadow);
  margin: 20px;
  margin-top: 50px;
  margin-bottom: 50px;
  padding: 10px;
}
.setting-input {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  padding: 3px;
}

.setting-input label {
  display: block;
  margin-bottom: 5px;
  text-align: right;
  flex: 1;
  padding-right: 15px;
  max-width: 25%;
}
.setting-input input {
  display: block;
  text-align: left;
  margin-right: 55px;
  max-width: 300px;
  flex: 1;
  
}


</style>
