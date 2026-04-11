<template>
    <div class="auth-container">
        <div class="auth-card">
            <h2>Iniciar Sesión</h2>
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" v-model="credentials.email" required />
                </div>
                <div class="form-group">
                    <label>Contraseña:</label>
                    <input type="password" v-model="credentials.password" required />
                </div>
                <button type="submit" class="btn-primary">Ingresar</button>
                <p class="auth-link">
                    ¿No tienes cuenta?
                    <router-link to="/register">Regístrate</router-link>
                </p>
            </form>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

export default {
    name: "LoginView",
    setup() {
        const store = useStore();
        const router = useRouter();
        const credentials = ref({
            email: "",
            password: "",
        });

        const handleLogin = async () => {
            const result = await store.dispatch("login", credentials.value);
            if (result.success) {
                Swal.fire("Éxito", "Inicio de sesión exitoso", "success");
                router.push("/dashboard");
            } else {
                Swal.fire("Error", "Credenciales incorrectas", "error");
            }
        };

        return {
            credentials,
            handleLogin,
        };
    },
};
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
