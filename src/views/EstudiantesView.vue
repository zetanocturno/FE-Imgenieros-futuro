<template>
    <div class="estudiantes-container">
        <div class="header">
            <h1>Estudiantes</h1>
            <button @click="abrirModalCrear" class="btn-agregar">
                + Agregar
            </button>
        </div>

        <!-- Buscador y filtros -->
        <div class="filtros">
            <input type="text" v-model="searchTerm" placeholder="Buscar..." class="buscador" />
            <select v-model="filtroPais" class="filtro">
                <option value="">Todos los países</option>
                <option v-for="pais in paises" :key="pais" :value="pais">
                    {{ pais }}
                </option>
            </select>
        </div>

        <!-- Vista Desktop: Tabla -->
        <div class="table-container desktop-view">
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>WhatsApp</th>
                        <th>País</th>
                        <th>Fecha Nac.</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="estudiante in estudiantesFiltrados" :key="estudiante.id">
                        <td data-label="Nombre">{{ estudiante.nombre }}</td>
                        <td data-label="Email">{{ estudiante.correo }}</td>
                        <td data-label="WhatsApp">{{ estudiante.whatsapp }}</td>
                        <td data-label="País">{{ estudiante.pais }}</td>
                        <td data-label="Fecha Nac.">{{ estudiante.fecha_nacimiento }}</td>
                        <td class="acciones">
                            <button @click="verDetalle(estudiante.id)" class="btn-ver">👁️</button>
                            <button @click="editarEstudiante(estudiante)" class="btn-editar">✏️</button>
                            <button @click="eliminarEstudiante(estudiante.id)" class="btn-eliminar">🗑️</button>
                        </td>
                    </tr>
                    <tr v-if="estudiantesFiltrados.length === 0">
                        <td colspan="6" class="no-data">No hay estudiantes registrados</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Vista Móvil: Tarjetas -->
        <div class="mobile-view">
            <div v-for="estudiante in estudiantesFiltrados" :key="estudiante.id" class="card">
                <div class="card-header">
                    <strong>{{ estudiante.nombre }}</strong>
                    <div class="card-actions">
                        <button @click="verDetalle(estudiante.id)" class="btn-ver">👁️</button>
                        <button @click="editarEstudiante(estudiante)" class="btn-editar">✏️</button>
                        <button @click="eliminarEstudiante(estudiante.id)" class="btn-eliminar">🗑️</button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="card-field">
                        <span>Email:</span> {{ estudiante.correo }}
                    </div>
                    <div class="card-field">
                        <span>WhatsApp:</span> {{ estudiante.whatsapp }}
                    </div>
                    <div class="card-field">
                        <span>País:</span> {{ estudiante.pais }}
                    </div>
                    <div class="card-field">
                        <span>Fecha Nac.:</span> {{ estudiante.fecha_nacimiento }}
                    </div>
                </div>
            </div>
            <div v-if="estudiantesFiltrados.length === 0" class="no-data-mobile">
                No hay estudiantes registrados
            </div>
        </div>

        <!-- Modal reutilizable -->
        <Modal :visible="mostrarModal" :title="modoEdicion ? 'Editar Estudiante' : 'Nuevo Estudiante'"
            @close="cerrarModal" @save="guardarEstudiante">
            <template #form-fields>
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
                <div class="form-row">
                    <div class="form-group">
                        <label>País:</label>
                        <input type="text" v-model="estudianteForm.pais" required />
                    </div>
                    <div class="form-group">
                        <label>Fecha Nacimiento:</label>
                        <input type="date" v-model="estudianteForm.fecha_nacimiento" required />
                    </div>
                </div>
            </template>
        </Modal>
    </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/config/axios";
import Swal from "sweetalert2";
import Modal from "@/components/Modal.vue";

export default {
    name: "EstudiantesView",
    components: { Modal },
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
                const response = await axios.get('/estudiantes');
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
                    await axios.put(`/estudiantes/${estudianteForm.value.id}`, estudianteForm.value)
                    Swal.fire("Éxito", "Estudiante actualizado", "success");
                } else {
                    await axios.post('/estudiantes', estudianteForm.value)
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
                    await axios.delete(`/estudiantes/${id}`);
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
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Header */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.header h1 {
    font-size: 1.5rem;
    margin: 0;
}

.btn-agregar {
    background: #28a745;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;
    font-size: 0.875rem;
}

.btn-agregar:hover {
    background: #218838;
}

/* Filtros */
.filtros {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.buscador,
.filtro {
    padding: 0.625rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 0.875rem;
}

.buscador {
    flex: 2;
}

.filtro {
    flex: 1;
}

/* Vista Desktop - Tabla */
.desktop-view {
    overflow-x: auto;
}

.desktop-view table {
    width: 100%;
    border-collapse: collapse;
}

.desktop-view th,
.desktop-view td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.desktop-view th {
    background: #f8f9fa;
    font-weight: 600;
}

/* Vista Móvil - Tarjetas */
.mobile-view {
    display: none;
}

.card {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e9ecef;
}

.card-header strong {
    font-size: 1rem;
    color: #333;
}

.card-actions {
    display: flex;
    gap: 0.5rem;
}

.card-field {
    font-size: 0.8rem;
    padding: 0.25rem 0;
    display: flex;
    flex-wrap: wrap;
}

.card-field span {
    font-weight: 600;
    width: 100px;
    color: #666;
}

/* Botones de acción */
.acciones {
    display: flex;
    gap: 0.5rem;
}

.btn-ver,
.btn-editar,
.btn-eliminar {
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
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

/* Mensaje sin datos */
.no-data {
    text-align: center;
    color: #999;
    padding: 2rem;
}

.no-data-mobile {
    text-align: center;
    color: #999;
    padding: 2rem;
}

/* Formulario */
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

/* ============================================ */
/* RESPONSIVE: MÓVIL (menos de 768px) */
/* ============================================ */
@media (max-width: 768px) {
    .estudiantes-container {
        padding: 0.75rem;
    }

    .header h1 {
        font-size: 1.125rem;
    }

    /* Filtros en columna */
    .filtros {
        flex-direction: column;
        gap: 0.75rem;
    }

    .buscador,
    .filtro {
        width: 100%;
    }

    /* Ocultar tabla, mostrar tarjetas */
    .desktop-view {
        display: none;
    }

    .mobile-view {
        display: block;
    }

    /* Formulario en columna */
    .form-row {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }
}

/* ============================================ */
/* RESPONSIVE: TABLET (768px a 1024px) */
/* ============================================ */
@media (min-width: 769px) and (max-width: 1024px) {
    .estudiantes-container {
        padding: 1rem;
    }

    .header h1 {
        font-size: 1.25rem;
    }
}

/* ============================================ */
/* MEJORAS PARA TACTIL (móviles y tablets) */
/* ============================================ */
@media (max-width: 1024px) {

    /* Botones más grandes para dedos */
    .btn-agregar,
    .btn-ver,
    .btn-editar,
    .btn-eliminar {
        min-height: 44px;
        min-width: 44px;
    }

    .btn-ver,
    .btn-editar,
    .btn-eliminar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    /* Evita zoom en iOS al enfocar inputs */
    input,
    select {
        font-size: 16px !important;
    }
}
</style>