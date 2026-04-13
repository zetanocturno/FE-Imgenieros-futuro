<template>
    <div class="patrocinios-container">
        <div class="header">
            <h1>Patrocinios</h1>
            <button @click="abrirModalCrear" class="btn-agregar">
                + Agregar
            </button>
        </div>

        <!-- Filtros -->
        <div class="filtros">
            <select v-model="filtroEstado" class="filtro">
                <option value="">Todos los estados</option>
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
                <option value="CONCLUIDO">Concluido</option>
            </select>
            <select v-model="filtroPatrocinador" class="filtro">
                <option value="">Todos los patrocinadores</option>
                <option v-for="p in patrocinadores" :key="p.id" :value="p.id">
                    {{ p.nombre_empresa }}
                </option>
            </select>
        </div>

        <!-- Vista Desktop: Tabla -->
        <div class="table-container desktop-view">
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Patrocinador</th>
                        <th>Estudiante</th>
                        <th>Estado</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="patrocinio in patrociniosFiltrados" :key="patrocinio.id">
                        <td data-label="Fecha">{{ formatDate(patrocinio.fecha) }}</td>
                        <td data-label="Patrocinador">{{ getPatrocinadorNombre(patrocinio.patrocinadorId) }}</td>
                        <td data-label="Estudiante">{{ getEstudianteNombre(patrocinio.estudianteId) }}</td>
                        <td data-label="Estado">
                            <span :class="'estado-' + patrocinio.estado.toLowerCase()">
                                {{ patrocinio.estado }}
                            </span>
                        </td>
                        <td data-label="Descripción">{{ patrocinio.descripcion }}</td>
                        <td class="acciones">
                            <button @click="verDetalle(patrocinio.id)" class="btn-ver">👁️</button>
                            <button @click="editarPatrocinio(patrocinio)" class="btn-editar">✏️</button>
                            <button @click="eliminarPatrocinio(patrocinio.id)" class="btn-eliminar">🗑️</button>
                        </td>
                    </tr>
                    <tr v-if="patrociniosFiltrados.length === 0">
                        <td colspan="6" class="no-data">No hay patrocinios registrados</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Vista Móvil: Tarjetas -->
        <div class="mobile-view">
            <div v-for="patrocinio in patrociniosFiltrados" :key="patrocinio.id" class="card">
                <div class="card-header">
                    <strong>{{ getPatrocinadorNombre(patrocinio.patrocinadorId) }}</strong>
                    <div class="card-actions">
                        <button @click="verDetalle(patrocinio.id)" class="btn-ver">👁️</button>
                        <button @click="editarPatrocinio(patrocinio)" class="btn-editar">✏️</button>
                        <button @click="eliminarPatrocinio(patrocinio.id)" class="btn-eliminar">🗑️</button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="card-field">
                        <span>Fecha:</span> {{ formatDate(patrocinio.fecha) }}
                    </div>
                    <div class="card-field">
                        <span>Estudiante:</span> {{ getEstudianteNombre(patrocinio.estudianteId) }}
                    </div>
                    <div class="card-field">
                        <span>Estado:</span>
                        <span :class="'estado-' + patrocinio.estado.toLowerCase()">
                            {{ patrocinio.estado }}
                        </span>
                    </div>
                    <div class="card-field">
                        <span>Descripción:</span> {{ patrocinio.descripcion }}
                    </div>
                </div>
            </div>
            <div v-if="patrociniosFiltrados.length === 0" class="no-data-mobile">
                No hay patrocinios registrados
            </div>
        </div>

        <!-- Modal reutilizable -->
        <Modal :visible="mostrarModal" :title="modoEdicion ? 'Editar Patrocinio' : 'Nuevo Patrocinio'"
            @close="cerrarModal" @save="guardarPatrocinio">
            <template #form-fields>
                <div class="form-group">
                    <label>Patrocinador:</label>
                    <select v-model="patrocinioForm.patrocinadorId" required>
                        <option value="">Seleccione un patrocinador</option>
                        <option v-for="p in patrocinadores" :key="p.id" :value="p.id">
                            {{ p.nombre_empresa }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Estudiante:</label>
                    <select v-model="patrocinioForm.estudianteId" required>
                        <option value="">Seleccione un estudiante</option>
                        <option v-for="e in estudiantes" :key="e.id" :value="e.id">
                            {{ e.nombre }}
                        </option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Estado:</label>
                        <select v-model="patrocinioForm.estado" required>
                            <option value="ACTIVO">Activo</option>
                            <option value="INACTIVO">Inactivo</option>
                            <option value="CONCLUIDO">Concluido</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Fecha:</label>
                        <input type="date" v-model="patrocinioForm.fecha" required />
                    </div>
                </div>
                <div class="form-group">
                    <label>Descripción:</label>
                    <textarea v-model="patrocinioForm.descripcion" rows="3" required></textarea>
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
    name: "PatrociniosView",
    components: { Modal },
    setup() {
        const router = useRouter();
        const patrocinios = ref([]);
        const estudiantes = ref([]);
        const patrocinadores = ref([]);
        const filtroEstado = ref("");
        const filtroPatrocinador = ref("");
        const mostrarModal = ref(false);
        const modoEdicion = ref(false);
        const patrocinioForm = ref({
            id: null,
            patrocinadorId: "",
            estudianteId: "",
            estado: "ACTIVO",
            descripcion: "",
            fecha: new Date().toISOString().split("T")[0],
        });

        const patrociniosFiltrados = computed(() => {
            let filtered = patrocinios.value;

            if (filtroEstado.value) {
                filtered = filtered.filter((p) => p.estado === filtroEstado.value);
            }

            if (filtroPatrocinador.value) {
                filtered = filtered.filter(
                    (p) => p.patrocinadorId === parseInt(filtroPatrocinador.value)
                );
            }

            return filtered;
        });

        const formatDate = (dateString) => {
            if (!dateString) return "";
            const date = new Date(dateString);
            return date.toLocaleDateString("es-ES");
        };

        const getPatrocinadorNombre = (id) => {
            const patrocinador = patrocinadores.value.find((p) => p.id === id);
            return patrocinador ? patrocinador.nombre_empresa : "Desconocido";
        };

        const getEstudianteNombre = (id) => {
            const estudiante = estudiantes.value.find((e) => e.id === id);
            return estudiante ? estudiante.nombre : "Desconocido";
        };

        const cargarDatos = async () => {
            try {
                const [patrociniosRes, estudiantesRes, patrocinadoresRes] =
                    await Promise.all([
                        axios.get("/patrocinios"),
                        axios.get("/estudiantes"),
                        axios.get("/patrocinadores"),
                    ]);
                patrocinios.value = patrociniosRes.data;
                estudiantes.value = estudiantesRes.data;
                patrocinadores.value = patrocinadoresRes.data;
            } catch (error) {
                console.error("Error cargando datos:", error);
                Swal.fire("Error", "No se pudieron cargar los datos", "error");
            }
        };

        const abrirModalCrear = () => {
            modoEdicion.value = false;
            patrocinioForm.value = {
                id: null,
                patrocinadorId: "",
                estudianteId: "",
                estado: "ACTIVO",
                descripcion: "",
                fecha: new Date().toISOString().split("T")[0],
            };
            mostrarModal.value = true;
        };

        const editarPatrocinio = (patrocinio) => {
            modoEdicion.value = true;
            patrocinioForm.value = { ...patrocinio };
            mostrarModal.value = true;
        };

        const guardarPatrocinio = async () => {
            try {
                if (modoEdicion.value) {
                    await axios.put(
                        `/patrocinios/${patrocinioForm.value.id}`,
                        patrocinioForm.value
                    );
                    Swal.fire("Éxito", "Patrocinio actualizado correctamente", "success");
                } else {
                    await axios.post("/patrocinios", patrocinioForm.value);
                    Swal.fire("Éxito", "Patrocinio creado correctamente", "success");
                }
                cerrarModal();
                cargarDatos();
            } catch (error) {
                console.error("Error guardando patrocinio:", error);
                Swal.fire("Error", "Error al guardar el patrocinio", "error");
            }
        };

        const eliminarPatrocinio = async (id) => {
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
                    await axios.delete(`/patrocinios/${id}`);
                    Swal.fire("Eliminado", "Patrocinio eliminado correctamente", "success");
                    cargarDatos();
                } catch (error) {
                    console.error("Error eliminando patrocinio:", error);
                    Swal.fire("Error", "Error al eliminar el patrocinio", "error");
                }
            }
        };

        const verDetalle = (id) => {
            router.push(`/patrocinios/${id}`);
        };

        const cerrarModal = () => {
            mostrarModal.value = false;
        };

        onMounted(() => {
            cargarDatos();
        });

        return {
            patrocinios,
            estudiantes,
            patrocinadores,
            filtroEstado,
            filtroPatrocinador,
            patrociniosFiltrados,
            mostrarModal,
            modoEdicion,
            patrocinioForm,
            formatDate,
            getPatrocinadorNombre,
            getEstudianteNombre,
            abrirModalCrear,
            editarPatrocinio,
            guardarPatrocinio,
            eliminarPatrocinio,
            verDetalle,
            cerrarModal,
        };
    },
};
</script>

<style scoped>
.patrocinios-container {
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
    flex-wrap: wrap;
}

.filtro {
    padding: 0.625rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 0.875rem;
    flex: 1;
    min-width: 150px;
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

/* Estados */
.estado-activo {
    color: #28a745;
    font-weight: bold;
}

.estado-inactivo {
    color: #dc3545;
    font-weight: bold;
}

.estado-concluido {
    color: #6c757d;
    font-weight: bold;
}

/* Mensajes sin datos */
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
    .patrocinios-container {
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

    .filtro {
        width: 100%;
        min-width: auto;
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
    .patrocinios-container {
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
    select,
    textarea {
        font-size: 16px !important;
    }
}
</style>