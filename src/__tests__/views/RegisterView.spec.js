import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RegisterView from "@/views/RegisterView.vue";
import { createStore } from "vuex";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/dashboard", name: "dashboard" }],
});

describe("RegisterView.vue", () => {
  let store;
  let actions;

  beforeEach(() => {
    actions = {
      register: vi.fn(),
    };
    store = createStore({
      actions,
    });
  });

  it("renderiza el formulario de registro", () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [store, router],
      },
    });
    expect(wrapper.find("h2").text()).toBe("Registro de Usuario");
    expect(wrapper.findAll("input")).toHaveLength(3);
  });

  it("valida que las contraseñas coincidan", async () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [store, router],
      },
    });

    const inputs = wrapper.findAll("input");
    await inputs[0].setValue("test@test.com");
    await inputs[1].setValue("123456");
    await inputs[2].setValue("654321");
    await wrapper.find("form").trigger("submit.prevent");

    await wrapper.vm.$nextTick();
    expect(wrapper.find(".error-message").exists()).toBe(true);
    expect(wrapper.find(".error-message").text()).toBe(
      "Las contraseñas no coinciden",
    );
  });

  it("valida longitud mínima de contraseña", async () => {
    const wrapper = mount(RegisterView, {
      global: {
        plugins: [store, router],
      },
    });

    const inputs = wrapper.findAll("input");
    await inputs[0].setValue("test@test.com");
    await inputs[1].setValue("123");
    await inputs[2].setValue("123");
    await wrapper.find("form").trigger("submit.prevent");

    await wrapper.vm.$nextTick();
    expect(wrapper.find(".error-message").exists()).toBe(true);
    expect(wrapper.find(".error-message").text()).toContain("6 caracteres");
  });
});
