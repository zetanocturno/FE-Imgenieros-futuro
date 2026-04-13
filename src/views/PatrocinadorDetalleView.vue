<template>
    <div class="detalle-container">
        <div class="detalle-card">
            <div class="header">
                <h1>Detalle del Patrocinador</h1>
                <router-link to="/patrocinadores" class="btn-volver">← Volver</router-link>
            </div>

            <div v-if="patrocinador" class="detalle-info">
                <div class="campo">
                    <label>Empresa:</label>
                    <p>{{ patrocinador.nombre_empresa }}</p>
                </div>
                <div class="campo">
                    <label>Contacto:</label>
                    <p>{{ patrocinador.nombre_contacto }}</p>
                </div>
                <div class="campo">
                    <label>Email:</label>
                    <p>{{ patrocinador.correo }}</p>
                </div>
                <div class="campo">
                    <label>WhatsApp:</label>
                    <p>{{ patrocinador.whatsapp }}</p>
                </div>
                <div class="campo">
                    <label>País:</label>
                    <p>{{ patrocinador.pais }}</p>
                </div>
                <div class="campo">
                    <label>Estado:</label>
                    <p :class="'estado-' + patrocinador.estado.toLowerCase()">
                        {{ patrocinador.estado }}
                    </p>
                </div>
                <div class="campo">
                    <label>Descripción:</label>
                    <p class="descripcion-texto">{{ patrocinador.descripcion_patrocinio }}</p>
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/config/axios'
import Swal from 'sweetalert2'

export default {
    name: 'PatrocinadorDetalleView',
    setup() {
        const route = useRoute()
        const patrocinador = ref(null)

        const cargarPatrocinador = async () => {
            try {
                const id = route.params.id
                const response = await axios.get(`/patrocinadores/${id}`)
                patrocinador.value = response.data
            } catch (error) {
                console.error('Error cargando patrocinador:', error)
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar los datos del patrocinador',
                    confirmButtonColor: '#d33'
                })
            }
        }

        onMounted(() => {
            cargarPatrocinador()
        })

        return {
            patrocinador
        }
    }
}
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
    font-size: 1.5rem;
    margin: 0;
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

/* Estados */
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

/* ============================================ */
/* RESPONSIVE: MÓVIL (menos de 768px) */
/* ============================================ */
@media (max-width: 768px) {
    .detalle-container {
        padding: 0.75rem;
        min-height: calc(100vh - 150px);
    }

    .detalle-card {
        border-radius: 12px;
    }

    .header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
        padding: 1rem 1.25rem;
    }

    .header h1 {
        font-size: 1.125rem;
    }

    .btn-volver {
        width: 100%;
        text-align: center;
        padding: 0.625rem;
    }

    .detalle-info {
        padding: 1rem;
    }

    .campo {
        flex-direction: column;
        padding: 0.625rem 0;
    }

    .campo label {
        width: 100%;
        margin-bottom: 0.25rem;
        font-size: 0.8rem;
    }

    .campo p {
        font-size: 0.875rem;
        word-break: break-word;
    }
}

/* ============================================ */
/* RESPONSIVE: TABLET (768px a 1024px) */
/* ============================================ */
@media (min-width: 769px) and (max-width: 1024px) {
    .detalle-card {
        max-width: 90%;
    }

    .header h1 {
        font-size: 1.25rem;
    }

    .detalle-info {
        padding: 1.5rem;
    }
}

/* ============================================ */
/* PANTALLAS MUY PEQUEÑAS (menos de 480px) */
/* ============================================ */
@media (max-width: 480px) {
    .detalle-container {
        padding: 0.5rem;
    }

    .detalle-info {
        padding: 0.75rem;
    }

    .campo {
        padding: 0.5rem 0;
    }

    .campo label {
        font-size: 0.75rem;
    }

    .campo p {
        font-size: 0.8rem;
    }
}
</style>