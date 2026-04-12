<template>
    <div class="detalle-container">
        <div class="detalle-card">
            <div class="header">
                <h1>Detalle del Estudiante</h1>
                <router-link to="/estudiantes" class="btn-volver">← Volver</router-link>
            </div>

            <div v-if="estudiante" class="detalle-info">
                <div class="campo">
                    <label>Nombre:</label>
                    <p>{{ estudiante.nombre }}</p>
                </div>
                <div class="campo">
                    <label>Email:</label>
                    <p>{{ estudiante.correo }}</p>
                </div>
                <div class="campo">
                    <label>WhatsApp:</label>
                    <p>{{ estudiante.whatsapp }}</p>
                </div>
                <div class="campo">
                    <label>País:</label>
                    <p>{{ estudiante.pais }}</p>
                </div>
                <div class="campo">
                    <label>Fecha de Nacimiento:</label>
                    <p>{{ estudiante.fecha_nacimiento }}</p>
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
    name: 'EstudianteDetalleView',
    setup() {
        const route = useRoute()
        const estudiante = ref(null)

        const cargarEstudiante = async () => {
            try {
                const id = route.params.id
                const response = await axios.get(`/estudiantes/${id}`)
                estudiante.value = response.data
            } catch (error) {
                console.error('Error cargando estudiante:', error)
                alert('Error al cargar los datos del estudiante')
            }
        }

        onMounted(() => {
            cargarEstudiante()
        })

        return {
            estudiante
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
    max-width: 600px;
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

.cargando {
    text-align: center;
    color: #999;
    padding: 2rem;
}
</style>