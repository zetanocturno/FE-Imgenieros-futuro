<template>
    <div v-if="visible" class="modal" @click.self="handleClose">
        <div class="modal-content">
            <div class="modal-header">
                <h2>{{ title }}</h2>
                <button class="close-btn" @click="handleClose">&times;</button>
            </div>

            <div class="modal-body">
                <form @submit.prevent="handleSave">
                    <!-- Slot para contenido dinámico -->
                    <slot name="form-fields"></slot>

                    <div class="modal-footer">
                        <button type="button" class="btn-cancelar" @click="handleClose">
                            Cancelar
                        </button>
                        <button type="submit" class="btn-guardar">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Modal',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: 'Formulario'
        }
    },
    emits: ['close', 'save'],
    methods: {
        handleClose() {
            this.$emit('close')
        },
        handleSave() {
            this.$emit('save')
        }
    }
}
</script>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 16px;
    width: 90%;
    max-width: 550px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 1.75rem;
    border-bottom: 1px solid #e9ecef;
    background: white;
    border-radius: 16px 16px 0 0;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #94a3b8;
    transition: color 0.2s;
    line-height: 1;
}

.close-btn:hover {
    color: #ef4444;
}

.modal-body {
    padding: 1.75rem;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
}

.btn-cancelar {
    background: #f1f5f9;
    color: #475569;
    border: none;
    padding: 0.625rem 1.25rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-cancelar:hover {
    background: #e2e8f0;
    color: #1e293b;
}

.btn-guardar {
    background: #10b981;
    color: white;
    border: none;
    padding: 0.625rem 1.5rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-guardar:hover {
    background: #059669;
    transform: translateY(-1px);
}

/* Estilos para los campos del formulario */
:deep(.form-group) {
    margin-bottom: 1.25rem;
}

:deep(.form-group label) {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #334155;
    font-size: 0.875rem;
}

:deep(.form-group input),
:deep(.form-group select),
:deep(.form-group textarea) {
    width: 100%;
    padding: 0.625rem 0.875rem;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 0.875rem;
    transition: all 0.2s;
    background: white;
}

:deep(.form-group input:focus),
:deep(.form-group select:focus),
:deep(.form-group textarea:focus) {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

:deep(.form-group input::placeholder),
:deep(.form-group textarea::placeholder) {
    color: #94a3b8;
}

:deep(.form-group textarea) {
    resize: vertical;
    font-family: inherit;
}

:deep(.form-row) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

:deep(.form-row .form-group) {
    margin-bottom: 0;
}

/* Scrollbar personalizada */
.modal-content::-webkit-scrollbar {
    width: 6px;
}

.modal-content::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>