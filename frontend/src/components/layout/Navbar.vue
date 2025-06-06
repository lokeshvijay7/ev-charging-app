<template>
  <div>
    <!-- Top Navigation Bar -->
    <v-app-bar 
      app 
      flat 
      class="modern-navbar"
      height="64"
    >
      <v-container fluid class="pa-0">
        <div class="navbar-content">
          <!-- Mobile Menu Button -->
          <v-btn 
            icon
            variant="text"
            class="mobile-menu-btn d-md-none"
            @click="drawer = !drawer"
          >
            <v-icon size="20">mdi-menu</v-icon>
          </v-btn>
          
          <!-- Logo/Brand -->
          <router-link to="/" class="brand-link">
            <div class="brand">
              <v-icon size="24" class="brand-icon">mdi-ev-station</v-icon>
              <span class="brand-text">EV Charger</span>
            </div>
          </router-link>
          
          <!-- Desktop Navigation -->
          <nav class="desktop-nav d-none d-md-flex">
            <router-link 
              v-for="item in navItems" 
              :key="item.path"
              :to="item.path" 
              class="nav-link"
              active-class="nav-link--active"
            >
              {{ item.title }}
            </router-link>
          </nav>
          
          <!-- Right Actions -->
          <div class="nav-actions">
            <!-- Theme Toggle -->
            <v-btn 
              icon
              variant="text"
              class="action-btn"
              @click="toggleTheme"
            >
              <v-icon size="18">{{ isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
            </v-btn>
            
            <!-- User Menu -->
            <v-menu offset-y>
              <template v-slot:activator="{ props }">
                <v-btn 
                  class="user-btn"
                  v-bind="props"
                  variant="text"
                >
                  <v-avatar size="32" class="user-avatar">
                    <v-icon size="18">mdi-account-circle</v-icon>
                  </v-avatar>
                </v-btn>
              </template>
              
              <v-card class="user-menu" elevation="8">
                <v-card-text class="pa-4">
                  <div class="user-info">
                    <div class="user-name">{{ user ? user.name : 'User' }}</div>
                    <div class="user-email">{{ user ? user.email : 'user@example.com' }}</div>
                  </div>
                </v-card-text>
                
                <v-divider></v-divider>
                
                <v-list class="pa-0">
                  <v-list-item @click="logout" class="logout-item">
                    <template v-slot:prepend>
                      <v-icon size="18">mdi-logout</v-icon>
                    </template>
                    <v-list-item-title>Sign Out</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </div>
        </div>
      </v-container>
    </v-app-bar>
    
    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer 
      v-model="drawer" 
      app 
      temporary
      class="mobile-drawer"
      width="280"
    >
      <div class="drawer-content">
        <!-- Drawer Header -->
        <div class="drawer-header">
          <div class="drawer-brand">
            <v-icon size="24" class="brand-icon">mdi-ev-station</v-icon>
            <span class="brand-text">EV Charger</span>
          </div>
        </div>
        
        <!-- Navigation Links -->
        <v-list class="drawer-nav">
          <v-list-item
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="drawer-nav-item"
            @click="drawer = false"
          >
            <template v-slot:prepend>
              <v-icon size="20">{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AppNavbar',
  data() {
    return {
      drawer: false,
      isDarkTheme: false,
      navItems: [
        { title: 'Dashboard', path: '/dashboard', icon: 'mdi-view-dashboard' },
        { title: 'Stations', path: '/stations', icon: 'mdi-ev-station' },
        { title: 'Map', path: '/stations/map', icon: 'mdi-map' },
        { title: 'Add Station', path: '/stations/new', icon: 'mdi-plus-circle' }
      ]
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    },
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      this.$vuetify.theme.global.name = this.isDarkTheme ? 'dark' : 'light';
    }
  },
  created() {
    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.isDarkTheme = true;
      this.$vuetify.theme.global.name = 'dark';
    }
  }
}
</script>

<style scoped>
.modern-navbar {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
}

/* Brand */
.brand-link {
  text-decoration: none;
  color: inherit;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-icon {
  color: #007aff;
}

.brand-text {
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
  letter-spacing: -0.02em;
}

/* Desktop Navigation */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: #515154;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;
}

.nav-link:hover {
  color: #007aff;
  background: rgba(0, 122, 255, 0.08);
}

.nav-link--active {
  color: #007aff;
  background: rgba(0, 122, 255, 0.1);
}

/* Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn,
.mobile-menu-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  color: #515154;
}

.action-btn:hover,
.mobile-menu-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #007aff;
}

.user-btn {
  border-radius: 10px;
  min-width: 40px;
  height: 40px;
  padding: 0 8px;
}

.user-avatar {
  background: rgba(0, 122, 255, 0.1);
  color: #007aff;
}

/* User Menu */
.user-menu {
  min-width: 200px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.user-info {
  text-align: center;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 4px;
}

.user-email {
  font-size: 12px;
  color: #86868b;
}

.logout-item {
  color: #ff3b30;
  border-radius: 0 0 12px 12px;
}

.logout-item:hover {
  background: rgba(255, 59, 48, 0.08);
}

/* Mobile Drawer */
.mobile-drawer {
  border-radius: 0 20px 20px 0;
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.drawer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.drawer-nav {
  flex: 1;
  padding: 16px 0;
}

.drawer-nav-item {
  margin: 4px 16px;
  border-radius: 12px;
  color: #515154;
}

.drawer-nav-item:hover {
  background: rgba(0, 122, 255, 0.08);
  color: #007aff;
}

.drawer-nav-item.v-list-item--active {
  background: rgba(0, 122, 255, 0.1);
  color: #007aff;
}

/* Dark Theme */
.v-theme--dark .modern-navbar {
  background: rgba(28, 28, 30, 0.8) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .brand-text {
  color: #f5f5f7;
}

.v-theme--dark .nav-link {
  color: #a1a1a6;
}

.v-theme--dark .nav-link:hover {
  color: #007aff;
  background: rgba(0, 122, 255, 0.15);
}

.v-theme--dark .nav-link--active {
  color: #007aff;
  background: rgba(0, 122, 255, 0.2);
}

.v-theme--dark .action-btn,
.v-theme--dark .mobile-menu-btn {
  color: #a1a1a6;
}

.v-theme--dark .action-btn:hover,
.v-theme--dark .mobile-menu-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #007aff;
}

.v-theme--dark .user-menu {
  background: #1c1c1e;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .user-name {
  color: #f5f5f7;
}

.v-theme--dark .drawer-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .drawer-nav-item {
  color: #a1a1a6;
}

.v-theme--dark .drawer-nav-item:hover {
  background: rgba(0, 122, 255, 0.15);
  color: #007aff;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-content {
    padding: 0 16px;
  }
  
  .brand-text {
    font-size: 16px;
  }
}
</style>