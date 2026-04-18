import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import Modal from "@/components/Modal.vue";

describe("Modal.vue", () => {
  it("no se muestra cuando visible es false", () => {
    const wrapper = mount(Modal, {
      props: { visible: false },
    });
    expect(wrapper.find(".modal").exists()).toBe(false);
  });

  it("se muestra cuando visible es true", () => {
    const wrapper = mount(Modal, {
      props: { visible: true },
    });
    expect(wrapper.find(".modal").exists()).toBe(true);
  });

  it("muestra el título correcto", () => {
    const wrapper = mount(Modal, {
      props: {
        visible: true,
        title: "Nuevo Estudiante",
      },
    });
    expect(wrapper.find("h2").text()).toBe("Nuevo Estudiante");
  });

  it("emite close cuando se clickea cancelar", async () => {
    const wrapper = mount(Modal, {
      props: { visible: true },
    });
    await wrapper.find(".btn-cancelar").trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("emite save cuando se submit el formulario", async () => {
    const wrapper = mount(Modal, {
      props: { visible: true },
    });
    await wrapper.find("form").trigger("submit.prevent");
    expect(wrapper.emitted("save")).toBeTruthy();
  });

  it("emite close cuando se clickea el botón cerrar", async () => {
    const wrapper = mount(Modal, {
      props: { visible: true },
    });
    await wrapper.find(".close-btn").trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });
});
