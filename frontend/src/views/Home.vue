<template>
  <div class="home">
    <v-container fluid class="pa-0">
      <!-- Hero Section -->
      <section class="hero-section">
        <v-container class="hero-container">
          <v-row align="center" justify="center" class="hero-row">
            <v-col cols="12" lg="6" class="hero-text-col">
              <div class="hero-content">
                <h1 class="hero-title">
                  Find EV Charging
                  <span class="hero-title-accent">Stations Near You</span>
                </h1>
                <p class="hero-subtitle">
                  Locate, manage, and navigate to electric vehicle charging stations with our comprehensive platform.
                </p>
                <div class="hero-actions">
                  <v-btn
                    to="/login"
                    class="hero-btn-primary"
                    size="large"
                    variant="elevated"
                  >
                    <span class="btn-text">Get Started</span>
                  </v-btn>
                  <v-btn
                    to="/register"
                    class="hero-btn-secondary"
                    size="large"
                    variant="outlined"
                  >
                    <span class="btn-text">Sign Up</span>
                  </v-btn>
                </div>
              </div>
            </v-col>
            <v-col cols="12" lg="6" class="hero-visual-col">
              <div class="hero-visual">
                <div class="hero-main-circle">
                  <v-icon size="120" color="white">mdi-lightning-bolt</v-icon>
                </div>
                <div class="floating-element element-1">
                  <v-icon size="32" color="white">mdi-lightning-bolt</v-icon>
                </div>
                <div class="floating-element element-2">
                  <v-icon size="24" color="white">mdi-map-marker</v-icon>
                </div>
                <div class="floating-element element-3">
                  <v-icon size="28" color="white">mdi-ev-station</v-icon>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>
      
      <!-- Features Section -->
      <section class="features-section">
        <v-container class="features-container">
          <v-row justify="center">
            <v-col cols="12" class="text-center features-header">
              <h2 class="features-title">Everything you need</h2>
              <p class="features-subtitle">Comprehensive tools to manage EV charging stations efficiently</p>
            </v-col>
          </v-row>
          
          <v-row justify="center" class="features-grid">
            <v-col cols="12" sm="6" lg="4" class="feature-col">
              <v-card class="feature-card" elevation="0">
                <div class="feature-card-content">
                  <div class="feature-icon-container">
                    <div class="feature-icon-wrapper feature-icon-blue">
                      <v-icon size="32" color="white">mdi-map-marker</v-icon>
                    </div>
                  </div>
                  <h3 class="feature-title">Find Stations</h3>
                  <p class="feature-text">
                    Easily locate charging stations near you with our interactive map and real-time availability.
                  </p>
                </div>
              </v-card>
            </v-col>
            
            <v-col cols="12" sm="6" lg="4" class="feature-col">
              <v-card class="feature-card" elevation="0">
                <div class="feature-card-content">
                  <div class="feature-icon-container">
                    <div class="feature-icon-wrapper feature-icon-green">
                      <v-icon size="32" color="white">mdi-filter</v-icon>
                    </div>
                  </div>
                  <h3 class="feature-title">Smart Filtering</h3>
                  <p class="feature-text">
                    Filter stations by connector type, power output, and availability status for optimal results.
                  </p>
                </div>
              </v-card>
            </v-col>
            
            <v-col cols="12" sm="6" lg="4" class="feature-col">
              <v-card class="feature-card" elevation="0">
                <div class="feature-card-content">
                  <div class="feature-icon-container">
                    <div class="feature-icon-wrapper feature-icon-purple">
                      <v-icon size="32" color="white">mdi-account</v-icon>
                    </div>
                  </div>
                  <h3 class="feature-title">User Management</h3>
                  <p class="feature-text">
                    Create and manage your account to access personalized features and station history.
                  </p>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>
      
      <!-- CTA Section -->
      <section class="cta-section">
        <v-container class="cta-container">
          <v-row justify="center">
            <v-col cols="12" md="10" lg="8" class="text-center">
              <div class="cta-content">
                <h2 class="cta-title">Ready to get started?</h2>
                <p class="cta-subtitle">Join our platform today and start managing EV charging stations efficiently with our modern tools.</p>
                <div class="cta-btn-container">
                  <v-btn
                    to="/register"
                    class="cta-btn"
                    size="large"
                    variant="elevated"
                  >
                    <span class="btn-text">Sign Up Now</span>
                    <v-icon class="ml-2">mdi-arrow-right</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
