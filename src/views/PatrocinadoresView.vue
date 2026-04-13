<template>
    <div class="patrocinadores-container">
        <div class="header">
            <h1>Patrocinadores</h1>
            <button @click="abrirModalCrear" class="btn-agregar">
                + Agregar
            </button>
        </div>

        <!-- Buscador y filtros -->
        <div class="filtros">
            <input type="text" v-model="searchTerm" placeholder="Buscar..." class="buscador" />
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

        <!-- Vista Desktop: Tabla -->
        <div class="table-container desktop-view">
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
                        <td data-label="Empresa">{{ patrocinador.nombre_empresa }}</td>
                        <td data-label="Contacto">{{ patrocinador.nombre_contacto }}</td>
                        <td data-label="Email">{{ patrocinador.correo }}</td>
                        <td data-label="WhatsApp">{{ patrocinador.whatsapp }}</td>
                        <td data-label="País">{{ patrocinador.pais }}</td>
                        <td data-label="Estado">
                            <span :class="'estado-' + patrocinador.estado.toLowerCase()">
                                {{ patrocinador.estado }}
                            </span>
                        </td>
                        <td class="acciones">
                            <button @click="verDetalle(patrocinador.id)" class="btn-ver">👁️</button>
                            <button @click="editarPatrocinador(patrocinador)" class="btn-editar">✏️</button>
                            <button @click="eliminarPatrocinador(patrocinador.id, patrocinador.nombre_empresa)"
                                class="btn-eliminar">🗑️</button>
                        </td>
                    </tr>
                    <tr v-if="patrocinadoresFiltrados.length === 0">
                        <td colspan="7" class="no-data">No hay patrocinadores registrados</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Vista Móvil: Tarjetas -->
        <div class="mobile-view">
            <div v-for="patrocinador in patrocinadoresFiltrados" :key="patrocinador.id" class="card">
                <div class="card-header">
                    <strong>{{ patrocinador.nombre_empresa }}</strong>
                    <div class="card-actions">
                        <button @click="verDetalle(patrocinador.id)" class="btn-ver">👁️</button>
                        <button @click="editarPatrocinador(patrocinador)" class="btn-editar">✏️</button>
                        <button @click="eliminarPatrocinador(patrocinador.id, patrocinador.nombre_empresa)"
                            class="btn-eliminar">🗑️</button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="card-field">
                        <span>Contacto:</span> {{ patrocinador.nombre_contacto }}
                    </div>
                    <div class="card-field">
                        <span>Email:</span> {{ patrocinador.correo }}
                    </div>
                    <div class="card-field">
                        <span>WhatsApp:</span> {{ patrocinador.whatsapp }}
                    </div>
                    <div class="card-field">
                        <span>País:</span> {{ patrocinador.pais }}
                    </div>
                    <div class="card-field">
                        <span>Estado:</span>
                        <span :class="'estado-' + patrocinador.estado.toLowerCase()">
                            {{ patrocinador.estado }}
                        </span>
                    </div>
                </div>
            </div>
            <div v-if="patrocinadoresFiltrados.length === 0" class="no-data-mobile">
                No hay patrocinadores registrados
            </div>
        </div>

        <!-- Modal reutilizable -->
        <Modal :visible="mostrarModal" :title="modoEdicion ? 'Editar Patrocinador' : 'Nuevo Patrocinador'"
            @close="cerrarModal" @save="guardarPatrocinador">
            <template #form-fields>
                <div class="form-group">
                    <label>Nombre Empresa:</label>
                    <input type="text" v-model="patrocinadorForm.nombre_empresa" required />
                </div>
                <div class="form-group">
                    <label>Nombre Contacto:</label>
                    <input type="text" v-model="patrocinadorForm.nombre_contacto" required />
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Email:</label>
                        <input type="email" v-model="patrocinadorForm.correo" required />
                    </div>
                    <div class="form-group">
                        <label>WhatsApp:</label>
                        <input type="text" v-model="patrocinadorForm.whatsapp" placeholder="+1234567890" required />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>País:</label>
                        <input type="text" v-model="patrocinadorForm.pais" required />
                    </div>
                    <div class="form-group">
                        <label>Estado:</label>
                        <select v-model="patrocinadorForm.estado" required>
                            <option value="ACTIVO">Activo</option>
                            <option value="INACTIVO">Inactivo</option>
                            <option value="CONCLUIDO">Concluido</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Descripción Patrocinio:</label>
                    <textarea v-model="patrocinadorForm.descripcion_patrocinio" rows="3" required></textarea>
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
    name: "PatrocinadoresView",
    components: { Modal },
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
                Swal.fire("Error", "No se pudieron cargar los patrocinadores", "error");
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
                    Swal.fire("Éxito", "Patrocinador actualizado correctamente", "success");
                } else {
                    await axios.post("/patrocinadores", patrocinadorForm.value);
                    Swal.fire("Éxito", "Patrocinador creado correctamente", "success");
                }
                cerrarModal();
                cargarPatrocinadores();
            } catch (error) {
                console.error("Error guardando patrocinador:", error);
                Swal.fire("Error", "Error al guardar el patrocinador", "error");
            }
        };

        const eliminarPatrocinador = async (id, nombre) => {
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                html: `Vas a eliminar a <strong>${nombre}</strong>`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });

            if (result.isConfirmed) {
                try {
                    await axios.delete(`/patrocinadores/${id}`);
                    Swal.fire("Eliminado", "Patrocinador eliminado correctamente", "success");
                    cargarPatrocinadores();
                } catch (error) {
                    console.error("Error eliminando patrocinador:", error);
                    Swal.fire("Error", "Error al eliminar el patrocinador", "error");
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

.buscador,
.filtro {
    padding: 0.625rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 0.875rem;
}

.buscador {
    flex: 2;
    min-width: 200px;
}

.filtro {
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
    .patrocinadores-container {
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
    .patrocinadores-container {
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