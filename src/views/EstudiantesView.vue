<template>
    <div class="estudiantes-container">
        <div class="header">
            <h1>Estudiantes</h1>
            <button @click="abrirModalCrear" class="btn-agregar">
                + Agregar Estudiante
            </button>
        </div>

        <!-- Buscador y filtros -->
        <div class="filtros">
            <input type="text" v-model="searchTerm" placeholder="Buscar por nombre o email..." class="buscador" />
            <select v-model="filtroPais" class="filtro">
                <option value="">Todos los países</option>
                <option v-for="pais in paises" :key="pais" :value="pais">
                    {{ pais }}
                </option>
            </select>
        </div>

        <!-- Tabla de estudiantes -->
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>WhatsApp</th>
                        <th>País</th>
                        <th>Fecha Nacimiento</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="estudiante in estudiantesFiltrados" :key="estudiante.id">
                        <td>{{ estudiante.nombre }}</td>
                        <td>{{ estudiante.correo }}</td>
                        <td>{{ estudiante.whatsapp }}</td>
                        <td>{{ estudiante.pais }}</td>
                        <td>{{ estudiante.fecha_nacimiento }}</td>
                        <td class="acciones">
                            <button @click="verDetalle(estudiante.id)" class="btn-ver">
                                👁️
                            </button>
                            <button @click="editarEstudiante(estudiante)" class="btn-editar">
                                ✏️
                            </button>
                            <button @click="eliminarEstudiante(estudiante.id)" class="btn-eliminar">
                                🗑️
                            </button>
                        </td>
                    </tr>
                    <tr v-if="estudiantesFiltrados.length === 0">
                        <td colspan="6" class="no-data">No hay estudiantes registrados</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal para crear/editar -->
        <div v-if="mostrarModal" class="modal" @click.self="cerrarModal">
            <div class="modal-content">
                <h2>{{ modoEdicion ? "Editar Estudiante" : "Nuevo Estudiante" }}</h2>
                <form @submit.prevent="guardarEstudiante">
                    <div class="form-group">
                        <label>Nombre:</label>
                        <input type="text" v-model="estudianteForm.nombre" required />
                    </div>
                    <div class="form-group">
                        <label>Email:</label>
                        <input type="email" v-model="estudianteForm.correo" required />
                    </div>
                    <div class="form-group">
                        <label>WhatsApp:</label>
                        <input type="text" v-model="estudianteForm.whatsapp" placeholder="+1234567890" required />
                    </div>
                    <div class="form-group">
                        <label>País:</label>
                        <input type="text" v-model="estudianteForm.pais" required />
                    </div>
                    <div class="form-group">
                        <label>Fecha Nacimiento:</label>
                        <input type="date" v-model="estudianteForm.fecha_nacimiento" required />
                    </div>
                    <div class="modal-actions">
                        <button type="button" @click="cerrarModal" class="btn-cancelar">
                            Cancelar
                        </button>
                        <button type="submit" class="btn-guardar">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/config/axios";
import Swal from "sweetalert2";

export default {
    name: "EstudiantesView",
    setup() {
        const router = useRouter();
        const estudiantes = ref([]);
        const searchTerm = ref("");
        const filtroPais = ref("");
        const mostrarModal = ref(false);
        const modoEdicion = ref(false);
        const estudianteForm = ref({
            id: null,
            nombre: "",
            correo: "",
            whatsapp: "",
            pais: "",
            fecha_nacimiento: "",
        });

        const paises = computed(() => {
            return [...new Set(estudiantes.value.map((e) => e.pais))];
        });

        const estudiantesFiltrados = computed(() => {
            let filtered = estudiantes.value;

            if (searchTerm.value) {
                const term = searchTerm.value.toLowerCase();
                filtered = filtered.filter(
                    (e) =>
                        e.nombre.toLowerCase().includes(term) ||
                        e.correo.toLowerCase().includes(term)
                );
            }

            if (filtroPais.value) {
                filtered = filtered.filter((e) => e.pais === filtroPais.value);
            }

            return filtered;
        });

        const cargarEstudiantes = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/estudiantes/"
                );
                estudiantes.value = response.data;
            } catch (error) {
                console.error("Error cargando estudiantes:", error);
                Swal.fire("Error", "No se pudieron cargar los estudiantes", "error");
            }
        };

        const abrirModalCrear = () => {
            modoEdicion.value = false;
            estudianteForm.value = {
                id: null,
                nombre: "",
                correo: "",
                whatsapp: "",
                pais: "",
                fecha_nacimiento: "",
            };
            mostrarModal.value = true;
        };

        const editarEstudiante = (estudiante) => {
            modoEdicion.value = true;
            estudianteForm.value = { ...estudiante };
            mostrarModal.value = true;
        };

        const guardarEstudiante = async () => {
            try {
                if (modoEdicion.value) {
                    await axios.put(
                        `http://localhost:8000/api/estudiantes/${estudianteForm.value.id}/`,
                        estudianteForm.value
                    );
                    Swal.fire("Éxito", "Estudiante actualizado", "success");
                } else {
                    await axios.post(
                        "http://localhost:8000/api/estudiantes/",
                        estudianteForm.value
                    );
                    Swal.fire("Éxito", "Estudiante creado", "success");
                }
                cerrarModal();
                cargarEstudiantes();
            } catch (error) {
                console.error("Error guardando estudiante:", error);
                Swal.fire("Error", "Error al guardar el estudiante", "error");
            }
        };

        const eliminarEstudiante = async (id) => {
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: "No podrás revertir esto",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });

            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:8000/api/estudiantes/${id}/`);
                    Swal.fire("Eliminado", "Estudiante eliminado", "success");
                    cargarEstudiantes();
                } catch (error) {
                    console.error("Error eliminando estudiante:", error);
                    Swal.fire("Error", "Error al eliminar el estudiante", "error");
                }
            }
        };

        const verDetalle = (id) => {
            router.push(`/estudiantes/${id}`);
        };

        const cerrarModal = () => {
            mostrarModal.value = false;
        };

        onMounted(() => {
            cargarEstudiantes();
        });

        return {
            estudiantes,
            searchTerm,
            filtroPais,
            paises,
            estudiantesFiltrados,
            mostrarModal,
            modoEdicion,
            estudianteForm,
            abrirModalCrear,
            editarEstudiante,
            guardarEstudiante,
            eliminarEstudiante,
            verDetalle,
            cerrarModal,
        };
    },
};
</script>

<style scoped>
.estudiantes-container {
    background: white;
    border-radius: 10px;
    padding: 2rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.btn-agregar {
    background: #28a745;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}

.btn-agregar:hover {
    background: #218838;
}

.filtros {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.buscador,
.filtro {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
}

.buscador {
    flex: 2;
}

.filtro {
    flex: 1;
}

.table-container {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background: #f8f9fa;
    font-weight: 600;
}

.acciones {
    display: flex;
    gap: 0.5rem;
}

.btn-ver,
.btn-editar,
.btn-eliminar {
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 1rem;
}

.btn-ver {
    background: #17a2b8;
    color: white;
}

.btn-editar {
    background: #ffc107;
    color: #333;
}

.btn-eliminar {
    background: #dc3545;
    color: white;
}

.no-data {
    text-align: center;
    color: #999;
    padding: 2rem;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
}

.btn-cancelar {
    background: #6c757d;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
}

.btn-guardar {
    background: #28a745;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
}
</style>
