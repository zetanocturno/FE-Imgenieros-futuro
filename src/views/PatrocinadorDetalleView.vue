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
                    <p>{{ patrocinador.descripcion_patrocinio }}</p>
                </div>
            </div>

            <div v-else class="cargando">
                Cargando datos...
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/config/axios'

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
                alert('Error al cargar los datos del patrocinador')
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
}

.detalle-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 700px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f0f0f0;
}

.header h1 {
    font-size: 1.5rem;
    color: #333;
}

.btn-volver {
    background: #6c757d;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    text-decoration: none;
    transition: background 0.3s;
}

.btn-volver:hover {
    background: #5a6268;
}

.detalle-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.campo {
    display: flex;
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
}

.campo label {
    font-weight: bold;
    width: 150px;
    color: #555;
}

.campo p {
    flex: 1;
    margin: 0;
    color: #333;
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

.cargando {
    text-align: center;
    color: #999;
    padding: 2rem;
}
</style>