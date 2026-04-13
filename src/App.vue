<template>
  <div id="app">
    <nav class="navbar" v-if="isAuthenticated">
      <div class="nav-container">
        <div class="nav-header">
          <router-link to="/" class="nav-brand">Ingenieros para el Futuro</router-link>
          <button class="menu-toggle" @click="toggleMenu" :class="{ active: menuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <div class="nav-menu" :class="{ 'menu-open': menuOpen }">
          <router-link to="/dashboard" @click="closeMenu">Inicio</router-link>
          <router-link to="/estudiantes" @click="closeMenu">Estudiantes</router-link>
          <router-link to="/patrocinadores" @click="closeMenu">Patrocinadores</router-link>
          <router-link to="/patrocinios" @click="closeMenu">Patrocinios</router-link>
          <router-link to="/about" @click="closeMenu">Acerca de</router-link>
          <button @click="handleLogout" class="btn-logout">Cerrar Sesión</button>
        </div>
      </div>
    </nav>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const store = useStore()
    const router = useRouter()
    const menuOpen = ref(false)

    const isAuthenticated = computed(() => store.getters.isAuthenticated)

    const handleLogout = () => {
      store.dispatch('logout')
      router.push('/login')
      closeMenu()
    }

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value
    }

    const closeMenu = () => {
      menuOpen.value = false
    }

    return {
      isAuthenticated,
      menuOpen,
      handleLogout,
      toggleMenu,
      closeMenu
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1rem;
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.25rem;
  font-weight: bold;
  color: #667eea;
  text-decoration: none;
}

/* Menú hamburguesa */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.menu-toggle span {
  width: 100%;
  height: 3px;
  background: #667eea;
  border-radius: 3px;
  transition: all 0.3s;
}

.menu-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

.nav-menu {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-menu a {
  text-decoration: none;
  color: #333;
  transition: color 0.3s;
}

.nav-menu a:hover {
  color: #667eea;
}

.btn-logout {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: #c82333;
}

main {
  max-width: 1200px;
  margin: 1rem auto;
  padding: 0 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .nav-menu {
    display: none;
    flex-direction: column;
    width: 100%;
    padding: 1rem 0;
    gap: 0.75rem;
  }

  .nav-menu.menu-open {
    display: flex;
  }

  .nav-menu a,
  .nav-menu button {
    width: 100%;
    text-align: center;
    padding: 0.75rem;
  }

  main {
    margin: 0.5rem auto;
    padding: 0 0.75rem;
  }
}
</style>