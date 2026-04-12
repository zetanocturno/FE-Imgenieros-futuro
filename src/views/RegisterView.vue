<template>
    <div class="auth-container">
        <div class="auth-card">
            <h2>Registro de Usuario</h2>
            <form @submit.prevent="handleRegister">
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" v-model="userData.email" required>
                </div>
                <div class="form-group">
                    <label>Contraseña:</label>
                    <input type="password" v-model="userData.password" required>
                </div>
                <div class="form-group">
                    <label>Confirmar Contraseña:</label>
                    <input type="password" v-model="userData.confirmPassword" required>
                </div>
                <button type="submit" class="btn-primary">Registrarse</button>
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

export default {
    name: 'RegisterView',
    setup() {
        const store = useStore()
        const router = useRouter()
        const userData = ref({
            email: '',
            password: '',
            confirmPassword: ''
        })

        const handleRegister = async () => {
            if (userData.value.password !== userData.value.confirmPassword) {
                alert('Las contraseñas no coinciden')
                return
            }

            const result = await store.dispatch('register', {
                email: userData.value.email,
                password: userData.value.password
            })

            if (result.success) {
                router.push('/dashboard')
            } else {
                alert('Error en el registro: ' + (result.error?.message || 'Intenta de nuevo'))
            }
        }

        return {
            userData,
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
}

.auth-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.auth-card h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #555;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
}

.btn-primary {
    width: 100%;
    padding: 0.75rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;
}

.btn-primary:hover {
    background: #5a67d8;
}

.auth-link {
    text-align: center;
    margin-top: 1rem;
}

.auth-link a {
    color: #667eea;
    text-decoration: none;
}
</style>