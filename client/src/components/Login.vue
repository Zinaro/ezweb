
<template>
    <div class="login-page">
        <form v-if="!user" class="login-form" @submit.prevent="submitForm">
            <h2>Têkeve Rûpelê</h2>
            <label>
                Navê Bikarhêner:
                <input type="text" v-model="username" required>
            </label>
            <label>
                Borînpeyv:
                <input type="password" v-model="password" required>
            </label>
            <button type="submit">Têkeve</button>
        </form>
        <div v-if="user">
            Silav, {{ user.username }}!
        </div>
    </div>
</template>

<script>
import axios from "axios";
import VueCookies from "vue-cookies";

export default {
    name: "LoginPage",
    data() {
        return {
            username: '',
            password: '',
            user: null,
        }
    },
    methods: {
        async submitForm() {
            try {
                const response = await axios.get('http://localhost:3000/users');
                const user = response.data.find(k => k.username === this.username && k.password === this.password);
                if (user) {
                    VueCookies.set('user', user);
                    this.user = user;
                    window.location.href = `/profile/${user.name}`;
                } else {
                    alert('Incorrect email or password');
                }
            } catch (error) {
                console.error(error);
                alert('hi zinar, you have an error');
            }
        },
    },
    created() {
        this.user = VueCookies.get("user");
    },
};
</script>

<style>
@import url('../assets/styles.css');

.login-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    padding: 20px;
    width: 400px;
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

form input {
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 1.2rem;
    padding: 5px;
    width: 100%;
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
</style>
