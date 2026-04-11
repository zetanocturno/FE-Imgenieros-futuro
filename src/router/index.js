import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/RegisterView.vue"),
  },
  {
    path: "/estudiantes",
    name: "estudiantes",
    component: () => import("../views/EstudiantesView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/estudiantes/:id",
    name: "estudiante-detalle",
    component: () => import("../views/EstudianteDetalleView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/patrocinadores",
    name: "patrocinadores",
    component: () => import("../views/PatrocinadoresView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/patrocinadores/:id",
    name: "patrocinador-detalle",
    component: () => import("../views/PatrocinadorDetalleView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/patrocinios",
    name: "patrocinios",
    component: () => import("../views/PatrociniosView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/DashboardView.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Protección de rutas
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("token");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
