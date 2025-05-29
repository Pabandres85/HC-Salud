import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: `
    <div class="app-container">
      <header class="header">
        <h1>🏥 {{ title }}</h1>
        <p>Sistema de gestión clínica completo</p>
      </header>
      
      <main class="main-content">
        <div class="welcome-section">
          <h2>✨ ¡Aplicación funcionando perfectamente!</h2>
          
          <div class="status-grid">
            <div class="status-card">
              <div class="card-icon">🖥️</div>
              <h3>Frontend</h3>
              <p>Angular 19 + Docker</p>
              <span class="status-badge success">Activo</span>
            </div>
            
            <div class="status-card">
              <div class="card-icon">⚙️</div>
              <h3>Backend</h3>
              <p>ASP.NET Core API</p>
              <span class="status-badge success">Activo</span>
            </div>
            
            <div class="status-card">
              <div class="card-icon">🗄️</div>
              <h3>Base de Datos</h3>
              <p>PostgreSQL</p>
              <span class="status-badge success">Activo</span>
            </div>
            
            <div class="status-card">
              <div class="card-icon">🤖</div>
              <h3>AI Service</h3>
              <p>Python Flask</p>
              <span class="status-badge success">Activo</span>
            </div>
          </div>
          
          <div class="features-section">
            <h3>🚀 Módulos del sistema</h3>
            <div class="feature-grid">
              <div class="feature-item">
                <div class="feature-icon">👥</div>
                <div class="feature-content">
                  <h4>Gestión de Pacientes</h4>
                  <p>Registro y administración de información de pacientes</p>
                </div>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">📋</div>
                <div class="feature-content">
                  <h4>Historias Clínicas</h4>
                  <p>Creación y mantenimiento de expedientes médicos</p>
                </div>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">📊</div>
                <div class="feature-content">
                  <h4>Reportes y Analytics</h4>
                  <p>Análisis estadístico y generación de informes</p>
                </div>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">🔐</div>
                <div class="feature-content">
                  <h4>Seguridad</h4>
                  <p>Sistema de autenticación y autorización</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer class="footer">
        <p>&copy; 2025 Sistema de Psicología - Historia Clínica</p>
      </footer>
    </div>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .header {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      color: white;
      text-align: center;
      padding: 3rem 2rem;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .header h1 {
      font-size: 3.5rem;
      font-weight: 300;
      margin-bottom: 0.5rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .header p {
      font-size: 1.3rem;
      opacity: 0.9;
    }

    .main-content {
      flex: 1;
      padding: 4rem 2rem;
    }

    .welcome-section {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }

    .welcome-section h2 {
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: white;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .status-card {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 20px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .status-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 25px 50px rgba(0,0,0,0.2);
    }

    .status-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2);
    }

    .card-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .status-card h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      color: #2c3e50;
    }

    .status-card p {
      color: #666;
      margin-bottom: 1rem;
    }

    .status-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: bold;
    }

    .status-badge.success {
      background: #27ae60;
      color: white;
    }

    .features-section {
      background: rgba(255, 255, 255, 0.95);
      padding: 3rem;
      border-radius: 20px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
      margin-top: 3rem;
    }

    .features-section h3 {
      font-size: 2rem;
      margin-bottom: 2rem;
      color: #2c3e50;
      text-align: center;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 15px;
      transition: all 0.3s ease;
    }

    .feature-item:hover {
      background: #e9ecef;
      transform: translateX(10px);
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-right: 1.5rem;
      min-width: 60px;
    }

    .feature-content h4 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      color: #2c3e50;
    }

    .feature-content p {
      color: #666;
      font-size: 0.95rem;
      line-height: 1.4;
    }

    .footer {
      background: rgba(0, 0, 0, 0.2);
      color: white;
      text-align: center;
      padding: 2rem;
      backdrop-filter: blur(10px);
    }

    @media (max-width: 768px) {
      .header h1 {
        font-size: 2.5rem;
      }
      
      .welcome-section h2 {
        font-size: 1.8rem;
      }
      
      .main-content {
        padding: 2rem 1rem;
      }
      
      .feature-item {
        flex-direction: column;
        text-align: center;
      }
      
      .feature-icon {
        margin-right: 0;
        margin-bottom: 1rem;
      }
    }
  `]
})
export class AppComponent {
  title = 'Psicología - Historia Clínica';
}