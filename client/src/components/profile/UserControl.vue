<template>
  <div
    v-if="(user && user.permission === 'root') || user.permission === 'admin'"
    class="user-control"
  >
    <div v-if="dialog" class="dialog">
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title class="headline">Error</v-card-title>
          <v-card-text>{{ errorMessage }}</v-card-text>
          <v-card-actions class="custom-actions">
            <v-btn
              class="custom-button"
              color="primary"
              text
              @click="dialogChange()"
              >OK</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <div class="table">
      <div class="table-header">
        <div class="table-cell">Name</div>
        <div class="table-cell">UserName</div>
        <div class="table-cell">Email</div>
        <div class="table-cell">Permission</div>
        <div class="table-cell">Password</div>
        <div class="table-cell">Edit</div>
      </div>
      <div class="table-body">
        <div v-for="u in displayedUsers" :key="u._id" class="table-row">
          <div v-if="u._id !== editUserId" class="table-cell">{{ u.name }}</div>
          <div v-if="u._id !== editUserId" class="table-cell">
            {{ u.username }}
          </div>
          <div v-if="u._id !== editUserId" class="table-cell">{{ u.mail }}</div>
          <div v-if="u._id !== editUserId" class="table-cell">
            {{ u.permission }}
          </div>
          <div v-if="u._id !== editUserId" class="table-cell">
            {{
              u._id !== user._id && u.permission !== "admin"
                ? u.password
                : "***"
            }}
          </div>
          <div
            v-if="
              u._id === editUserId &&
              (u.permission !== 'admin' ||
                user.permission === 'root' ||
                user._id === u._id)
            "
            class="table-cell"
          >
            <div class="input-group">
              <span class="input-group-text">Name:</span>
              <input type="text" class="form-control" v-model="editUser.name" />
            </div>
          </div>
          <div
            v-if="
              u._id === editUserId &&
              (u.permission !== 'admin' ||
                user.permission === 'root' ||
                user._id === u._id)
            "
            class="table-cell"
          >
            <div class="input-group">
              <span class="input-group-text">Username:</span>
              <input
                type="text"
                class="form-control"
                v-model="editUser.username"
              />
            </div>
          </div>
          <div
            v-if="
              u._id === editUserId &&
              (u.permission !== 'admin' ||
                user.permission === 'root' ||
                user._id === u._id)
            "
            class="table-cell"
          >
            <div class="input-group">
              <span class="input-group-text">Email:</span>
              <input type="text" class="form-control" v-model="editUser.mail" />
            </div>
          </div>
          <div
  v-if="
    u._id === editUserId &&
    (u.permission !== 'admin' ||
      user.permission === 'root' ||
      user._id === u._id)
  "
  class="table-cell"
>
  <div class="mb-3">
    <label for="permission" class="form-label">Permission:</label>
    <select id="permission" class="form-select" v-model="editUser.permission">
      <option value="user">User</option>
      <option value="niviskar">Niviskar</option>
      <option value="editor">Editor</option>
      <option v-if="user.permission === 'root' || u._id === user._id" value="admin">Admin</option>
    </select>
  </div>
</div>

          <div
            v-if="
              u._id === editUserId &&
              (u.permission !== 'admin' ||
                user.permission === 'root' ||
                user._id === u._id)
            "
            class="table-cell"
          >
          <div class="input-group">
    <span class="input-group-text">Password:</span>
    <input type="password" class="form-control" v-model="editUser.password" />
  </div>
          </div>
          <div class="table-cell">
            <div class="button-group">
              <button
                v-if="
                  u._id !== editUserId &&
                  (u.permission !== 'admin' ||
                    user.permission === 'root' ||
                    user._id === u._id)
                "
                @click="deleteUser(u._id)"
              >
                Delete
              </button>
              <button
                v-if="
                  u._id !== editUserId &&
                  (u.permission !== 'admin' ||
                    user.permission === 'root' ||
                    user._id === u._id)
                "
                @click="editttUser(u)"
              >
                Update
              </button>
              <button v-if="u._id === editUserId" @click="saveUser(u._id)">
                Save
              </button>
              <button v-if="u._id === editUserId" @click="cancelEdit()">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showLoadMoreButton">
        <button @click="loadMoreUsers()">More</button>
      </div>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import axios from "axios";

