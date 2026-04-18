import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EstudiantesView from "@/views/EstudiantesView.vue";
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
    { path: "/estudiantes/:id", name: "estudiante-detalle" },
    { path: "/estudiantes", name: "estudiantes" },
  ],
});

describe("EstudiantesView.vue", () => {
  let store;
  let wrapper;
  const mockEstudiantes = [
    {
      id: 1,
      nombre: "Juan Pérez",
      correo: "juan@example.com",
      whatsapp: "+51987654321",
      pais: "Perú",
      fecha_nacimiento: "2005-01-15",
    },
    {
      id: 2,
      nombre: "María García",
      correo: "maria@example.com",
      whatsapp: "+573001234567",
      pais: "Colombia",
      fecha_nacimiento: "2006-03-20",
    },
    {
      id: 3,
      nombre: "Carlos López",
      correo: "carlos@example.com",
      whatsapp: "+5491122334455",
      pais: "Argentina",
      fecha_nacimiento: "2005-08-10",
    },
  ];

  beforeEach(() => {
    // Resetear mocks
    vi.clearAllMocks();

    // Mock de la respuesta de axios
    axios.get.mockResolvedValue({ data: mockEstudiantes });

    // Crear store mock
    store = createStore({
      getters: {
        isAuthenticated: () => true,
      },
    });

    // Montar componente
    wrapper = mount(EstudiantesView, {
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
      expect(wrapper.find("h1").text()).toBe("Estudiantes");
    });

    it("debe mostrar el botón de agregar estudiante", () => {
      const addButton = wrapper.find(".btn-agregar");
      expect(addButton.exists()).toBe(true);
      expect(addButton.text()).toContain("Agregar");
    });

    it("debe mostrar el campo de búsqueda", () => {
      const buscador = wrapper.find(".buscador");
      expect(buscador.exists()).toBe(true);
      expect(buscador.attributes("placeholder")).toBe("Buscar...");
    });

    it("debe mostrar el filtro de países", () => {
      const filtro = wrapper.find(".filtro");
      expect(filtro.exists()).toBe(true);
    });
  });

  describe("Carga de datos", () => {
    it("debe cargar estudiantes al montar el componente", async () => {
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(axios.get).toHaveBeenCalledWith("/estudiantes");
      expect(wrapper.vm.estudiantes).toHaveLength(3);
    });

    it("debe mostrar mensaje de error si falla la carga", async () => {
      axios.get.mockRejectedValueOnce(new Error("Error de red"));

      const wrapperError = mount(EstudiantesView, {
        global: {
          plugins: [store, router],
          stubs: { Modal: true },
        },
      });

      await wrapperError.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(Swal.fire).toHaveBeenCalledWith(
        "Error",
        "No se pudieron cargar los estudiantes",
        "error",
      );
    });
  });

  describe("Filtros y búsqueda", () => {
    beforeEach(async () => {
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("debe filtrar estudiantes por nombre", async () => {
      const buscador = wrapper.find(".buscador");
      await buscador.setValue("Juan");

      expect(wrapper.vm.searchTerm).toBe("Juan");
      expect(wrapper.vm.estudiantesFiltrados).toHaveLength(1);
      expect(wrapper.vm.estudiantesFiltrados[0].nombre).toBe("Juan Pérez");
    });

    it("debe filtrar estudiantes por email", async () => {
      const buscador = wrapper.find(".buscador");
      await buscador.setValue("maria@example.com");

      expect(wrapper.vm.estudiantesFiltrados).toHaveLength(1);
      expect(wrapper.vm.estudiantesFiltrados[0].nombre).toBe("María García");
    });

    it("debe filtrar estudiantes por país", async () => {
      const filtro = wrapper.find(".filtro");
      await filtro.setValue("Perú");

      expect(wrapper.vm.filtroPais).toBe("Perú");
      expect(wrapper.vm.estudiantesFiltrados).toHaveLength(1);
      expect(wrapper.vm.estudiantesFiltrados[0].pais).toBe("Perú");
    });

    it("debe combinar filtro de búsqueda y país", async () => {
      const buscador = wrapper.find(".buscador");
      const filtro = wrapper.find(".filtro");

      await buscador.setValue("a");
      await filtro.setValue("Colombia");

      expect(wrapper.vm.estudiantesFiltrados).toHaveLength(1);
      expect(wrapper.vm.estudiantesFiltrados[0].nombre).toBe("María García");
    });

    it("debe mostrar mensaje cuando no hay resultados", async () => {
      const buscador = wrapper.find(".buscador");
      await buscador.setValue("NombreInexistente");

      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toContain("No hay estudiantes registrados");
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
      expect(paises).toContain("Colombia");
      expect(paises).toContain("Argentina");
      expect(paises).toHaveLength(3);
    });
  });

  describe("Modal de creación/edición", () => {
    it("debe abrir modal para crear nuevo estudiante", async () => {
      const addButton = wrapper.find(".btn-agregar");
      await addButton.trigger("click");

      expect(wrapper.vm.mostrarModal).toBe(true);
      expect(wrapper.vm.modoEdicion).toBe(false);
      expect(wrapper.vm.estudianteForm.id).toBe(null);
      expect(wrapper.vm.estudianteForm.nombre).toBe("");
    });

    it("debe abrir modal para editar estudiante", async () => {
      // Primero esperar que carguen los datos
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const editButton = wrapper.findAll(".btn-editar")[0];
      await editButton.trigger("click");

      expect(wrapper.vm.mostrarModal).toBe(true);
      expect(wrapper.vm.modoEdicion).toBe(true);
      expect(wrapper.vm.estudianteForm.id).toBe(1);
      expect(wrapper.vm.estudianteForm.nombre).toBe("Juan Pérez");
    });

    it("debe cerrar modal", async () => {
      wrapper.vm.mostrarModal = true;
      await wrapper.vm.cerrarModal();

      expect(wrapper.vm.mostrarModal).toBe(false);
    });
  });

  describe("CRUD - Crear estudiante", () => {
    beforeEach(async () => {
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("debe crear un nuevo estudiante", async () => {
      const nuevoEstudiante = {
        nombre: "Nuevo Estudiante",
        correo: "nuevo@example.com",
        whatsapp: "+521234567890",
        pais: "México",
        fecha_nacimiento: "2007-01-01",
      };

      axios.post.mockResolvedValueOnce({ data: { ...nuevoEstudiante, id: 4 } });

      wrapper.vm.modoEdicion = false;
      wrapper.vm.estudianteForm = nuevoEstudiante;
      await wrapper.vm.guardarEstudiante();

      expect(axios.post).toHaveBeenCalledWith("/estudiantes", nuevoEstudiante);
      expect(Swal.fire).toHaveBeenCalledWith(
        "Éxito",
        "Estudiante creado",
        "success",
      );
      expect(wrapper.vm.mostrarModal).toBe(false);
    });

    it("debe mostrar error si falla la creación", async () => {
      axios.post.mockRejectedValueOnce(new Error("Error de red"));

      wrapper.vm.modoEdicion = false;
      wrapper.vm.estudianteForm = {
        nombre: "Test",
        correo: "test@test.com",
        whatsapp: "+1234567890",
        pais: "Test",
        fecha_nacimiento: "2000-01-01",
      };
      await wrapper.vm.guardarEstudiante();

      expect(Swal.fire).toHaveBeenCalledWith(
        "Error",
        "Error al guardar el estudiante",
        "error",
      );
    });
  });

  describe("CRUD - Actualizar estudiante", () => {
    beforeEach(async () => {
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("debe actualizar un estudiante existente", async () => {
      const estudianteActualizado = {
        id: 1,
        nombre: "Juan Pérez Actualizado",
        correo: "juan.actualizado@example.com",
        whatsapp: "+51987654321",
        pais: "Perú",
        fecha_nacimiento: "2005-01-15",
      };

      axios.put.mockResolvedValueOnce({ data: estudianteActualizado });

      wrapper.vm.modoEdicion = true;
      wrapper.vm.estudianteForm = estudianteActualizado;
      await wrapper.vm.guardarEstudiante();

      expect(axios.put).toHaveBeenCalledWith(
        "/estudiantes/1",
        estudianteActualizado,
      );
      expect(Swal.fire).toHaveBeenCalledWith(
        "Éxito",
        "Estudiante actualizado",
        "success",
      );
      expect(wrapper.vm.mostrarModal).toBe(false);
    });
  });

  describe("CRUD - Eliminar estudiante", () => {
    beforeEach(async () => {
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("debe mostrar confirmación antes de eliminar", async () => {
      Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
      axios.delete.mockResolvedValueOnce({});

      await wrapper.vm.eliminarEstudiante(1);

      expect(Swal.fire).toHaveBeenCalledWith({
        title: "¿Estás seguro?",
        text: "No podrás revertir esto",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });
    });

    it("debe eliminar estudiante si se confirma", async () => {
      Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
      axios.delete.mockResolvedValueOnce({});

      await wrapper.vm.eliminarEstudiante(1);

      expect(axios.delete).toHaveBeenCalledWith("/estudiantes/1");
      expect(Swal.fire).toHaveBeenCalledWith(
        "Eliminado",
        "Estudiante eliminado",
        "success",
      );
    });

    it("no debe eliminar estudiante si se cancela", async () => {
      Swal.fire.mockResolvedValueOnce({ isConfirmed: false });

      await wrapper.vm.eliminarEstudiante(1);

      expect(axios.delete).not.toHaveBeenCalled();
    });

    it("debe mostrar error si falla la eliminación", async () => {
      Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
      axios.delete.mockRejectedValueOnce(new Error("Error de red"));

      await wrapper.vm.eliminarEstudiante(1);

      expect(Swal.fire).toHaveBeenCalledWith(
        "Error",
        "Error al eliminar el estudiante",
        "error",
      );
    });
  });

  describe("Navegación", () => {
    beforeEach(async () => {
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("debe navegar al detalle del estudiante", async () => {
      const push = vi.spyOn(router, "push");
      await wrapper.vm.verDetalle(1);

      expect(push).toHaveBeenCalledWith("/estudiantes/1");
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

  describe("Formulario de estudiante", () => {
    it("debe tener estructura correcta del formulario", async () => {
      wrapper.vm.mostrarModal = true;
      await wrapper.vm.$nextTick();

      // El modal está stubbeado, pero verificamos que los datos existen
      expect(wrapper.vm.estudianteForm).toBeDefined();
      expect(typeof wrapper.vm.estudianteForm.nombre).toBe("string");
      expect(typeof wrapper.vm.estudianteForm.correo).toBe("string");
    });
  });
});
