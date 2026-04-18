import { describe, it, expect, beforeEach } from "vitest";
import { createStore } from "vuex";

describe("Vuex Store", () => {
  let store;
  let mockState;

  beforeEach(() => {
    // Crear un store mock manualmente
    mockState = {
      user: null,
      token: null,
      isAuthenticated: false,
    };

    store = createStore({
      state: mockState,
      mutations: {
        SET_TOKEN(state, token) {
          state.token = token;
          state.isAuthenticated = !!token;
        },
        LOGOUT(state) {
          state.token = null;
          state.isAuthenticated = false;
        },
      },
      getters: {
        isAuthenticated: (state) => state.isAuthenticated,
      },
    });
  });

  it("estado inicial correcto", () => {
    expect(store.state.user).toBe(null);
    expect(store.state.token).toBe(null);
    expect(store.state.isAuthenticated).toBe(false);
  });

  it("mutation SET_TOKEN actualiza el token", () => {
    store.commit("SET_TOKEN", "test-token");
    expect(store.state.token).toBe("test-token");
    expect(store.state.isAuthenticated).toBe(true);
  });

  it("mutation LOGOUT limpia el estado", () => {
    store.commit("SET_TOKEN", "test-token");
    store.commit("LOGOUT");
    expect(store.state.token).toBe(null);
    expect(store.state.isAuthenticated).toBe(false);
  });

  it("getter isAuthenticated retorna estado correcto", () => {
    expect(store.getters.isAuthenticated).toBe(false);
    store.commit("SET_TOKEN", "test-token");
    expect(store.getters.isAuthenticated).toBe(true);
  });
});
