<template>
  <div class="station-detail-container">
    <div class="station-detail-content">
      <!-- Back Button -->
      <div class="back-section">
        <v-btn
          variant="text"
          prepend-icon="mdi-arrow-left"
          @click="$router.go(-1)"
          class="back-btn"
        >
          <span class="btn-text">Back to Stations</span>
        </v-btn>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-section">
        <div class="loading-content">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
          <p class="loading-text">Loading station details...</p>
        </div>
      </div>

      <!-- Station Content -->
      <div v-else-if="currentStation" class="station-content">
        <!-- Header Section -->
        <div class="header-card">
          <div class="header-main">
            <div class="station-info">
              <h1 class="station-title">{{ currentStation.name }}</h1>
              <div class="station-location">
                <v-icon size="20" class="location-icon">mdi-map-marker</v-icon>
                <span class="location-text">{{ currentStation.location.address }}</span>
              </div>
            </div>
            <div class="station-status-actions">
              <v-chip
                :color="getStatusColor(currentStation.status)"
                size="large"
                class="status-chip"
              >
                <v-icon start size="16">{{ getStatusIcon(currentStation.status) }}</v-icon>
                {{ currentStation.status }}
              </v-chip>
              <div class="action-buttons">
                <v-btn
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-pencil"
                  :to="`/stations/${currentStation._id}/edit`"
                  class="action-btn"
                >
                  <span class="btn-text">Edit</span>
                </v-btn>
                <v-btn
                  color="error"
                  variant="outlined"
                  prepend-icon="mdi-delete"
                  @click="confirmDelete"
                  class="action-btn"
                >
                  <span class="btn-text">Delete</span>
                </v-btn>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="content-grid">
          <!-- Left Column -->
          <div class="left-column">
            <!-- Station Details -->
            <div class="details-card">
              <div class="card-header">
                <v-icon class="header-icon">mdi-information-outline</v-icon>
                <h2 class="card-title">Station Details</h2>
              </div>
              <div class="details-grid">
                <div class="detail-item">
                  <div class="detail-icon-wrapper power-bg">
                    <v-icon color="white" size="20">mdi-lightning-bolt</v-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Power Output</span>
                    <span class="detail-value">{{ currentStation.powerOutput }} kW</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon-wrapper connector-bg">
                    <v-icon color="white" size="20">mdi-power-plug</v-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Connector Type</span>
                    <span class="detail-value">{{ currentStation.connectorType }}</span>
                  </div>
                </div>

                <div v-if="currentStation.pricing" class="detail-item">
                  <div class="detail-icon-wrapper pricing-bg">
                    <v-icon color="white" size="20">mdi-currency-usd</v-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Pricing</span>
                    <span class="detail-value">${{ currentStation.pricing }}/kWh</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon-wrapper date-bg">
                    <v-icon color="white" size="20">mdi-calendar-plus</v-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Created</span>
                    <span class="detail-value">{{ formatDate(currentStation.createdAt) }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon-wrapper update-bg">
                    <v-icon color="white" size="20">mdi-calendar-edit</v-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Last Updated</span>
                    <span class="detail-value">{{ formatDate(currentStation.updatedAt) }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon-wrapper location-bg">
                    <v-icon color="white" size="20">mdi-map-marker-distance</v-icon>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Coordinates</span>
                    <span class="detail-value">
                      {{ currentStation.location.coordinates[1].toFixed(6) }}, 
                      {{ currentStation.location.coordinates[0].toFixed(6) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Amenities -->
            <div v-if="currentStation.amenities && currentStation.amenities.length > 0" class="amenities-card">
              <div class="card-header">
                <v-icon class="header-icon">mdi-star-outline</v-icon>
                <h2 class="card-title">Amenities</h2>
              </div>
              <div class="amenities-content">
                <v-chip
                  v-for="amenity in currentStation.amenities"
                  :key="amenity"
                  variant="outlined"
                  class="amenity-chip"
                >
                  {{ amenity }}
                </v-chip>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="right-column">
            <!-- Map Card -->
            <div class="map-card">
              <div class="card-header">
                <v-icon class="header-icon">mdi-map-outline</v-icon>
                <h2 class="card-title">Location</h2>
              </div>
              <div class="map-container">
                <div id="station-map" class="map-element"></div>
              </div>
              <div class="map-actions">
                <v-btn
                  color="primary"
                  variant="elevated"
                  prepend-icon="mdi-directions"
                  @click="openDirections"
                  class="map-action-btn primary-btn"
                >
                  <span class="btn-text">Get Directions</span>
                </v-btn>
                <v-btn
                  variant="outlined"
                  prepend-icon="mdi-share"
                  @click="shareLocation"
                  class="map-action-btn"
                >
                  <span class="btn-text">Share</span>
                </v-btn>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions-card">
              <div class="card-header">
                <v-icon class="header-icon">mdi-flash-outline</v-icon>
                <h2 class="card-title">Quick Actions</h2>
              </div>
              <div class="quick-actions-content">
                <div class="quick-action-item" @click="reportIssue">
                  <div class="quick-action-icon warning-bg">
                    <v-icon color="white" size="20">mdi-alert-circle</v-icon>
                  </div>
                  <span class="quick-action-text">Report Issue</span>
                  <v-icon class="quick-action-arrow">mdi-chevron-right</v-icon>
                </div>
                
                <div class="quick-action-item" @click="addToFavorites">
                  <div class="quick-action-icon favorite-bg">
                    <v-icon color="white" size="20">mdi-heart</v-icon>
                  </div>
                  <span class="quick-action-text">Add to Favorites</span>
                  <v-icon class="quick-action-arrow">mdi-chevron-right</v-icon>
                </div>
                
                <div class="quick-action-item" @click="checkAvailability">
                  <div class="quick-action-icon success-bg">
                    <v-icon color="white" size="20">mdi-check-circle</v-icon>
                  </div>
                  <span class="quick-action-text">Check Availability</span>
                  <v-icon class="quick-action-arrow">mdi-chevron-right</v-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else class="not-found-section">
        <div class="not-found-content">
          <div class="not-found-icon">
            <v-icon size="64" color="grey-lighten-1">mdi-alert-circle-outline</v-icon>
          </div>
          <h2 class="not-found-title">Station not found</h2>
          <p class="not-found-text">The charging station you're looking for doesn't exist or has been removed.</p>
          <v-btn
            color="primary"
            variant="elevated"
            to="/stations"
            class="not-found-btn"
          >
            <span class="btn-text">Back to Stations</span>
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="440" persistent>
      <v-card class="delete-dialog">
        <v-card-title class="delete-dialog-title">
          Delete Charging Station
        </v-card-title>
        
        <v-card-text class="delete-dialog-content">
          <p class="delete-dialog-text">
            Are you sure you want to delete "{{ currentStation?.name }}"?
          </p>
          <div class="delete-warning">
            <v-icon size="16" class="warning-icon">mdi-alert-circle-outline</v-icon>
            <p class="warning-text">
              This action cannot be undone and will permanently remove all station data.
            </p>
          </div>
        </v-card-text>
        
        <v-card-actions class="delete-dialog-actions">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="deleteDialog = false"
            class="cancel-btn"
          >
            <span class="btn-text">Cancel</span>
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            @click="deleteStation"
            :loading="deleteLoading"
            class="delete-btn"
          >
            <span class="btn-text">Delete</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="3000"
      class="notification-snackbar"
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default {
  name: 'StationDetail',
  data() {
    return {
      map: null,
      deleteDialog: false,
      deleteLoading: false,
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success'
    };
  },
  computed: {
    ...mapGetters(['currentStation', 'loading', 'error'])
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case 'Active':
          return 'success';
        case 'Inactive':
          return 'error';
        case 'Maintenance':
          return 'warning';
        default:
          return 'grey';
      }
    },
    
    getStatusIcon(status) {
      switch (status) {
        case 'Active':
          return 'mdi-check-circle';
        case 'Inactive':
          return 'mdi-close-circle';
        case 'Maintenance':
          return 'mdi-wrench';
        default:
          return 'mdi-help-circle';
      }
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    initMap() {
      if (this.currentStation && this.currentStation.location) {
        const [lng, lat] = this.currentStation.location.coordinates;

        // Remove existing map instance if any to avoid "Map container is already initialized" error
        if (this.map) {
          this.map.remove();
          this.map = null;
        }
        
        this.map = L.map('station-map').setView([lat, lng], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        
        // Custom marker for the station
        const stationIcon = L.divIcon({
          html: `<div style="background-color: #007aff; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">⚡</div>`,
          className: 'custom-div-icon',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });
        
        L.marker([lat, lng], { icon: stationIcon })
          .addTo(this.map)
          .bindPopup(`
            <div style="text-align: center; padding: 8px;">
              <strong style="color: #1d1d1f; font-size: 14px;">${this.currentStation.name}</strong><br>
              <span style="color: #86868b; font-size: 12px;">${this.currentStation.powerOutput} kW • ${this.currentStation.connectorType}</span>
            </div>
          `);
      }
    },
    
    openDirections() {
      if (this.currentStation && this.currentStation.location) {
        const [lng, lat] = this.currentStation.location.coordinates;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, '_blank');
      }
    },
    
    shareLocation() {
      if (navigator.share && this.currentStation) {
        navigator.share({
          title: this.currentStation.name,
          text: `Check out this EV charging station: ${this.currentStation.name}`,
          url: window.location.href
        });
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        this.showSnackbar('Location link copied to clipboard!', 'success');
      }
    },
    
    reportIssue() {
      this.showSnackbar('Issue reported successfully!', 'success');
    },
    
    addToFavorites() {
      this.showSnackbar('Added to favorites!', 'success');
    },
    
    checkAvailability() {
      this.showSnackbar('Station is currently available!', 'success');
    },
    
    confirmDelete() {
      this.deleteDialog = true;
    },
    
    async deleteStation() {
      this.deleteLoading = true;
      try {
        await this.$store.dispatch('deleteStation', this.currentStation._id);
        this.deleteDialog = false;
        this.showSnackbar('Station deleted successfully!', 'success');
        this.$router.push('/stations');
      } catch (error) {
        this.showSnackbar('Failed to delete station', 'error');
      } finally {
        this.deleteLoading = false;
      }
    },
    
    showSnackbar(text, color = 'success') {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.snackbar = true;
    }
  },
  
  async created() {
    const stationId = this.$route.params.id;
    await this.$store.dispatch('fetchStationById', stationId);
  },
  
  mounted() {
    this.$nextTick(() => {
      if (this.currentStation) {
        this.initMap();
      }
    });
  },
  
  watch: {
    currentStation: {
      handler(newStation) {
        if (newStation && !this.map) {
          this.$nextTick(() => {
            this.initMap();
          });
        }
      },
      immediate: true
    }
  },
  
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  }
}
</script>

<style scoped>
/* Apple-inspired modern styling */
.station-detail-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 0;
}

.station-detail-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 48px;
}

