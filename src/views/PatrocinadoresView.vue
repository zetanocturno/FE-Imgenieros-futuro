<template>
    <div class="patrocinadores-container">
        <div class="header">
            <h1>Patrocinadores</h1>
            <button @click="abrirModalCrear" class="btn-agregar">
                + Agregar Patrocinador
            </button>
        </div>

        <!-- Buscador y filtros -->
        <div class="filtros">
            <input type="text" v-model="searchTerm" placeholder="Buscar por empresa o contacto..." class="buscador" />
            <select v-model="filtroEstado" class="filtro">
                <option value="">Todos los estados</option>
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
                <option value="CONCLUIDO">Concluido</option>
            </select>
            <select v-model="filtroPais" class="filtro">
                <option value="">Todos los países</option>
                <option v-for="pais in paises" :key="pais" :value="pais">
                    {{ pais }}
                </option>
            </select>
        </div>

        <!-- Tabla de patrocinadores -->
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Empresa</th>
                        <th>Contacto</th>
                        <th>Email</th>
                        <th>WhatsApp</th>
                        <th>País</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="patrocinador in patrocinadoresFiltrados" :key="patrocinador.id">
                        <td>{{ patrocinador.nombre_empresa }}</td>
                        <td>{{ patrocinador.nombre_contacto }}</td>
                        <td>{{ patrocinador.correo }}</td>
                        <td>{{ patrocinador.whatsapp }}</td>
                        <td>{{ patrocinador.pais }}</td>
                        <td>
                            <span :class="'estado-' + patrocinador.estado.toLowerCase()">
                                {{ patrocinador.estado }}
                            </span>
                        </td>
                        <td class="acciones">
                            <button @click="verDetalle(patrocinador.id)" class="btn-ver">
                                👁️
                            </button>
                            <button @click="editarPatrocinador(patrocinador)" class="btn-editar">
                                ✏️
                            </button>
                            <button @click="
                                eliminarPatrocinador(
                                    patrocinador.id,
                                    patrocinador.nombre_empresa
                                )
                                " class="btn-eliminar">
                                🗑️
                            </button>
                        </td>
                    </tr>
                    <tr v-if="patrocinadoresFiltrados.length === 0">
                        <td colspan="7" class="no-data">
                            No hay patrocinadores registrados
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal para crear/editar -->
        <div v-if="mostrarModal" class="modal" @click.self="cerrarModal">
            <div class="modal-content">
                <h2>
                    {{ modoEdicion ? "Editar Patrocinador" : "Nuevo Patrocinador" }}
                </h2>
                <form @submit.prevent="guardarPatrocinador">
                    <div class="form-group">
                        <label>Nombre Empresa:</label>
                        <input type="text" v-model="patrocinadorForm.nombre_empresa" required />
                    </div>
                    <div class="form-group">
                        <label>Nombre Contacto:</label>
                        <input type="text" v-model="patrocinadorForm.nombre_contacto" required />
                    </div>
                    <div class="form-group">
                        <label>Email:</label>
                        <input type="email" v-model="patrocinadorForm.correo" required />
                    </div>
                    <div class="form-group">
                        <label>WhatsApp:</label>
                        <input type="text" v-model="patrocinadorForm.whatsapp" placeholder="+1234567890" required />
                    </div>
                    <div class="form-group">
                        <label>País:</label>
                        <input type="text" v-model="patrocinadorForm.pais" required />
                    </div>
                    <div class="form-group">
                        <label>Descripción Patrocinio:</label>
                        <textarea v-model="patrocinadorForm.descripcion_patrocinio" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Estado:</label>
                        <select v-model="patrocinadorForm.estado" required>
                            <option value="ACTIVO">Activo</option>
                            <option value="INACTIVO">Inactivo</option>
                            <option value="CONCLUIDO">Concluido</option>
                        </select>
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

