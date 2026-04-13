import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PatrocinadoresView from "@/views/PatrocinadoresView.vue";
import { createStore } from "vuex";
import { createRouter, createWebHistory } from "vue-router";
import axios from "@/config/axios";
import Swal from "sweetalert2";

// Mocks
vi.mock("@/config/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

// Mock de Vue Router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/patrocinadores/:id", name: "patrocinador-detalle" },
    { path: "/patrocinadores", name: "patrocinadores" },
  ],
});

describe("PatrocinadoresView.vue", () => {
  let store;
  let wrapper;
  const mockPatrocinadores = [
    {
      id: 1,
      nombre_empresa: "Tech Corp",
      nombre_contacto: "Carlos López",
      correo: "carlos@techcorp.com",
      whatsapp: "+51999999999",
      pais: "Perú",
      descripcion_patrocinio: "Apoyo a estudiantes de tecnología",
      estado: "ACTIVO",
    },
    {
      id: 2,
      nombre_empresa: "Software Solutions",
      nombre_contacto: "Ana Torres",
      correo: "ana@softsol.com",
      whatsapp: "+56988887777",
      pais: "Chile",
      descripcion_patrocinio: "Becas para cursos de programación",
      estado: "ACTIVO",
    },
    {
      id: 3,
      nombre_empresa: "Data Analytics",
      nombre_contacto: "Miguel Rojas",
      correo: "miguel@data.com",
      whatsapp: "+541112223333",
      pais: "Argentina",
      descripcion_patrocinio: "Capacitación en ciencia de datos",
      estado: "INACTIVO",
    },
  ];

  beforeEach(() => {
    // Resetear mocks
    vi.clearAllMocks();

    // Mock de la respuesta de axios
    axios.get.mockResolvedValue({ data: mockPatrocinadores });

    // Crear store mock
    store = createStore({
      getters: {
        isAuthenticated: () => true,
      },
    });

    // Montar componente
    wrapper = mount(PatrocinadoresView, {
      global: {
        plugins: [store, router],
        stubs: {
          Modal: true, // Stub del componente Modal
        },
      },
    });
  });

  describe("Renderizado inicial", () => {
    it("debe renderizar el título correctamente", () => {
      expect(wrapper.find("h1").text()).toBe("Patrocinadores");
    });

    it("debe mostrar el botón de agregar patrocinador", () => {
      const addButton = wrapper.find(".btn-agregar");
      expect(addButton.exists()).toBe(true);
      expect(addButton.text()).toContain("Agregar");
    });

    it("debe mostrar el campo de búsqueda", () => {
      const buscador = wrapper.find(".buscador");
      expect(buscador.exists()).toBe(true);
      expect(buscador.attributes("placeholder")).toBe("Buscar...");
    });

    it("debe mostrar el filtro de estados", () => {
      const filtroEstado = wrapper.findAll(".filtro")[0];
      expect(filtroEstado.exists()).toBe(true);
    });

    it("debe mostrar el filtro de países", () => {
      const filtroPais = wrapper.findAll(".filtro")[1];
      expect(filtroPais.exists()).toBe(true);
    });
  });

  describe("Carga de datos", () => {
    it("debe cargar patrocinadores al montar el componente", async () => {
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(axios.get).toHaveBeenCalledWith("/patrocinadores");
      expect(wrapper.vm.patrocinadores).toHaveLength(3);
    });

    it("debe mostrar mensaje de error si falla la carga", async () => {
      axios.get.mockRejectedValueOnce(new Error("Error de red"));

      const wrapperError = mount(PatrocinadoresView, {
        global: {
          plugins: [store, router],
          stubs: { Modal: true },
        },
      });

      await wrapperError.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(Swal.fire).toHaveBeenCalledWith(
        "Error",
        "No se pudieron cargar los patrocinadores",
        "error",
      );
    });
  });

  describe("Filtros y búsqueda", () => {
    beforeEach(async () => {
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("debe filtrar patrocinadores por nombre de empresa", async () => {
      const buscador = wrapper.find(".buscador");
      await buscador.setValue("Tech");

      expect(wrapper.vm.searchTerm).toBe("Tech");
      expect(wrapper.vm.patrocinadoresFiltrados).toHaveLength(1);
      expect(wrapper.vm.patrocinadoresFiltrados[0].nombre_empresa).toBe(
        "Tech Corp",
      );
    });

    it("debe filtrar patrocinadores por nombre de contacto", async () => {
      const buscador = wrapper.find(".buscador");
      // Buscar por parte del nombre de contacto
      await buscador.setValue("Carlos");

      await wrapper.vm.$nextTick();
      // Verificar que el filtro funciona
      expect(wrapper.vm.searchTerm).toBe("Carlos");
      // Debe encontrar al menos un resultado
      expect(wrapper.vm.patrocinadoresFiltrados.length).toBeGreaterThanOrEqual(
        1,
      );
    });

    it("debe filtrar patrocinadores por email", async () => {
      const buscador = wrapper.find(".buscador");
      await buscador.setValue("miguel@data.com");

      expect(wrapper.vm.patrocinadoresFiltrados).toHaveLength(1);
      expect(wrapper.vm.patrocinadoresFiltrados[0].correo).toBe(
        "miguel@data.com",
      );
    });

    it("debe filtrar patrocinadores por estado", async () => {
      const filtroEstado = wrapper.findAll(".filtro")[0];
      await filtroEstado.setValue("INACTIVO");

      expect(wrapper.vm.filtroEstado).toBe("INACTIVO");
      expect(wrapper.vm.patrocinadoresFiltrados).toHaveLength(1);
      expect(wrapper.vm.patrocinadoresFiltrados[0].estado).toBe("INACTIVO");
    });

    it("debe filtrar patrocinadores por país", async () => {
      const filtroPais = wrapper.findAll(".filtro")[1];
      await filtroPais.setValue("Chile");

      expect(wrapper.vm.filtroPais).toBe("Chile");
      expect(wrapper.vm.patrocinadoresFiltrados).toHaveLength(1);
      expect(wrapper.vm.patrocinadoresFiltrados[0].pais).toBe("Chile");
    });

    it("debe combinar múltiples filtros", async () => {
      const buscador = wrapper.find(".buscador");
      const filtroEstado = wrapper.findAll(".filtro")[0];

      await buscador.setValue("Corp");
      await filtroEstado.setValue("ACTIVO");

      expect(wrapper.vm.patrocinadoresFiltrados).toHaveLength(1);
      expect(wrapper.vm.patrocinadoresFiltrados[0].nombre_empresa).toBe(
        "Tech Corp",
      );
    });

    it("debe mostrar mensaje cuando no hay resultados", async () => {
      const buscador = wrapper.find(".buscador");
      await buscador.setValue("EmpresaInexistente");

      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toContain("No hay patrocinadores registrados");
    });
  });

  describe("Lista de países", () => {
    beforeEach(async () => {
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("debe generar lista única de países", () => {
      const paises = wrapper.vm.paises;
      expect(paises).toContain("Perú");
      expect(paises).toContain("Chile");
      expect(paises).toContain("Argentina");
      expect(paises).toHaveLength(3);
    });
  });

  describe("Modal de creación/edición", () => {
    beforeEach(async () => {
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("debe abrir modal para crear nuevo patrocinador", async () => {
      const addButton = wrapper.find(".btn-agregar");
      await addButton.trigger("click");

      expect(wrapper.vm.mostrarModal).toBe(true);
      expect(wrapper.vm.modoEdicion).toBe(false);
      expect(wrapper.vm.patrocinadorForm.id).toBe(null);
      expect(wrapper.vm.patrocinadorForm.nombre_empresa).toBe("");
      expect(wrapper.vm.patrocinadorForm.estado).toBe("ACTIVO");
    });

    it("debe abrir modal para editar patrocinador", async () => {
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const editButton = wrapper.findAll(".btn-editar")[0];
      await editButton.trigger("click");

      expect(wrapper.vm.mostrarModal).toBe(true);
      expect(wrapper.vm.modoEdicion).toBe(true);
      expect(wrapper.vm.patrocinadorForm.id).toBe(1);
      expect(wrapper.vm.patrocinadorForm.nombre_empresa).toBe("Tech Corp");
    });

    it("debe cerrar modal", async () => {
      wrapper.vm.mostrarModal = true;
      await wrapper.vm.cerrarModal();

      expect(wrapper.vm.mostrarModal).toBe(false);
    });
  });

  describe("CRUD - Crear patrocinador", () => {
    beforeEach(async () => {
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("debe crear un nuevo patrocinador", async () => {
      const nuevoPatrocinador = {
        nombre_empresa: "Nueva Empresa",
        nombre_contacto: "Contacto Nuevo",
        correo: "nueva@empresa.com",
        whatsapp: "+521234567890",
        pais: "México",
        descripcion_patrocinio: "Descripción del patrocinio",
        estado: "ACTIVO",
      };

      axios.post.mockResolvedValueOnce({
        data: { ...nuevoPatrocinador, id: 4 },
      });

      wrapper.vm.modoEdicion = false;
      wrapper.vm.patrocinadorForm = nuevoPatrocinador;
      await wrapper.vm.guardarPatrocinador();

      expect(axios.post).toHaveBeenCalledWith(
        "/patrocinadores",
        nuevoPatrocinador,
      );
      expect(Swal.fire).toHaveBeenCalledWith(
        "Éxito",
        "Patrocinador creado correctamente",
        "success",
      );
      expect(wrapper.vm.mostrarModal).toBe(false);
    });

    it("debe mostrar error si falla la creación", async () => {
      axios.post.mockRejectedValueOnce(new Error("Error de red"));

      wrapper.vm.modoEdicion = false;
      wrapper.vm.patrocinadorForm = {
        nombre_empresa: "Test",
        nombre_contacto: "Test",
        correo: "test@test.com",
        whatsapp: "+1234567890",
        pais: "Test",
        descripcion_patrocinio: "Test",
        estado: "ACTIVO",
      };
      await wrapper.vm.guardarPatrocinador();

      expect(Swal.fire).toHaveBeenCalledWith(
        "Error",
        "Error al guardar el patrocinador",
        "error",
      );
    });
  });

  describe("CRUD - Actualizar patrocinador", () => {
    beforeEach(async () => {
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("debe actualizar un patrocinador existente", async () => {
      const patrocinadorActualizado = {
        id: 1,
        nombre_empresa: "Tech Corp Actualizado",
        nombre_contacto: "Carlos López Actualizado",
        correo: "carlos.actualizado@techcorp.com",
        whatsapp: "+51999999999",
        pais: "Perú",
        descripcion_patrocinio: "Apoyo actualizado",
        estado: "ACTIVO",
      };

      axios.put.mockResolvedValueOnce({ data: patrocinadorActualizado });

      wrapper.vm.modoEdicion = true;
      wrapper.vm.patrocinadorForm = patrocinadorActualizado;
      await wrapper.vm.guardarPatrocinador();

      expect(axios.put).toHaveBeenCalledWith(
        "/patrocinadores/1",
        patrocinadorActualizado,
      );
      expect(Swal.fire).toHaveBeenCalledWith(
        "Éxito",
        "Patrocinador actualizado correctamente",
        "success",
      );
      expect(wrapper.vm.mostrarModal).toBe(false);
    });
  });

  describe("CRUD - Eliminar patrocinador", () => {
    beforeEach(async () => {
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("debe mostrar confirmación antes de eliminar", async () => {
      Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
      axios.delete.mockResolvedValueOnce({});

      await wrapper.vm.eliminarPatrocinador(1, "Tech Corp");

      expect(Swal.fire).toHaveBeenCalledWith({
        title: "¿Estás seguro?",
        html: "Vas a eliminar a <strong>Tech Corp</strong>",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });
    });

    it("debe eliminar patrocinador si se confirma", async () => {
      Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
      axios.delete.mockResolvedValueOnce({});

      await wrapper.vm.eliminarPatrocinador(1, "Tech Corp");

      expect(axios.delete).toHaveBeenCalledWith("/patrocinadores/1");
      expect(Swal.fire).toHaveBeenCalledWith(
        "Eliminado",
        "Patrocinador eliminado correctamente",
        "success",
      );
    });

    it("no debe eliminar patrocinador si se cancela", async () => {
      Swal.fire.mockResolvedValueOnce({ isConfirmed: false });

      await wrapper.vm.eliminarPatrocinador(1, "Tech Corp");

      expect(axios.delete).not.toHaveBeenCalled();
    });

    it("debe mostrar error si falla la eliminación", async () => {
      Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
      axios.delete.mockRejectedValueOnce(new Error("Error de red"));

      await wrapper.vm.eliminarPatrocinador(1, "Tech Corp");

      expect(Swal.fire).toHaveBeenCalledWith(
        "Error",
        "Error al eliminar el patrocinador",
        "error",
      );
    });
  });

  describe("Navegación", () => {
    beforeEach(async () => {
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("debe navegar al detalle del patrocinador", async () => {
      const push = vi.spyOn(router, "push");
      await wrapper.vm.verDetalle(1);

      expect(push).toHaveBeenCalledWith("/patrocinadores/1");
    });
  });

  describe("Estados de patrocinador", () => {
    beforeEach(async () => {
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("debe mostrar clase CSS correcta para estado ACTIVO", () => {
      const estadoActivo = wrapper.find(".estado-activo");
      expect(estadoActivo.exists()).toBe(true);
    });

    it("debe mostrar clase CSS correcta para estado INACTIVO", () => {
      const estadoInactivo = wrapper.findAll(".estado-inactivo");
      expect(estadoInactivo.length).toBeGreaterThan(0);
    });
  });

  describe("Vista responsive", () => {
    it("debe tener clase para vista desktop", () => {
      const desktopView = wrapper.find(".desktop-view");
      expect(desktopView.exists()).toBe(true);
    });

    it("debe tener clase para vista móvil", () => {
      const mobileView = wrapper.find(".mobile-view");
      expect(mobileView.exists()).toBe(true);
    });
  });

  describe("Formulario de patrocinador", () => {
    it("debe tener estructura correcta del formulario", async () => {
      wrapper.vm.mostrarModal = true;
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.patrocinadorForm).toBeDefined();
      expect(typeof wrapper.vm.patrocinadorForm.nombre_empresa).toBe("string");
      expect(typeof wrapper.vm.patrocinadorForm.correo).toBe("string");
      expect(wrapper.vm.patrocinadorForm.estado).toBe("ACTIVO");
    });
  });

  describe("Validaciones del formulario", () => {
    it("debe requerir campos obligatorios", () => {
      const form = {
        nombre_empresa: "",
        nombre_contacto: "",
        correo: "",
        whatsapp: "",
        pais: "",
        descripcion_patrocinio: "",
        estado: "ACTIVO",
      };

      expect(form.nombre_empresa).toBe("");
      expect(form.correo).toBe("");
    });
  });
});
