import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/users',
    name: 'users',
    component: () => import(/* webpackChunkName: "users" */ '../views/UsersView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue')
  },
  {
    path: "/profile/:userId",
    name: "profile",
    component: () => import(/* webpackChunkName: "profile" */ '../views/profile/ProfileView.vue')
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import(/* webpackChunkName: "signup" */ '../views/SignupView.vue')
  },
  {
    path: "/:userId/myposts",
    name: "myposts",
    component: () => import(/* webpackChunkName: "myposts" */ '../views/profile/MyPostsView.vue')
  },
  {
    path: "/:userId/settings",
    name: "settings",
    component: () => import(/* webpackChunkName: "settings" */ '../views/profile/SettingsView.vue')
  },
  {
    path: "/:userId/following",
    name: "following",
    component: () => import(/* webpackChunkName: "following" */ '../views/profile/FollowingView.vue')
  },
  {
    path: "/:userId/followers",
    name: "followers",
    component: () => import(/* webpackChunkName: "followers" */ '../views/profile/FollowersView.vue')
  },
  {
    path: "/:userId/favorite",
    name: "favorite",
    component: () => import(/* webpackChunkName: "favorite" */ '../views/profile/FavoriteView.vue')
  },
  {
    path: "/:userId/addpost",
    name: "addpost",
    component: () => import(/* webpackChunkName: "addpost" */ '../views/profile/AddPostView.vue')
  },
  {
    path: "/:userId/addcategory",
    name: "addcategory",
    component: () => import(/* webpackChunkName: "addcategory" */ '../views/profile/AddCategoryView.vue')
  },
  {
    path: "/:userId/usercontrol",
    name: "usercontrol",
    component: () => import(/* webpackChunkName: "usercontrol" */ '../views/profile/UserControlView.vue')
  },
  {
    path: "/post/:postId",
    name: "post",
    component: () => import(/* webpackChunkName: "post" */ '../views/PostView.vue'),
    props: true
  },
  {
    path: "/:username",
    name: "username",
    component: () => import(/* webpackChunkName: "username" */ '../components/UserProfile.vue'),
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