export default {
    name: "PatrocinadoresView",
    setup() {
        const router = useRouter();
        const patrocinadores = ref([]);
        const searchTerm = ref("");
        const filtroEstado = ref("");
        const filtroPais = ref("");
        const mostrarModal = ref(false);
        const modoEdicion = ref(false);
        const patrocinadorForm = ref({
            id: null,
            nombre_empresa: "",
            nombre_contacto: "",
            correo: "",
            whatsapp: "",
            pais: "",
            descripcion_patrocinio: "",
            estado: "ACTIVO",
        });

        const paises = computed(() => {
            return [...new Set(patrocinadores.value.map((p) => p.pais))];
        });

        const patrocinadoresFiltrados = computed(() => {
            let filtered = patrocinadores.value;

            if (searchTerm.value) {
                const term = searchTerm.value.toLowerCase();
                filtered = filtered.filter(
                    (p) =>
                        p.nombre_empresa.toLowerCase().includes(term) ||
                        p.nombre_contacto.toLowerCase().includes(term) ||
                        p.correo.toLowerCase().includes(term)
                );
            }

            if (filtroEstado.value) {
                filtered = filtered.filter((p) => p.estado === filtroEstado.value);
            }

            if (filtroPais.value) {
                filtered = filtered.filter((p) => p.pais === filtroPais.value);
            }

            return filtered;
        });

        const cargarPatrocinadores = async () => {
            try {
                const response = await axios.get("/patrocinadores");
                patrocinadores.value = response.data;
            } catch (error) {
                console.error("Error cargando patrocinadores:", error);
            }
        };

        const abrirModalCrear = () => {
            modoEdicion.value = false;
            patrocinadorForm.value = {
                id: null,
                nombre_empresa: "",
                nombre_contacto: "",
                correo: "",
                whatsapp: "",
                pais: "",
                descripcion_patrocinio: "",
                estado: "ACTIVO",
            };
            mostrarModal.value = true;
        };

        const editarPatrocinador = (patrocinador) => {
            modoEdicion.value = true;
            patrocinadorForm.value = { ...patrocinador };
            mostrarModal.value = true;
        };

        const guardarPatrocinador = async () => {
            try {
                if (modoEdicion.value) {
                    await axios.put(
                        `/patrocinadores/${patrocinadorForm.value.id}`,
                        patrocinadorForm.value
                    );
                    alert("Patrocinador actualizado correctamente");
                } else {
                    await axios.post("/patrocinadores", patrocinadorForm.value);
                    alert("Patrocinador creado correctamente");
                }
                cerrarModal();
                cargarPatrocinadores();
            } catch (error) {
                console.error("Error guardando patrocinador:", error);
                alert("Error al guardar el patrocinador");
            }
        };

        const eliminarPatrocinador = async (id, nombre) => {
            if (confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
                try {
                    await axios.delete(`/patrocinadores/${id}`);
                    alert("Patrocinador eliminado correctamente");
                    cargarPatrocinadores();
                } catch (error) {
                    console.error("Error eliminando patrocinador:", error);
                    alert("Error al eliminar el patrocinador");
                }
            }
        };

        const verDetalle = (id) => {
            router.push(`/patrocinadores/${id}`);
        };

        const cerrarModal = () => {
            mostrarModal.value = false;
        };

        onMounted(() => {
            cargarPatrocinadores();
        });

        return {
            patrocinadores,
            searchTerm,
            filtroEstado,
            filtroPais,
            paises,
            patrocinadoresFiltrados,
            mostrarModal,
            modoEdicion,
            patrocinadorForm,
            abrirModalCrear,
            editarPatrocinador,
            guardarPatrocinador,
            eliminarPatrocinador,
            verDetalle,
            cerrarModal,
        };
    },
};
</script>

<style scoped>
.patrocinadores-container {
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
    flex-wrap: wrap;
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
    min-width: 200px;
}

.filtro {
    flex: 1;
    min-width: 150px;
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

.form-group textarea {
    resize: vertical;
    font-family: inherit;
}
</style>
