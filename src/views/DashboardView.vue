<template>
    <div class="dashboard">
        <h1>Inicio</h1>
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Estudiantes</h3>
                <p class="stat-number">{{ estudiantes.length }}</p>
                <router-link to="/estudiantes">Ver todos →</router-link>
            </div>
            <div class="stat-card">
                <h3>Patrocinadores</h3>
                <p class="stat-number">{{ patrocinadores.length }}</p>
                <router-link to="/patrocinadores">Ver todos →</router-link>
            </div>
            <div class="stat-card">
                <h3>Patrocinios Activos</h3>
                <p class="stat-number">{{ patrociniosActivos }}</p>
                <router-link to="/patrocinios">Ver todos →</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import axios from "@/config/axios";

export default {
    name: "DashboardView",
    setup() {
        const estudiantes = ref([]);
        const patrocinadores = ref([]);
        const patrocinios = ref([]);

        const patrociniosActivos = computed(() => {
            return patrocinios.value.filter((p) => p.estado === "ACTIVO").length;
        });

        const cargarDatos = async () => {
            try {
                const [estudiantesRes, patrocinadoresRes, patrociniosRes] =
                    await Promise.all([
                        axios.get("/estudiantes"),
                        axios.get("/patrocinadores"),
                        axios.get("/patrocinios"),
                    ]);
                estudiantes.value = estudiantesRes.data;
                patrocinadores.value = patrocinadoresRes.data;
                patrocinios.value = patrociniosRes.data;
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };

        onMounted(() => {
            cargarDatos();
        });

        return {
            estudiantes,
            patrocinadores,
            patrocinios,
            patrociniosActivos,
        };
    },
};
</script>

<style scoped>
.dashboard h1 {
    margin-bottom: 2rem;
    color: white;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
    color: #666;
    margin-bottom: 0.5rem;
}

.stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #667eea;
    margin: 0.5rem 0;
}

.stat-card a {
    color: #667eea;
    text-decoration: none;
    font-size: 0.9rem;
}
</style>
