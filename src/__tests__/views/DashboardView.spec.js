import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DashboardView from "@/views/DashboardView.vue";
import axios from "@/config/axios";

vi.mock("@/config/axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("DashboardView.vue", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: [
        { id: 1, nombre: "Juan Pérez" },
        { id: 2, nombre: "María García" },
      ],
    });
  });

  it("renderiza el título correctamente", async () => {
    const wrapper = mount(DashboardView);
    expect(wrapper.find("h1").text()).toBe("Inicio");
  });

  it("carga y muestra las tarjetas", async () => {
    const wrapper = mount(DashboardView);
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const statCards = wrapper.findAll(".stat-card");
    expect(statCards.length).toBeGreaterThan(0);
  });
});