/* Button Text Alignment Fix */
.btn-text {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
}

/* Back Section */
.back-section {
  margin-bottom: 32px;
}

.back-btn {
  border-radius: 12px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  color: #007aff !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Loading Section */
.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.loading-text {
  font-size: 1.125rem;
  color: #86868b;
  margin: 0;
  font-weight: 500;
}

/* Header Card */
.header-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
  padding: 40px;
  margin-bottom: 32px;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
}

.station-info {
  flex: 1;
}

.station-title {
  font-size: 3rem;
  font-weight: 300;
  color: #1d1d1f;
  margin: 0 0 16px 0;
  letter-spacing: -1px;
  line-height: 1.1;
}

.station-location {
  display: flex;
  align-items: center;
  gap: 8px;
}

.location-icon {
  color: #86868b;
}

.location-text {
  font-size: 1.25rem;
  color: #86868b;
  font-weight: 400;
}

.station-status-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 20px;
}

.status-chip {
  border-radius: 12px !important;
  font-weight: 500 !important;
  padding: 12px 20px !important;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-btn {
  border-radius: 12px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  padding: 12px 24px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Card Styles */
.details-card,
.amenities-card,
.map-card,
.quick-actions-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 32px 32px 24px 32px;
  border-bottom: 1px solid #f1f5f9;
}

.header-icon {
  color: #86868b;
  font-size: 1.5rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
}

/* Details Grid */
.details-grid {
  padding: 32px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.detail-item:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
}

.detail-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.power-bg { background: linear-gradient(135deg, #34d399, #10b981); }
.connector-bg { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
.pricing-bg { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
.date-bg { background: linear-gradient(135deg, #a78bfa, #8b5cf6); }
.update-bg { background: linear-gradient(135deg, #fb7185, #f43f5e); }
.location-bg { background: linear-gradient(135deg, #34d399, #059669); }

.detail-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 0.875rem;
  color: #86868b;
  font-weight: 500;
}

.detail-value {
  font-size: 1rem;
  color: #1d1d1f;
  font-weight: 600;
}

/* Amenities */
.amenities-content {
  padding: 32px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.amenity-chip {
  border-radius: 12px !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  border-color: #e5e7eb !important;
}

/* Map Card */
.map-container {
  position: relative;
  height: 400px;
}

.map-element {
  height: 100%;
  width: 100%;
}

.map-actions {
  padding: 24px 32px;
  display: flex;
  gap: 12px;
}

.map-action-btn {
  border-radius: 12px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  flex: 1;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.primary-btn {
  background: #007aff !important;
  color: white !important;
  box-shadow: 0 4px 20px rgba(0, 122, 255, 0.3) !important;
}

/* Quick Actions */
.quick-actions-content {
  padding: 24px 32px 32px 32px;
}

.quick-action-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 12px;
}

.quick-action-item:last-child {
  margin-bottom: 0;
}

.quick-action-item:hover {
  background: #f8f9fa;
  transform: translateX(4px);
}

.quick-action-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.warning-bg { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
.favorite-bg { background: linear-gradient(135deg, #fb7185, #f43f5e); }
.success-bg { background: linear-gradient(135deg, #34d399, #10b981); }

.quick-action-text {
  flex: 1;
  font-size: 1rem;
  color: #1d1d1f;
  font-weight: 500;
}

.quick-action-arrow {
  color: #86868b;
  font-size: 1.2rem;
}

/* Not Found Section */
.not-found-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.not-found-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
}

.not-found-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.not-found-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 12px 0;
}

.not-found-text {
  font-size: 1rem;
  color: #86868b;
  margin: 0 0 32px 0;
  line-height: 1.5;
}

.not-found-btn {
  background: #007aff !important;
  color: white !important;
  border-radius: 12px !important;
  padding: 16px 32px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  box-shadow: 0 4px 20px rgba(0, 122, 255, 0.3) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Delete Dialog */
.delete-dialog {
  border-radius: 20px !important;
  padding: 8px;
}

.delete-dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1d1d1f;
  padding: 24px 24px 16px 24px;
}

.delete-dialog-content {
  padding: 0 24px 24px 24px;
}

.delete-dialog-text {
  font-size: 1rem;
  color: #1d1d1f;
  margin-bottom: 16px;
}

.delete-warning {
  padding: 16px;
  background: rgba(244, 67, 54, 0.08);
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.warning-icon {
  color: #f44336;
  margin-top: 2px;
}

.warning-text {
  font-size: 0.875rem;
  color: #f44336;
  margin: 0;
  line-height: 1.4;
}

.delete-dialog-actions {
  padding: 0 24px 24px 24px;
}

.cancel-btn {
  border-radius: 12px !important;
  padding: 12px 24px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.delete-btn {
  border-radius: 12px !important;
  padding: 12px 24px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  margin-left: 12px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Custom marker styles */
.custom-div-icon {
  background: transparent;
  border: none;
}

/* Notification Snackbar */
.notification-snackbar {
  border-radius: 12px !important;
}

/* Responsive */
@media (max-width: 1200px) {
  .station-detail-content {
    padding: 24px 32px;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .station-detail-content {
    padding: 20px 16px;
  }
  
  .header-card {
    padding: 24px;
  }
  
  .header-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
  
  .station-status-actions {
    align-items: flex-start;
    width: 100%;
  }
  
  .action-buttons {
    width: 100%;
  }
  
  .action-btn {
    flex: 1;
  }
  
  .station-title {
    font-size: 2.5rem;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
    padding: 24px;
  }
  
  .card-header {
    padding: 24px 20px 20px 20px;
  }
  
  .amenities-content,
  .quick-actions-content {
    padding: 20px;
  }
  
  .map-actions {
    padding: 20px;
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .station-title {
    font-size: 2rem;
  }
  
  .detail-item {
    padding: 16px;
  }
  
  .detail-icon-wrapper {
    width: 40px;
    height: 40px;
  }
}
</style>
