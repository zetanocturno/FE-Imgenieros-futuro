<template>
    <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <h2>Registro de Usuario</h2>
                <p class="auth-subtitle">Crea tu cuenta para comenzar</p>
            </div>
            <form @submit.prevent="handleRegister">
                <div class="form-group">
                    <label>📧 Email:</label>
                    <input type="email" v-model="userData.email" placeholder="tu@email.com" required>
                </div>
                <div class="form-group">
                    <label>🔒 Contraseña:</label>
                    <input type="password" v-model="userData.password" placeholder="Mínimo 6 caracteres" required>
                </div>
                <div class="form-group">
                    <label>✓ Confirmar Contraseña:</label>
                    <input type="password" v-model="userData.confirmPassword" placeholder="Repite tu contraseña"
                        required>
                </div>
                <div v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                </div>
                <button type="submit" class="btn-primary" :disabled="loading">
                    {{ loading ? 'Registrando...' : 'Registrarse' }}
                </button>
                <p class="auth-link">
                    ¿Ya tienes cuenta? <router-link to="/login">Iniciar Sesión</router-link>
                </p>
            </form>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

export default {
    name: 'RegisterView',
    setup() {
        const store = useStore()
        const router = useRouter()
        const loading = ref(false)
        const errorMessage = ref('')
        const userData = ref({
            email: '',
            password: '',
            confirmPassword: ''
        })

        const handleRegister = async () => {
            // Limpiar error previo
            errorMessage.value = ''

            // Validaciones
            if (!userData.value.email) {
                errorMessage.value = 'El email es obligatorio'
                return
            }

            if (userData.value.password.length < 6) {
                errorMessage.value = 'La contraseña debe tener al menos 6 caracteres'
                return
            }

            if (userData.value.password !== userData.value.confirmPassword) {
                errorMessage.value = 'Las contraseñas no coinciden'
                return
            }

            loading.value = true

            const result = await store.dispatch('register', {
                email: userData.value.email,
                password: userData.value.password
            })

            loading.value = false

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: 'Bienvenido a Ingenieros para el Futuro',
                    timer: 2000,
                    showConfirmButton: false
                })
                router.push('/dashboard')
            } else {
                if (result.error === 'Email already exists') {
                    errorMessage.value = 'Este email ya está registrado'
                } else {
                    errorMessage.value = result.error?.message || 'Error en el registro. Intenta de nuevo'
                }
            }
        }

        return {
            userData,
            loading,
            errorMessage,
            handleRegister
        }
    }
}
</script>

<style scoped>
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 200px);
    padding: 1rem;
}

.auth-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    width: 100%;
    max-width: 450px;
    overflow: hidden;
}

.auth-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem 1.5rem;
    text-align: center;
    color: white;
}

.auth-header h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    font-weight: 600;
}

.auth-subtitle {
    margin: 0;
    font-size: 0.875rem;
    opacity: 0.9;
}

form {
    padding: 2rem;
}

.form-group {
    margin-bottom: 1.25rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #475569;
    font-size: 0.875rem;
    font-weight: 500;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 0.875rem;
    transition: all 0.2s;
}

.form-group input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input::placeholder {
    color: #94a3b8;
}

.error-message {
    background: #fee2e2;
    color: #dc2626;
    padding: 0.75rem;
    border-radius: 8px;
    font-size: 0.75rem;
    margin-bottom: 1rem;
    text-align: center;
}

.btn-primary {
    width: 100%;
    padding: 0.75rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-primary:hover:not(:disabled) {
    background: #5a67d8;
    transform: translateY(-1px);
}

.btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.auth-link {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.875rem;
    color: #64748b;
}

.auth-link a {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
}

.auth-link a:hover {
    text-decoration: underline;
}

/* ============================================ */
/* RESPONSIVE: MÓVIL (menos de 768px) */
/* ============================================ */
@media (max-width: 768px) {
    .auth-container {
        padding: 0.75rem;
        min-height: calc(100vh - 150px);
    }

    .auth-card {
        max-width: 100%;
        border-radius: 12px;
    }

    .auth-header {
        padding: 1.5rem 1rem;
    }

    .auth-header h2 {
        font-size: 1.25rem;
    }

    .auth-subtitle {
        font-size: 0.75rem;
    }

    form {
        padding: 1.5rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-group label {
        font-size: 0.8rem;
    }

    .form-group input {
        padding: 0.625rem;
        font-size: 0.8rem;
    }

    .btn-primary {
        padding: 0.625rem;
        font-size: 0.8rem;
    }

    .auth-link {
        font-size: 0.75rem;
    }
}

/* ============================================ */
/* RESPONSIVE: PANTALLAS MUY PEQUEÑAS (menos de 480px) */
/* ============================================ */
@media (max-width: 480px) {
    .auth-container {
        padding: 0.5rem;
    }

    .auth-header {
        padding: 1.25rem 0.75rem;
    }

    .auth-header h2 {
        font-size: 1.125rem;
    }

    form {
        padding: 1rem;
    }

    .form-group input {
        padding: 0.5rem;
        font-size: 0.75rem;
    }

    /* Evita zoom en iOS */
    input {
        font-size: 16px !important;
    }
}

/* ============================================ */
/* RESPONSIVE: TABLET (768px a 1024px) */
/* ============================================ */
@media (min-width: 769px) and (max-width: 1024px) {
    .auth-card {
        max-width: 420px;
    }
}
</style>