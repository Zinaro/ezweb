<template>
    <div class="profile">
        <div class="settings">
            <button @click="$router.push('/')">Home</button>
            <button @click="$router.push('/@' + user.username)">My Profile</button>
            <button @click="$router.push('/about')">About</button>
            <button @click="showSettings = true; showMyPosts = false; showFollowing = false; showFollowers = false; showFavorites = false; showAddPost = false">Settings</button>
            <button @click="showAddPost = true; showMyPosts = false; showFollowing = false; showFollowers = false; showFavorites = false; showSettings = false">Add Post</button>
        </div>
        <div class="content-section">
            <div class="top-section">
                <div class="profile-row">
                    <img src="image.jpg" alt="Profil Resmi" class="profile-image">
                    <div class="profile-info">
                        <h2>{{ user.name }}</h2>
                        <p>{{ user.mail }}</p>
                    </div>
                </div>
                <div class="button-row">
                    <button class="button-profile" :class="{ active: showMyPosts }"
                        @click="showMyPosts = true; showFollowing = false; showFollowers = false; showFavorites = false; showAddPost = false; showSettings = false">My
                        Posts</button>
                    <button class="button-profile" :class="{ active: showFollowing }"
                        @click="showMyPosts = false; showFollowing = true; showFollowers = false; showFavorites = false; showAddPost = false; showSettings = false">Following</button>
                    <button class="button-profile" :class="{ active: showFollowers }"
                        @click="showMyPosts = false; showFollowing = false; showFollowers = true; showFavorites = false; showAddPost = false; showSettings = false">Followers</button>
                    <button class="button-profile" :class="{ active: showFavorites }"
                        @click="showMyPosts = false; showFollowing = false; showFollowers = false; showFavorites = true; showAddPost = false; showSettings = false">My
                        Favorite</button>
                </div>
            </div>
            <div class="bottom-section">
                <MyPosts v-if="showMyPosts"></MyPosts>
                <Following v-if="showFollowing"></Following>
                <Followers v-if="showFollowers"></Followers>
                <Favorite v-if="showFavorites"></Favorite>
                <AddPost v-if="showAddPost"></AddPost>
                <Settings v-if="showSettings"></Settings>
            </div>
        </div>
    </div>
</template>

<script>
import VueCookies from "vue-cookies"
import MyPosts from "../profile/MyPosts.vue";
import Following from "../profile/Following.vue";
import Followers from "../profile/Followers.vue";
import Favorite from "../profile/Favorite.vue";
import AddPost from "../profile/AddPost.vue";
import Settings from "../profile/Settings.vue";

export default {
    name: "ProfilePage",
    data() {
        return {
            user: null,
            showMyPosts: true,
            showFollowing: false,
            showFollowers: false,
            showFavorites: false,
            showAddPost: false,
            showSettings: false
        }
    },
    created() {
        this.user = VueCookies.get("user");
    },
    components: {
        MyPosts,
        Following,
        Followers,
        Favorite,
        AddPost,
        Settings
    }
};
</script>
<style>
.settings {
    position: fixed;
    height: 100%;
    width: 25%;
    max-width: 25%;
    background-color: aqua;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 20px;
}

button,
.my-button {
    margin: 10px 0;
    padding: 10px;
    width: 100%;
    border: none;
    border-radius: 5px;
    background-color: #4CAF50;
    color: white !important;
    font-size: 16px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

button:hover,
.my-button:hover {
    background-color: #3e8e41;
    color: white;
}

.my-button {
    margin: 10px 0;
    padding: 10px;
    width: 100%;
    border: none;
    border-radius: 5px;
    background-color: #4CAF50;
    color: white !important;
    font-size: 16px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.my-button:hover {
    background-color: #3e8e41;
    color: white;
}





.content-section {
    margin-left: 25%;
    background-color: darkgray;
    display: flex;
    flex-direction: column;
}






.top-section {
    position: sticky;
    height: 100%;
    max-height: 400px;
    width: 100%;
    max-width: 100%;
    background-color: aquamarine;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.profile-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
}

.profile-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 40px;
}

.profile-info {
    display: flex;
    flex-direction: column;
    margin-left: 40px;
}

.button-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
}

.button-profile {
    margin: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #4CAF50;
    color: white;
    font-size: 16px;
    cursor: pointer;
    flex: 1;
    min-width: 150px;
    max-width: 200px;
    text-align: center;
}

.button-profile:hover {
    background-color: #3e8e41;
}







.bottom-section {
    position: sticky;
    height: 100%;
    max-height: 65%;
    width: 100%;
    max-width: 100%;
    top: 400px;
    overflow-y: scroll;
    background-color: darkseagreen;
}</style>