import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import AboutView from "@/views/AboutView.vue";

describe("AboutView.vue", () => {
  it("renderiza el título correcto", () => {
    const wrapper = mount(AboutView);
    expect(wrapper.find("h1").text()).toBe("Ingenieros para el Futuro");
  });

  it("muestra el nombre del creador", () => {
    const wrapper = mount(AboutView);
    expect(wrapper.html()).toContain("Raúl Manuel Diez Canseco Gallegos");
  });

  it("muestra la sección de objetivos", () => {
    const wrapper = mount(AboutView);
    const objetivoSection = wrapper.findAll(".info-section")[1];
    expect(objetivoSection.find("h2").text()).toBe("Objetivo");
    expect(objetivoSection.text()).toContain("Apoyar a jóvenes");
  });

  it("muestra información de la organización", () => {
    const wrapper = mount(AboutView);
    expect(wrapper.html()).toContain("sin fines de lucro");
    expect(wrapper.html()).toContain("trabajo voluntario");
  });

  it("muestra los valores", () => {
    const wrapper = mount(AboutView);
    const values = [
      "Innovación",
      "Solidaridad",
      "Educación",
      "Inclusión",
      "Excelencia",
      "Comunidad",
    ];
    values.forEach((value) => {
      expect(wrapper.html()).toContain(value);
    });
  });
});
