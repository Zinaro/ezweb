import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Welcome to the dashboard'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/about/kkvk',
    name: 'kkvk',
    component: () => import(/* webpackChunkName: "kkvk" */ '../components/about/kkvk.vue')
  },
  {
    path: '/about/privacypolicy',
    name: 'privacypolicy',
    component: () => import(/* webpackChunkName: "privacypolicy" */ '../components/about/privacypolicy.vue')
  },
  {
    path: '/market',
    name: 'market',
    component: () => import(/* webpackChunkName: "market" */ '../views/MarketView.vue'),
    meta: {
      title: "Market - Product List"
  }
  },
  {
    path: '/:catchAll(.*)',
    name: 'notfound',
    component: () => import(/* webpackChunkName: "notfound" */ '../views/NotFound.vue'),
    meta: {
      title: '404 - Rûpel Nehat Dîtin..'
    }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import(/* webpackChunkName: "users" */ '../views/UsersView.vue'),
    meta: {
      title: 'Edîtor û Nivîskarên me'
    }
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import(/* webpackChunkName: "categories" */ '../views/CategoriesView.vue'),
    meta: {
      title: 'Categories'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue'),
    meta: {
      title: 'Login'
    }
  },
  {
    path: "/profile/:userId",
    name: "profile",
    component: () => import(/* webpackChunkName: "profile" */ '../views/profile/ProfileView.vue'),
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import(/* webpackChunkName: "signup" */ '../views/SignupView.vue'),
    meta: {
      title: 'Sign Up'
    }
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
    path: "/:userId/editpost",
    name: "editpost",
    component: () => import(/* webpackChunkName: "editpost" */ '../components/profile/EditPost.vue')
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
    path: "/:userId/postcontrol",
    name: "postcontrol",
    component: () => import(/* webpackChunkName: "postcontrol" */ '../views/profile/PostControlView.vue')
  },
  {
    path: "/post/:postname-:id",
    name: "post",
    component: () => import(/* webpackChunkName: "post" */ '../views/PostView.vue'),
    props: true
  },
  {
    path: "/category/:categoryname-:id",
    name: "category",
    component: () => import(/* webpackChunkName: "category" */ '../views/CategoryView.vue'),
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
router.beforeEach((to) => {
  document.title = to.meta?.title ?? 'Default Title'
})

export default router
