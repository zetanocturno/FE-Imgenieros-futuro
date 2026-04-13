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
        const response = await axios.post("/login", credentials);
        const { access_token, user } = response.data;
        commit("SET_TOKEN", access_token);
        commit("SET_USER", user);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data || error.message };
      }
    },
    async register({ commit }, userData) {
      try {
        const response = await axios.post("/register", userData);
        const { access_token, user } = response.data;
        commit("SET_TOKEN", access_token);
        commit("SET_USER", user);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data || error.message };
      }
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated, // ← Esto debe ser una función
    currentUser: (state) => state.user,
    authToken: (state) => state.token,
  },
});
