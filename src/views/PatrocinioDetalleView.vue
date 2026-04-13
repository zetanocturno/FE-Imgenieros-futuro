<template>
    <div class="detalle-container">
        <div class="detalle-card">
            <div class="header">
                <h1>Detalle del Patrocinio</h1>
                <router-link to="/patrocinios" class="btn-volver">
                    ← Volver
                </router-link>
            </div>

            <div v-if="patrocinio" class="detalle-info">
                <div class="campo">
                    <label>Fecha:</label>
                    <p>{{ formatDate(patrocinio.fecha) }}</p>
                </div>
                <div class="campo">
                    <label>Patrocinador:</label>
                    <p>{{ getPatrocinadorNombre(patrocinio.patrocinadorId) }}</p>
                </div>
                <div class="campo">
                    <label>Estudiante:</label>
                    <p>{{ getEstudianteNombre(patrocinio.estudianteId) }}</p>
                </div>
                <div class="campo">
                    <label>Estado:</label>
                    <p :class="'estado-' + patrocinio.estado.toLowerCase()">
                        {{ getEstadoTexto(patrocinio.estado) }}
                    </p>
                </div>
                <div class="campo">
                    <label>Descripción:</label>
                    <p class="descripcion-texto">{{ patrocinio.descripcion }}</p>
                </div>

                <!-- Información adicional del patrocinador -->
                <div v-if="patrocinadorInfo" class="seccion-adicional">
                    <h3>Información del Patrocinador</h3>
                    <div class="subcampos">
                        <div class="subcampo">
                            <label>Empresa:</label>
                            <span>{{ patrocinadorInfo.nombre_empresa }}</span>
                        </div>
                        <div class="subcampo">
                            <label>Contacto:</label>
                            <span>{{ patrocinadorInfo.nombre_contacto }}</span>
                        </div>
                        <div class="subcampo">
                            <label>Email:</label>
                            <span>{{ patrocinadorInfo.correo }}</span>
                        </div>
                        <div class="subcampo">
                            <label>WhatsApp:</label>
                            <span>{{ patrocinadorInfo.whatsapp }}</span>
                        </div>
                    </div>
                </div>

                <!-- Información adicional del estudiante -->
                <div v-if="estudianteInfo" class="seccion-adicional">
                    <h3>Información del Estudiante</h3>
                    <div class="subcampos">
                        <div class="subcampo">
                            <label>Nombre:</label>
                            <span>{{ estudianteInfo.nombre }}</span>
                        </div>
                        <div class="subcampo">
                            <label>Email:</label>
                            <span>{{ estudianteInfo.correo }}</span>
                        </div>
                        <div class="subcampo">
                            <label>WhatsApp:</label>
                            <span>{{ estudianteInfo.whatsapp }}</span>
                        </div>
                        <div class="subcampo">
                            <label>País:</label>
                            <span>{{ estudianteInfo.pais }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="cargando">
                <div class="spinner"></div>
                <p>Cargando datos...</p>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/config/axios";
import Swal from "sweetalert2";

export default {
    name: "PatrocinioDetalleView",
    setup() {
        const route = useRoute();
        const router = useRouter();
        const patrocinio = ref(null);
        const patrocinadorInfo = ref(null);
        const estudianteInfo = ref(null);

        const formatDate = (dateString) => {
            if (!dateString) return "";
            const date = new Date(dateString);
            return date.toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        };

        const getEstadoTexto = (estado) => {
            const estados = {
                ACTIVO: "Activo",
                INACTIVO: "Inactivo",
                CONCLUIDO: "Concluido",
            };
            return estados[estado] || estado;
        };

        const getPatrocinadorNombre = (id) => {
            return patrocinadorInfo.value ? patrocinadorInfo.value.nombre_empresa : "Cargando...";
        };

        const getEstudianteNombre = (id) => {
            return estudianteInfo.value ? estudianteInfo.value.nombre : "Cargando...";
        };

        const cargarPatrocinio = async () => {
            try {
                const id = route.params.id;

                // Cargar el patrocinio
                const patrocinioRes = await axios.get(`/patrocinios/${id}`);
                patrocinio.value = patrocinioRes.data;

                // Cargar información del patrocinador relacionado
                const patrocinadorRes = await axios.get(`/patrocinadores/${patrocinio.value.patrocinadorId}`);
                patrocinadorInfo.value = patrocinadorRes.data;

                // Cargar información del estudiante relacionado
                const estudianteRes = await axios.get(`/estudiantes/${patrocinio.value.estudianteId}`);
                estudianteInfo.value = estudianteRes.data;

            } catch (error) {
                console.error("Error cargando patrocinio:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo cargar el detalle del patrocinio",
                    confirmButtonColor: "#d33",
                }).then(() => {
                    router.push("/patrocinios");
                });
            }
        };

        onMounted(() => {
            cargarPatrocinio();
        });

        return {
            patrocinio,
            patrocinadorInfo,
            estudianteInfo,
            formatDate,
            getEstadoTexto,
            getPatrocinadorNombre,
            getEstudianteNombre,
        };
    },
};
</script>

<style scoped>
.detalle-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 200px);
    padding: 1rem;
}

.detalle-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    width: 100%;
    max-width: 800px;
    overflow: hidden;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.header h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
}

.btn-volver {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    text-decoration: none;
    font-size: 0.875rem;
    transition: all 0.3s;
}

.btn-volver:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-2px);
}

.detalle-info {
    padding: 2rem;
}

.campo {
    display: flex;
    padding: 0.75rem 0;
    border-bottom: 1px solid #e9ecef;
}

.campo label {
    font-weight: 600;
    width: 140px;
    color: #475569;
    font-size: 0.875rem;
}

.campo p {
    flex: 1;
    margin: 0;
    color: #1e293b;
    font-size: 0.875rem;
}

.descripcion-texto {
    line-height: 1.5;
    white-space: pre-wrap;
}

.estado-activo {
    color: #10b981;
    font-weight: 600;
}

.estado-inactivo {
    color: #ef4444;
    font-weight: 600;
}

.estado-concluido {
    color: #6b7280;
    font-weight: 600;
}

/* Sección adicional (patrocinador y estudiante) */
.seccion-adicional {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 2px solid #e9ecef;
}

.seccion-adicional h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #475569;
}

.subcampos {
    background: #f8fafc;
    border-radius: 12px;
    padding: 1rem;
}

.subcampo {
    display: flex;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e2e8f0;
}

.subcampo:last-child {
    border-bottom: none;
}

.subcampo label {
    font-weight: 500;
    width: 100px;
    color: #64748b;
    font-size: 0.8rem;
}

.subcampo span {
    flex: 1;
    color: #1e293b;
    font-size: 0.875rem;
}

/* Estado de carga */
.cargando {
    text-align: center;
    padding: 3rem;
    color: #94a3b8;
}

.spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto 1rem;
    border: 3px solid #e2e8f0;
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Responsive */
@media (max-width: 640px) {
    .header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }

    .campo {
        flex-direction: column;
    }

    .campo label {
        width: 100%;
        margin-bottom: 0.25rem;
    }

    .subcampo {
        flex-direction: column;
    }

    .subcampo label {
        width: 100%;
        margin-bottom: 0.25rem;
    }
}
</style>