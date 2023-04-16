<template>
    <div class="followers">
        <h1>My Followers Page</h1>
        <ul>
            <li v-for="person in followersList" :key="person.name">
                <p>Name: {{ person.name }}</p>
                <p>Username: {{ person.username }}</p>
                <p>Mail: {{ person.mail }}</p>
                
            </li>
        </ul>
    </div>
</template>

<script>
import VueCookies from "vue-cookies"
import axios from 'axios';

export default {
    name: "FollowersPage",
    data() {
        return {
            user: null,
            followersList: [],
        }
    },
    created() {
        this.user = VueCookies.get("user");
    },
    mounted() {
        this.getFollowersList();
    },
    methods: {
        async getFollowersList() {
            try {
                const response = await axios.get(`http://localhost:3000/users/${this.user._id}/followers`);
                const followersIds = response.data;
                const users = [];
                for (let i = 0; i < followersIds.length; i++) {
                    const userResponse = await axios.get(`http://localhost:3000/users/${followersIds[i]}`);
                    console.log(userResponse)
                    users.push(userResponse.data);
                }
                this.followersList = users;
            } catch (error) {
                console.log(error);
            }
        }
    },
};
</script>
<style></style>