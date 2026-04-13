<template>
  <div class="about-container">
    <div class="about-card">
      <div class="about-header">
        <h1>Ingenieros para el Futuro</h1>
        <p class="tagline">Construyendo el futuro, un desarrollador a la vez</p>
      </div>

      <div class="about-content">
        <!-- Creador -->
        <div class="info-section">
          <div class="section-icon">👨‍💻</div>
          <h2>Creador</h2>
          <p class="creator-name">Raúl Manuel Diez Canseco Gallegos</p>
        </div>

        <!-- Objetivo -->
        <div class="info-section">
          <div class="section-icon">🎯</div>
          <h2>Objetivo</h2>
          <p>
            Apoyar a jóvenes a iniciarse en el desarrollo de software para poder trabajar
            en empresas de alto nivel. Tener contacto con Patrocinadores como Mentores,
            apoyo en el desarrollo profesional e incluso poder tener su primera oportunidad
            de trabajo.
          </p>
        </div>

        <!-- Misión -->
        <div class="info-section">
          <div class="section-icon">⭐</div>
          <h2>Misión</h2>
          <p>
            Democratizar el acceso a la educación en tecnología, brindando herramientas,
            mentorías y oportunidades de conexión con la industria para jóvenes
            talentos que desean iniciar su carrera en el desarrollo de software.
          </p>
        </div>

        <!-- Visión -->
        <div class="info-section">
          <div class="section-icon">🚀</div>
          <h2>Visión</h2>
          <p>
            Ser la plataforma líder en Latinoamérica que conecta a futuros desarrolladores
            con oportunidades reales en la industria tecnológica, creando una comunidad
            de excelencia y crecimiento profesional.
          </p>
        </div>

        <!-- Organización -->
        <div class="info-section highlight">
          <div class="section-icon">🤝</div>
          <h2>Organización</h2>
          <p>
            <strong>Ingenieros para el Futuro</strong> es una organización
            <span class="highlight-text">sin fines de lucro</span> y de
            <span class="highlight-text">trabajo voluntario</span>.
          </p>
        </div>

        <!-- Valores -->
        <div class="values-section">
          <h3>Valores que nos guían</h3>
          <div class="values-grid">
            <div class="value-item">
              <span class="value-icon">💡</span>
              <span>Innovación</span>
            </div>
            <div class="value-item">
              <span class="value-icon">🤝</span>
              <span>Solidaridad</span>
            </div>
            <div class="value-item">
              <span class="value-icon">📚</span>
              <span>Educación</span>
            </div>
            <div class="value-item">
              <span class="value-icon">🌍</span>
              <span>Inclusión</span>
            </div>
            <div class="value-item">
              <span class="value-icon">🏆</span>
              <span>Excelencia</span>
            </div>
            <div class="value-item">
              <span class="value-icon">🤗</span>
              <span>Comunidad</span>
            </div>
          </div>
        </div>
      </div>

      <div class="about-footer">
        <p>© 2024 Ingenieros para el Futuro - Todos los derechos reservados</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
}
</script>

<style scoped>
.about-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 1rem;
}

.about-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 900px;
  overflow: hidden;
}

.about-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  text-align: center;
  color: white;
}

.about-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 700;
}

.tagline {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.9;
}

.about-content {
  padding: 2rem;
}

.info-section {
  margin-bottom: 2rem;
  text-align: center;
}

.section-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.info-section h2 {
  color: #475569;
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.info-section p {
  color: #1e293b;
  font-size: 0.95rem;
  line-height: 1.6;
  text-align: justify;
}

.creator-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #667eea !important;
  text-align: center !important;
}

.highlight {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 1.5rem;
  border-radius: 16px;
  margin-top: 1rem;
}

.highlight-text {
  color: #667eea;
  font-weight: 600;
}

.values-section {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px solid #e9ecef;
}

.values-section h3 {
  text-align: center;
  color: #475569;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.value-item {
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 12px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #475569;
  transition: all 0.3s;
}

.value-item:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.value-icon {
  font-size: 1.25rem;
}

.about-footer {
  background: #f8fafc;
  padding: 1rem;
  text-align: center;
  border-top: 1px solid #e9ecef;
}

.about-footer p {
  margin: 0;
  font-size: 0.75rem;
  color: #94a3b8;
}

/* ============================================ */
/* RESPONSIVE: MÓVIL (menos de 768px) */
/* ============================================ */
@media (max-width: 768px) {
  .about-container {
    padding: 0.75rem;
    min-height: calc(100vh - 150px);
  }

  .about-card {
    border-radius: 16px;
  }

  .about-header {
    padding: 1.5rem;
  }

  .about-header h1 {
    font-size: 1.25rem;
  }

  .tagline {
    font-size: 0.75rem;
  }

  .about-content {
    padding: 1.25rem;
  }

  .section-icon {
    font-size: 2rem;
  }

  .info-section h2 {
    font-size: 1.1rem;
  }

  .info-section p {
    font-size: 0.85rem;
  }

  .creator-name {
    font-size: 1rem;
  }

  .highlight {
    padding: 1rem;
  }

  .values-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .value-item {
    padding: 0.5rem;
    font-size: 0.75rem;
  }

  .about-footer p {
    font-size: 0.65rem;
  }
}

/* ============================================ */
/* RESPONSIVE: PANTALLAS MUY PEQUEÑAS (menos de 480px) */
/* ============================================ */
@media (max-width: 480px) {
  .about-header {
    padding: 1rem;
  }

  .about-header h1 {
    font-size: 1rem;
  }

  .about-content {
    padding: 1rem;
  }

  .section-icon {
    font-size: 1.75rem;
  }

  .info-section h2 {
    font-size: 1rem;
  }

  .info-section p {
    font-size: 0.8rem;
  }

  .values-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}

/* ============================================ */
/* RESPONSIVE: TABLET (768px a 1024px) */
/* ============================================ */
@media (min-width: 769px) and (max-width: 1024px) {
  .about-card {
    max-width: 85%;
  }

  .values-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>