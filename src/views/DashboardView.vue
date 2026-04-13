<template>
    <div class="dashboard">
        <h1>Inicio</h1>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">👨‍🎓</div>
                <h3>Estudiantes</h3>
                <p class="stat-number">{{ estudiantes.length }}</p>
                <router-link to="/estudiantes" class="stat-link">Ver todos →</router-link>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🏢</div>
                <h3>Patrocinadores</h3>
                <p class="stat-number">{{ patrocinadores.length }}</p>
                <router-link to="/patrocinadores" class="stat-link">Ver todos →</router-link>
            </div>
            <div class="stat-card">
                <div class="stat-icon">✅</div>
                <h3>Patrocinios Activos</h3>
                <p class="stat-number">{{ patrociniosActivos }}</p>
                <router-link to="/patrocinios" class="stat-link">Ver todos →</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import axios from "@/config/axios";
import Swal from "sweetalert2";

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
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudieron cargar los datos del dashboard",
                    confirmButtonColor: "#d33",
                });
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
.dashboard {
    padding: 0.5rem;
}

.dashboard h1 {
    margin-bottom: 2rem;
    color: white;
    font-size: 2rem;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
}

.stat-card {
    background: white;
    padding: 1.75rem;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    text-align: center;
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

.stat-icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
}

.stat-card h3 {
    color: #64748b;
    margin-bottom: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #667eea;
    margin: 0.5rem 0;
    line-height: 1.2;
}

.stat-link {
    display: inline-block;
    color: #667eea;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.3s;
}

.stat-link:hover {
    background: #f1f5f9;
    color: #5a67d8;
}

/* ============================================ */
/* RESPONSIVE: TABLET (768px a 1024px) */
/* ============================================ */
@media (min-width: 769px) and (max-width: 1024px) {
    .dashboard {
        padding: 0.5rem;
    }

    .dashboard h1 {
        font-size: 1.75rem;
        margin-bottom: 1.5rem;
    }

    .stats-grid {
        gap: 1.25rem;
    }

    .stat-card {
        padding: 1.5rem;
    }

    .stat-number {
        font-size: 2rem;
    }

    .stat-icon {
        font-size: 2rem;
    }
}

/* ============================================ */
/* RESPONSIVE: MÓVIL (menos de 768px) */
/* ============================================ */
@media (max-width: 768px) {
    .dashboard {
        padding: 0.25rem;
    }

    .dashboard h1 {
        font-size: 1.5rem;
        margin-bottom: 1.25rem;
        text-align: center;
    }

    .stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .stat-card {
        padding: 1.25rem;
        display: flex;
        align-items: center;
        text-align: left;
        gap: 1rem;
    }

    .stat-icon {
        font-size: 2rem;
        margin-bottom: 0;
        flex-shrink: 0;
    }

    .stat-content {
        flex: 1;
    }

    .stat-card h3 {
        margin-bottom: 0.25rem;
        font-size: 0.875rem;
    }

    .stat-number {
        font-size: 1.75rem;
        margin: 0.25rem 0;
    }

    .stat-link {
        padding: 0.25rem 0;
        font-size: 0.75rem;
    }
}

/* ============================================ */
/* PANTALLAS MUY PEQUEÑAS (menos de 480px) */
/* ============================================ */
@media (max-width: 480px) {
    .dashboard h1 {
        font-size: 1.25rem;
        margin-bottom: 1rem;
    }

    .stat-card {
        padding: 1rem;
        gap: 0.75rem;
    }

    .stat-icon {
        font-size: 1.5rem;
    }

    .stat-card h3 {
        font-size: 0.75rem;
    }

    .stat-number {
        font-size: 1.5rem;
    }

    .stat-link {
        font-size: 0.7rem;
    }
}

/* ============================================ */
/* PANTALLAS GRANDES (más de 1400px) */
/* ============================================ */
@media (min-width: 1400px) {
    .dashboard {
        max-width: 1400px;
        margin: 0 auto;
    }

    .stats-grid {
        gap: 2rem;
    }

    .stat-card {
        padding: 2rem;
    }

    .stat-number {
        font-size: 3rem;
    }

    .stat-card h3 {
        font-size: 1.125rem;
    }
}
</style>