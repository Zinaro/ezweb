<template>
    <div class="add-post">
        <h1>Şandî Tevlî bike</h1>

        <form v-if="user" @submit.prevent="addItem" class="form form-section">
            <div class="form-group">
                <label for="posttitle" class="label">Sernav:</label>
                <input type="text" id="posttitle" v-model="posttitle" class="input" required>
            </div>
            <div class="form-group form-postcontent">
                <label for="postcontent" class="label">Naverok:</label>
                <textarea id="postcontent" v-model="postcontent" class="input" rows="3" required></textarea>
            </div>
            <button type="submit" class="button is-primary">Tevlî bike</button>
        </form>
        <div v-if="showMessage" class="success-message">Şandî Tevlî bû</div>

    </div>
</template>

<script>
import VueCookies from "vue-cookies"
import axios from 'axios';


export default {
    name: "AddPostPage",
    data() {
        return {
            user: null,
            posttitle: "",
            postcontent: "",
            postdate: null,
            showMessage: false,
        }
    },
    created() {
        this.user = VueCookies.get("user");
    },
    methods: {
        async addItem() {
            const item = {
                postTitle: this.posttitle,
                postContent: this.postcontent,
                postDate: new Date().toLocaleString('tr-TR'),
                postAutorId: this.user._id,
                postAutorName: this.user.name
            };
            try {
                await axios.post("http://localhost:3000", item);
                const response = await axios.get("http://localhost:3000");
                this.items = response.data;
                this.clearInputs();
                this.showMessage = true;
                setTimeout(() => {
                    this.showMessage = false;
                }, 3000);
            } catch (error) {
                console.error(error);
                alert("hi zinar, you have an error");
            }
        },
        clearInputs() {
            this.posttitle = "";
            this.postcontent = "";
        },
    }
};
</script>
<style>
.success-message {
    background-color: green;
    color: white;
    padding: 10px;
    margin-top: 10px;
    text-align: center;
}

.add-post {
    padding-bottom: 100px;
}
</style>
