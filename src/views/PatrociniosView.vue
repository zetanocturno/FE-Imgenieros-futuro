<template>
    <div class="patrocinios-container">
        <div class="header">
            <h1>Patrocinios</h1>
            <button @click="abrirModalCrear" class="btn-agregar">
                + Agregar Patrocinio
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

        <!-- Tabla de patrocinios -->
        <div class="table-container">
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
                        <td>{{ formatDate(patrocinio.fecha) }}</td>
                        <td>{{ getPatrocinadorNombre(patrocinio.patrocinadorId) }}</td>
                        <td>{{ getEstudianteNombre(patrocinio.estudianteId) }}</td>
                        <td>
                            <span :class="'estado-' + patrocinio.estado.toLowerCase()">
                                {{ patrocinio.estado }}
                            </span>
                        </td>
                        <td>{{ patrocinio.descripcion }}</td>
                        <td class="acciones">
                            <button @click="editarPatrocinio(patrocinio)" class="btn-editar">
                                ✏️
                            </button>
                            <button @click="eliminarPatrocinio(patrocinio.id)" class="btn-eliminar">
                                🗑️
                            </button>
                        </td>
                    </tr>
                    <tr v-if="patrociniosFiltrados.length === 0">
                        <td colspan="6" class="no-data">No hay patrocinios registrados</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal para crear/editar -->
        <div v-if="mostrarModal" class="modal" @click.self="cerrarModal">
            <div class="modal-content">
                <h2>{{ modoEdicion ? "Editar Patrocinio" : "Nuevo Patrocinio" }}</h2>
                <form @submit.prevent="guardarPatrocinio">
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
                    <div class="form-group">
                        <label>Estado:</label>
                        <select v-model="patrocinioForm.estado" required>
                            <option value="ACTIVO">Activo</option>
                            <option value="INACTIVO">Inactivo</option>
                            <option value="CONCLUIDO">Concluido</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Descripción:</label>
                        <textarea v-model="patrocinioForm.descripcion" rows="3" required></textarea>
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
import axios from "@/config/axios";

export default {
    name: "PatrociniosView",
    setup() {
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
                    alert("Patrocinio actualizado correctamente");
                } else {
                    await axios.post("/patrocinios", patrocinioForm.value);
                    alert("Patrocinio creado correctamente");
                }
                cerrarModal();
                cargarDatos();
            } catch (error) {
                console.error("Error guardando patrocinio:", error);
                alert("Error al guardar el patrocinio");
            }
        };

        const eliminarPatrocinio = async (id) => {
            if (confirm("¿Estás seguro de eliminar este patrocinio?")) {
                try {
                    await axios.delete(`/patrocinios/${id}`);
                    alert("Patrocinio eliminado correctamente");
                    cargarDatos();
                } catch (error) {
                    console.error("Error eliminando patrocinio:", error);
                    alert("Error al eliminar el patrocinio");
                }
            }
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
            cerrarModal,
        };
    },
};
</script>

<style scoped>
.patrocinios-container {
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
}

.filtros {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.filtro {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
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

.btn-editar,
.btn-eliminar {
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.btn-editar {
    background: #ffc107;
    color: #333;
}

.btn-eliminar {
    background: #dc3545;
    color: white;
}

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

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #555;
    font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
}
</style>
