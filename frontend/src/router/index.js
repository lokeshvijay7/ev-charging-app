import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"
import Login from "../views/auth/Login.vue"
import Register from "../views/auth/Register.vue"
import Dashboard from "../views/Dashboard.vue"
import StationList from "../views/stations/StationList.vue"
import StationMap from "../views/stations/StationMap.vue"
import StationForm from "../views/stations/StationForm.vue"
import StationDetail from "../views/stations/StationDetail.vue"
import store from "../store"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { guestOnly: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/stations",
    name: "StationList",
    component: StationList,
    meta: { requiresAuth: true },
  },
  {
    path: "/stations/map",
    name: "StationMap",
    component: StationMap,
    meta: { requiresAuth: true },
  },
  {
    path: "/stations/new",
    name: "NewStation",
    component: StationForm,
    meta: { requiresAuth: true },
  },
  {
    path: "/stations/:id",
    name: "StationDetail",
    component: StationDetail,
    meta: { requiresAuth: true },
  },
  {
    path: "/stations/:id/edit",
    name: "EditStation",
    component: StationForm,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: "Login" })
    } else {
      next()
    }
  } else if (to.matched.some((record) => record.meta.guestOnly)) {
    if (isAuthenticated) {
      next({ name: "Dashboard" })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
