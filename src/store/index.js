import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import axios from "@/config/axios";

export default createStore({
  plugins: [createPersistedState()],
  state: {
    user: null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
      state.isAuthenticated = !!token;
      if (token) {
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
      }
    },
    LOGOUT(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        // JSON Server Auth espera email y password
        const response = await axios.post("/login", {
          email: credentials.email,
          password: credentials.password,
        });

        console.log("Respuesta del login:", response.data);

        // La respuesta puede venir con access_token o accessToken
        const token = response.data.access_token || response.data.accessToken;
        const user = response.data.user;

        if (token) {
          commit("SET_TOKEN", token);
          commit("SET_USER", user || { email: credentials.email });
          return { success: true };
        } else {
          return { success: false, error: "No se recibió token" };
        }
      } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        return {
          success: false,
          error: error.response?.data?.message || "Credenciales incorrectas",
        };
      }
    },
    async register({ commit }, userData) {
      try {
        const response = await axios.post("/register", {
          email: userData.email,
          password: userData.password,
        });

        console.log("Respuesta del registro:", response.data);

        const token = response.data.access_token || response.data.accessToken;
        const user = response.data.user;

        if (token) {
          commit("SET_TOKEN", token);
          commit("SET_USER", user || { email: userData.email });
          return { success: true };
        } else {
          return { success: false, error: "No se recibió token" };
        }
      } catch (error) {
        console.error("Register error:", error.response?.data || error.message);
        return {
          success: false,
          error: error.response?.data?.message || "Error en el registro",
        };
      }
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
    authToken: (state) => state.token,
  },
});
