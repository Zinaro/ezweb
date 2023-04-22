<template>
    <div class="following">
        <h1>Rûpela yên Dişopînim</h1>
        <ul>
            <li v-for="person in followingList" :key="person.name">
                <p>Nav: {{ person.name }}</p>
                <p>Navê bikarhêner: {{ person.username }}</p>
                <p>E-name: {{ person.mail }}</p>
            </li>
        </ul>
    </div>
</template>

<script>
import VueCookies from "vue-cookies"
import axios from 'axios';

export default {
    name: "FollowingPage",
    data() {
        return {
            user: null,
            followingList: [],
        }
    },
    created() {
        this.user = VueCookies.get("user");
    },
    mounted() {
        this.getFollowingList();
    },
    methods: {
        async getFollowingList() {
            try {
                const response = await axios.get(`http://localhost:3000/users/${this.user._id}/following`);
                const followingIds = response.data;
                const users = [];
                for (let i = 0; i < followingIds.length; i++) {
                    const userResponse = await axios.get(`http://localhost:3000/users/${followingIds[i]}`);
                    users.push(userResponse.data);
                }
                this.followingList = users;
            } catch (error) {
                console.log(error);
            }
        }
    },
};
</script>
<style></style>
