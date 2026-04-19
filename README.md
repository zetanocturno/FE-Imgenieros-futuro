# Ingenieros para el Futuro - Frontend

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vuex](https://img.shields.io/badge/Vuex-4.x-4FC08D?logo=vuex)](https://vuex.vuejs.org/)
[![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?logo=axios)](https://axios-http.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Descripción

Plataforma de apoyo para jóvenes que desean iniciarse en el desarrollo de software. **Ingenieros para el Futuro** conecta a estudiantes con patrocinadores y mentores, ofreciendo oportunidades de aprendizaje y desarrollo profesional.

**Creador:** Raúl Manuel Diez Canseco Gallegos

### 🎯 Objetivo

Apoyar a jóvenes a iniciarse en el desarrollo de software para poder trabajar en empresas de alto nivel. Tener contacto con Patrocinadores como Mentores, apoyo en el desarrollo profesional e incluso poder tener su primera oportunidad de trabajo.

### 🤝 Organización

**Ingenieros para el Futuro** es una organización **sin fines de lucro** y de **trabajo voluntario**.

## ✨ Características

- ✅ Autenticación de usuarios (Registro/Login)
- ✅ CRUD completo de Estudiantes
- ✅ CRUD completo de Patrocinadores
- ✅ CRUD completo de Patrocinios
- ✅ Filtros y búsqueda en tiempo real
- ✅ Vistas de detalle con información relacionada
- ✅ Diseño responsive (mobile, tablet, desktop)
- ✅ Protección de rutas privadas
- ✅ Notificaciones con SweetAlert2

## 🛠️ Tecnologías utilizadas

| Tecnología       | Versión | Propósito                        |
| ---------------- | ------- | -------------------------------- |
| Vue.js           | 3.x     | Framework frontend               |
| Vue Router       | 4.x     | Enrutamiento de la aplicación    |
| Vuex             | 4.x     | Manejo de estado global          |
| Axios            | 1.x     | Cliente HTTP                     |
| SweetAlert2      | 11.x    | Notificaciones y modales         |
| JSON Server Auth | -       | Backend simulado (autenticación) |

## 📁 Estructura del proyecto

fe-imgenieros-futuro/
├── src/
│ ├── assets/ # Recursos estáticos
│ ├── components/ # Componentes reutilizables
│ │ └── Modal.vue # Modal genérico
│ ├── config/ # Configuraciones
│ │ └── axios.js # Configuración de Axios
│ ├── router/ # Rutas de la aplicación
│ │ └── index.js
│ ├── store/ # Estado global (Vuex)
│ │ └── index.js
│ ├── views/ # Vistas de la aplicación
│ │ ├── LoginView.vue
│ │ ├── RegisterView.vue
│ │ ├── DashboardView.vue
│ │ ├── EstudiantesView.vue
│ │ ├── EstudianteDetalleView.vue
│ │ ├── PatrocinadoresView.vue
│ │ ├── PatrocinadorDetalleView.vue
│ │ ├── PatrociniosView.vue
│ │ ├── PatrocinioDetalleView.vue
│ │ └── AboutView.vue
│ ├── App.vue # Componente principal
│ └── main.js # Punto de entrada
├── .env # Variables de entorno
├── .gitignore
├── package.json
└── README.md

## 🚀 Instalación y configuración

### Requisitos previos

- Node.js (v16 o superior)
- npm (v8 o superior)

### Pasos de instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/zetanocturno/fe-imgenieros-futuro.git
cd fe-imgenieros-futuro

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL del backend

# 4. Iniciar el servidor de desarrollo
npm run serve

# Iniciar JSON Server (en otra terminal)
cp db.json ../
cd ..
json-server-auth db.json --port 3000

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Siguientes etapas de desarrollo

1.- Poder desplegar los títulos y textos en español e inglés

2.- Añadir links para material didáctico

3.- Añadir páginas de presentaciones
```