export default {
  name: "UserControlPage",
  data() {
    return {
      user: null,
      users: [],
      editUserId: null,
      dialog: false,
      errorMessage: "",
      displayedUsers: [],
      showLoadMoreButton: false,
      loadMoreCount: 100,
    };
  },
  created() {
    this.user = VueCookies.get("user");
    this.getUsers();
  },
  watch: {
    errorMessage(newValue) {
      if (newValue) {
        this.dialog = true;
      }
    },
  },
  methods: {
    async getUsers() {
      await axios
        .get("http://localhost:3000/users")
        .then((response) => {
          this.users = response.data
            .filter((u) => u.permission !== "root")
            .sort((a, b) => {
              if (a.permission === "admin") {
                return -1;
              } else if (b.permission === "admin") {
                return 1;
              } else if (a.permission === "editor") {
                return -1;
              } else if (b.permission === "editor") {
                return 1;
              } else if (a.permission === "niviskar") {
                return -1;
              } else if (b.permission === "niviskar") {
                return 1;
              } else {
                return a.permission.localeCompare(b.permission);
              }
            });
          this.displayedUsers = this.users.slice(0, 100);
          if (this.users.length > 100) {
            this.showLoadMoreButton = true;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async loadMoreUsers() {
      const startIndex = this.displayedUsers.length;
      const endIndex = startIndex + this.loadMoreCount;
      this.displayedUsers = this.displayedUsers.concat(
        this.users.slice(startIndex, endIndex)
      );
      if (endIndex >= this.users.length) {
        this.showLoadMoreButton = false;
      }
    },
    editttUser(user) {
      this.editUserId = user._id;
      this.editUser = { ...user };
    },
    cancelEdit() {
      this.editUserId = null;
    },
    async saveUser(id) {
      try {
        await axios.put(
          `http://localhost:3000/users/${id}/root`,
          this.editUser
        );
        this.editUserId = null;
        this.editUser = {};
        this.getUsers();
      } catch (error) {
        console.log(error);
        this.errorMessage = "Mail or username already in use";
      }
    },
    async deleteUser(id) {
      try {
        await axios.delete(`http://localhost:3000/users/${id}/root`);
        this.getUsers();
      } catch (error) {
        console.log(error);
      }
    },
    dialogChange() {
      this.dialog = !this.dialog;
      this.cancelEdit();
    },
  },
};
</script>
<style>
.select {
  position: relative;
  display: inline-block;
  margin-left: 10px;
}

.select select {
  width: 100%;
  padding: 8px 38px 8px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  font-size: 16px;
  color: #333;
  appearance: none;
  -webkit-appearance: none;
}

.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
}

v-card {
  background-color: #fff !important;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.24), 0 0 2px rgba(0, 0, 0, 0.12);
  width: 400px;
  height: 130px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 14px;
}

v-card-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

v-card-text {
  font-size: 16px;
  margin-bottom: 8px;
}

.custom-actions {
  display: flex;
  justify-content: flex-end;
}

.custom-button {
  margin-left: 8px;
  border-radius: 14px;
  padding: 8px 24px;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  background-color: #2196f3;
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.24), 0 0 2px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}

.custom-button:hover {
  background-color: #1976d2;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.24), 0 0 4px rgba(0, 0, 0, 0.12);
  cursor: pointer;
}

.user-control {
  flex-direction: row;
  justify-content: space-between;
}

.table {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

.table-header {
  display: flex;
  flex-direction: row;
  background-color: #f5f5f5;
  font-weight: bold;
  padding: 8px;
}

.table-cell {
  flex: 1;
  padding: 8px;
}

.table-row {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #ccc;
}

.table-row:last-child {
  border-bottom: none;
}

.button-group {
  display: flex;
  flex-direction: row;
}

.button-group button {
  margin-right: 8px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

.button-group button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
