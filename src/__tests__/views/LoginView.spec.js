import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginView from "@/views/LoginView.vue";
import { createStore } from "vuex";
import { createRouter, createWebHistory } from "vue-router";

// Mock de Vue Router
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/dashboard", name: "dashboard" }],
});

describe("LoginView.vue", () => {
  let store;
  let actions;

  beforeEach(() => {
    actions = {
      login: vi.fn(),
    };
    store = createStore({
      actions,
    });
  });

  it("renderiza el formulario de login", () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [store, router],
      },
    });
    expect(wrapper.find("h2").text()).toBe("Iniciar Sesión");
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it("actualiza los campos del formulario", async () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [store, router],
      },
    });
    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');

    await emailInput.setValue("test@test.com");
    await passwordInput.setValue("123456");

    expect(emailInput.element.value).toBe("test@test.com");
    expect(passwordInput.element.value).toBe("123456");
  });

  it("muestra mensaje de error cuando credenciales son incorrectas", async () => {
    actions.login.mockResolvedValue({
      success: false,
      error: "Credenciales incorrectas",
    });

    const wrapper = mount(LoginView, {
      global: {
        plugins: [store, router],
      },
    });

    await wrapper.find('input[type="email"]').setValue("test@test.com");
    await wrapper.find('input[type="password"]').setValue("wrong");
    await wrapper.find("form").trigger("submit.prevent");

    await wrapper.vm.$nextTick();
    expect(wrapper.find(".error-message").exists()).toBe(true);
  });
});