/* Apple-inspired modern styling */
.home {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #007aff 0%, #5ac8fa 100%);
  color: white;
  padding: 100px 0;
  position: relative;
  overflow: hidden;
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.hero-container {
  max-width: 1200px !important;
}

.hero-row {
  min-height: 60vh;
}

.hero-text-col {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-visual-col {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  max-width: 600px;
  text-align: left;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 300;
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -1px;
}

.hero-title-accent {
  display: block;
  font-weight: 600;
  color: #ffffff;
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.5;
  margin-bottom: 40px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-start;
  align-items: center;
}

.btn-text {
  display: inline-block;
  text-align: center;
  width: 100%;
}

.hero-btn-primary {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  backdrop-filter: blur(10px);
  border-radius: 12px !important;
  padding: 16px 32px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  font-size: 1.1rem !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-btn-primary:hover {
  background: rgba(255, 255, 255, 0.3) !important;
}

.hero-btn-secondary {
  background: transparent !important;
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  border-radius: 12px !important;
  padding: 16px 32px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  font-size: 1.1rem !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

/* Hero Visual */
.hero-visual {
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-main-circle {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: float 6s ease-in-out infinite;
}

.floating-element {
  position: absolute;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.element-1 {
  top: 20px;
  right: 40px;
  animation: float 4s ease-in-out infinite;
}

.element-2 {
  bottom: 60px;
  left: 20px;
  width: 50px;
  height: 50px;
  animation: float 5s ease-in-out infinite reverse;
}

.element-3 {
  top: 120px;
  left: 40px;
  width: 55px;
  height: 55px;
  animation: float 4.5s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Features Section */
.features-section {
  padding: 120px 0;
  background: white;
}

.features-container {
  max-width: 1200px !important;
}

.features-header {
  margin-bottom: 80px;
  text-align: center;
}

.features-title {
  font-size: 3rem;
  font-weight: 300;
  color: #1d1d1f;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.features-subtitle {
  font-size: 1.25rem;
  color: #86868b;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
}

.features-grid {
  max-width: 1000px;
  margin: 0 auto;
}

.feature-col {
  display: flex;
  margin-bottom: 32px;
}

.feature-card {
  border-radius: 20px !important;
  border: 1px solid #f1f5f9 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: stretch;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}

.feature-card-content {
  padding: 40px 32px;
  text-align: center;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.feature-icon-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.feature-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon-blue {
  background: linear-gradient(135deg, #007aff, #5ac8fa);
}

.feature-icon-green {
  background: linear-gradient(135deg, #34c759, #30d158);
}

.feature-icon-purple {
  background: linear-gradient(135deg, #af52de, #bf5af2);
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 16px;
  width: 100%;
  text-align: center;
}

.feature-text {
  color: #86868b;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  text-align: center;
}

/* CTA Section */
.cta-section {
  padding: 120px 0;
  background: #f8f9fa;
}

.cta-container {
  max-width: 1200px !important;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.cta-title {
  font-size: 3rem;
  font-weight: 300;
  color: #1d1d1f;
  margin-bottom: 24px;
  letter-spacing: -0.5px;
}

.cta-subtitle {
  font-size: 1.25rem;
  color: #86868b;
  margin-bottom: 40px;
  line-height: 1.5;
}

.cta-btn-container {
  display: flex;
  justify-content: center;
}

.cta-btn {
  background: #007aff !important;
  color: white !important;
  border-radius: 12px !important;
  padding: 20px 48px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  font-size: 1.1rem !important;
  box-shadow: 0 4px 20px rgba(0, 122, 255, 0.3) !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cta-btn:hover {
  background: #0056cc !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 122, 255, 0.4) !important;
}

/* Responsive Design */
@media (max-width: 1264px) {
  .features-grid {
    max-width: 900px;
  }
}

@media (max-width: 960px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .features-title,
  .cta-title {
    font-size: 2.2rem;
  }
  
  .hero-visual {
    width: 300px;
    height: 300px;
    margin-top: 40px;
  }
  
  .hero-main-circle {
    width: 250px;
    height: 250px;
  }
  
  .hero-section {
    padding: 80px 0;
  }
  
  .features-section,
  .cta-section {
    padding: 80px 0;
  }
}

@media (max-width: 600px) {
  .hero-section {
    padding: 60px 0;
    min-height: 70vh;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .features-title,
  .cta-title {
    font-size: 1.8rem;
  }
  
  .features-section,
  .cta-section {
    padding: 60px 0;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  
  .hero-content {
    text-align: center;
  }
  
  .hero-btn-primary,
  .hero-btn-secondary {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
  
  .feature-card-content {
    padding: 32px 24px;
  }
  
  .hero-visual {
    width: 250px;
    height: 250px;
  }
  
  .hero-main-circle {
    width: 200px;
    height: 200px;
  }
  
  .floating-element {
    width: 40px;
    height: 40px;
  }
  
  .element-2 {
    width: 35px;
    height: 35px;
  }
  
  .element-3 {
    width: 38px;
    height: 38px;
  }
}
</style>
