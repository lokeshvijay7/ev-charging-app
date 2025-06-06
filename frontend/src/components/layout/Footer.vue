<template>
  <v-footer class="modern-footer">
    <v-container fluid class="pa-0">
      <div class="footer-content">
        <div class="footer-main">
          <div class="brand-section">
            <h3 class="brand-name">EV Charger</h3>
            <p class="brand-tagline">Powering your journey forward</p>
          </div>
          
          <div class="links-section">
            <div class="link-group">
              <h4 class="link-title">Platform</h4>
              <a href="#" class="footer-link">Dashboard</a>
              <a href="#" class="footer-link">Stations</a>
              <a href="#" class="footer-link">Map View</a>
            </div>
            
            <div class="link-group">
              <h4 class="link-title">Support</h4>
              <a href="#" class="footer-link">Help Center</a>
              <a href="#" class="footer-link">Contact</a>
              <a href="#" class="footer-link">Privacy</a>
            </div>
            
            <div class="link-group">
              <h4 class="link-title">Connect</h4>
              <a href="#" class="footer-link">Twitter</a>
              <a href="#" class="footer-link">LinkedIn</a>
              <a href="#" class="footer-link">GitHub</a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="copyright">
            © {{ new Date().getFullYear() }} EV Charger. All rights reserved.
          </div>
        </div>
      </div>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.modern-footer {
  background: linear-gradient(180deg, #fafafa 0%, #f5f5f7 100%);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(20px);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px 24px;
}

.footer-main {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 48px;
  margin-bottom: 32px;
}

.brand-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.brand-name {
  font-size: 24px;
  font-weight: 600;
  color: #1d1d1f;
  letter-spacing: -0.02em;
  margin: 0;
}

.brand-tagline {
  font-size: 16px;
  color: #6e6e73;
  margin: 0;
  line-height: 1.4;
}

.links-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.link-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link-title {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 4px 0;
  letter-spacing: -0.01em;
}

.footer-link {
  font-size: 14px;
  color: #515154;
  text-decoration: none;
  line-height: 1.4;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #007aff;
}

.footer-bottom {
  padding-top: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.copyright {
  font-size: 12px;
  color: #86868b;
  text-align: center;
  letter-spacing: -0.01em;
}

/* Dark theme */
.v-theme--dark .modern-footer {
  background: linear-gradient(180deg, #1d1d1f 0%, #161618 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .brand-name {
  color: #f5f5f7;
}

.v-theme--dark .brand-tagline {
  color: #a1a1a6;
}

.v-theme--dark .link-title {
  color: #f5f5f7;
}

.v-theme--dark .footer-link {
  color: #a1a1a6;
}

.v-theme--dark .footer-link:hover {
  color: #007aff;
}

.v-theme--dark .footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .copyright {
  color: #86868b;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .links-section {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .footer-content {
    padding: 32px 16px 16px;
  }
}
</style>