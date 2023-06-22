<template>
    <div class="signup-page">
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
        <div v-if="!user" class="form-container">
            <h1>Tomar bibe</h1>
            <form @submit.prevent="signup">
                <div>
                    <label for="name">* Nav</label>
                    <input id="name" type="text" v-model="name" required maxlength="30">
                </div>
                <div>
                    <label for="username">* Navê Bikarhêner</label>
                    <input id="username" type="text" v-model="username" required>
                </div>
                <div>
                    <label for="email">* E-name</label>
                    <input id="email" type="email" v-model="mail" required>
                </div>
                <div>
                    <label for="password">* Borînpeyv</label>
                    <input id="password" type="password" v-model="password" required>
                </div>
                <div>
                    <label for="confirm-password">* Borînpeyva Piştrast bike</label>
                    <input id="confirm-password" type="password" v-model="confirmPassword" required>
                </div>
                <div v-if="password !== confirmPassword" class="confirmPass">
                     Borînpeyv ne wekhev in!
                </div>
                <button type="submit" :disabled="password !== confirmPassword">Tomar bibe</button>
            </form>
        </div>
        <div v-if="user" class="custom-link">
            Silav, {{ user.name }}! Tu bûyî endam. Îja here rûpela xwe  <router-link :to="`/profile/${user.username}`"><i class="fas fa-arrow-alt-circle-right"></i>
</router-link>
        </div>

    </div>
</template>
<script>
import axios from 'axios';
import VueCookies from 'vue-cookies';

export default {
    name: "SignupPage",
    data() {
        return {
            name: '',
            username: '',
            mail: '',
            password: '',
            confirmPassword: '',
            errorMessage: '',
            successMessage: '',
            user: null
        };
    },
    methods: {
        async signup() {
            const newUser = {
                name: this.name,
                username: this.username,
                mail: this.mail,
                password: this.password,
                permission: 'user',
            };
            try {
                const response = await axios.get(`${process.env.VUE_APP_BASE_URL}/users`);
                const existingUser = response.data.find(user => user.username === newUser.username || user.mail === newUser.mail);
                if (existingUser) {
                    this.errorMessage = 'A user with the same username or email already exists';
                    setTimeout(() => {
                        this.errorMessage = '';
                    }, 5000);
                    return;
                }
                const signUpResponse = await axios.post(`${process.env.VUE_APP_BASE_URL}/users`, newUser);
                this.successMessage = 'Registration Successful!';

                setTimeout(() => {
                    this.successMessage = '';
                }, 2000);
                VueCookies.set('user', signUpResponse.data);
                location.reload()
                this.$router.push('/');
            } catch (error) {
                console.error(error);
            }
        },
    },
    created() {
        this.user = VueCookies.get("user");
    },


};
</script>
  
<style>
.success-message {
    background-color: green;
    color: white;
    padding: 10px;
    margin-bottom: 10px;
}


.form-container {
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
    border-radius: 10px;
    box-shadow: var(--shadow);
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

.error-message {
    color: red;
    margin: 10px 0px;
    text-align: center;
}
.confirmPass {
    color: red;
}
.custom-link {
    margin-top: 20px;
    font-size: 32px;
    text-decoration: none !important;
}

@keyframes fadeOut {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
</style>
